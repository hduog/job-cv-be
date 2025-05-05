import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { userModel } from './userModel';

const COMPLAIN_COLLECTION_NAME = 'complains';
const COMPLAIN_COLLECTION_SHEMA = Joi.object({
  jobSeekerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  employerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  isResolved: Joi.boolean().default(false),
  _destroy: Joi.boolean().default(false)
});
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(COMPLAIN_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const totalComplain = async () => {
  try {
    const complains = await GET_DB().collection(COMPLAIN_COLLECTION_NAME).countDocuments({
      _destroy: false,
      isResolved: false
    });

    return complains;
  } catch (error) {
    throw new Error(error);
  }
};
const validateBeforeCreate = async (data) => {
  return await COMPLAIN_COLLECTION_SHEMA.validateAsync(data, { abortEarly: false });
};
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data);
    const newComplain = {
      ...valiData,
      jobSeekerId: ObjectId.createFromHexString(valiData.jobSeekerId),
      employerId: ObjectId.createFromHexString(valiData.employerId)
    };
    return await GET_DB().collection(COMPLAIN_COLLECTION_NAME).insertOne(newComplain);
  } catch (error) {
    throw new Error(error);
  }
};
const getListComplain = async (reqQuery) => {
  try {
    const limit = parseInt(reqQuery?.limit) || 10;
    const currentPage = parseInt(reqQuery?.page) || 1;
    const skip = (currentPage - 1) * limit;
    const complains = await GET_DB()
      .collection(COMPLAIN_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'employerId',
            foreignField: '_id',
            as: 'employerInfo'
          }
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'jobSeekerId',
            foreignField: '_id',
            as: 'jobSeekerInfo'
          }
        },
        {
          $match: {
            _destroy: false
          }
        },
        {
          $unwind: '$employerInfo'
        },
        {
          $unwind: '$jobSeekerInfo'
        },
        {
          $project: {
            'employerInfo.password': 0,
            'jobSeekerInfo.password': 0
          }
        },
        { $skip: skip },
        { $limit: limit }
      ])
      .toArray();
    const totalComplains = await totalComplain();
    const totalPages = Math.ceil(totalComplains / limit);
    let result = {
      complains: complains
    };
    if (reqQuery.limit) {
      result = {
        totalComplains,
        totalPages: totalPages,
        limit: limit,
        page: currentPage,
        ...result
      };
    }
    return result;
  } catch (error) {
    throw error;
  }
};
const resolve = async (complainId) => {
  try {
    const result = await GET_DB()
      .collection(COMPLAIN_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(complainId.toString())
        },
        {
          $set: {
            isResolved: true
          }
        },
        {
          returnDocument: 'after'
        }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const deleteComplain = async (complainId) => {
  try {
    const result = await GET_DB()
      .collection(COMPLAIN_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(complainId.toString())
        },
        {
          $set: {
            _destroy: true
          }
        },
        {
          returnDocument: 'after'
        }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const complainModel = {
  COMPLAIN_COLLECTION_NAME,
  COMPLAIN_COLLECTION_SHEMA,
  createNew,
  findOneById,
  getListComplain,
  resolve,
  totalComplain,
  deleteComplain
};
