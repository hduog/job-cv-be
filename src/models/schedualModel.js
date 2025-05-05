import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { userModel } from './userModel';

const SCHEDUAL_COLLECTION_NAME = 'scheduals';
const SCHEDUAL_COLLECTION_SHEMA = Joi.object({
  creatorId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  jobSeekerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  schedual: Joi.date().greater('now'),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
});
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(SCHEDUAL_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const validateBeforeCreate = async (data) => {
  return await SCHEDUAL_COLLECTION_SHEMA.validateAsync(data, { abortEarly: false });
};
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data);
    const newJob = {
      ...valiData,
      creatorId: ObjectId.createFromHexString(valiData.creatorId),
      jobSeekerId: ObjectId.createFromHexString(valiData.jobSeekerId)
    };
    return await GET_DB().collection(SCHEDUAL_COLLECTION_NAME).insertOne(newJob);
  } catch (error) {
    throw new Error(error);
  }
};
const getListSchedual = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(SCHEDUAL_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'jobSeekerId',
            foreignField: '_id',
            as: 'jobSeekerInfo'
          }
        },
        {
          $unwind: '$jobSeekerInfo'
        },
        {
          $project: {
            'jobSeekerInfo.password': 0
          }
        },
        { $match: { creatorId: ObjectId.createFromHexString(userId), _destroy: false } },
        { $sort: { createdAt: -1 } }
      ])
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const schedualModel = {
  SCHEDUAL_COLLECTION_NAME,
  SCHEDUAL_COLLECTION_SHEMA,
  createNew,
  findOneById,
  getListSchedual
};
