import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { STATUS } from '~/utils/constants';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { userModel } from './userModel';
const CONTRACT_COLLECTION_NAME = 'contracts';
const CONTRACT_COLLECTION_SHEMA = Joi.object({
  creatorId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  description: Joi.string().required().min(100).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  status: Joi.string().valid(STATUS.ACTIVE, STATUS.REJECT, STATUS.PENDING).default(STATUS.PENDING),
  _destroy: Joi.boolean().default(false)
});
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CONTRACT_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneByIdEmployer = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CONTRACT_COLLECTION_NAME)
      .findOne({
        creatorId: ObjectId.createFromHexString(id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const totalContract = async () => {
  try {
    return await GET_DB().collection(CONTRACT_COLLECTION_NAME).countDocuments({
      _destroy: false
    });
  } catch (error) {
    throw new Error(error);
  }
};
const validateBeforeCreate = async (data) => {
  return await CONTRACT_COLLECTION_SHEMA.validateAsync(data, { abortEarly: false });
};
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data);
    const newContract = {
      ...valiData,
      creatorId: ObjectId.createFromHexString(valiData.creatorId)
    };
    return await GET_DB().collection(CONTRACT_COLLECTION_NAME).insertOne(newContract);
  } catch (error) {
    throw new Error(error);
  }
};
const getListContract = async (reqQuery) => {
  try {
    const limit = parseInt(reqQuery?.limit) || 10;
    const skip = (parseInt(reqQuery?.page) - 1) * limit || 0;
    const contracts = await GET_DB()
      .collection(CONTRACT_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'creatorId',
            foreignField: '_id',
            as: 'creatorInfo'
          }
        },
        {
          $match: { _destroy: false }
        },
        {
          $unwind: '$creatorInfo' // Giải nén mảng để lấy object user thay vì mảng
        },
        {
          $project: {
            'creatorInfo.password': 0
          }
        },
        { $skip: skip },
        { $sort: { createdAt: -1 } },
        { $limit: limit }
      ])
      .toArray();
    let result = {
      contracts: contracts
    };
    if (reqQuery.limit) {
      const totalJobs = await totalContract();
      result = {
        totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
        limit: limit,
        page: reqQuery.page || 1,
        ...result
      };
    }
    return result;
  } catch (error) {
    throw error;
  }
};

const udpate = async (contractId, updateData) => {
  try {
    const result = await GET_DB()
      .collection(CONTRACT_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(contractId.toString())
        },
        {
          $set: {
            ...updateData,
            status: STATUS.PENDING
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
const changStatus = async (contractId, status) => {
  try {
    const result = await GET_DB()
      .collection(CONTRACT_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(contractId.toString())
        },
        {
          $set: {
            status: status
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
const findContractByEmployer = async (employerId) => {
  try {
    const result = GET_DB()
      .collection(CONTRACT_COLLECTION_NAME)
      .findOne({
        creatorId: ObjectId.createFromHexString(employerId.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const deleteContract = async (contractId) => {
  try {
    const result = await GET_DB()
      .collection(CONTRACT_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(contractId.toString())
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
export const contractModel = {
  CONTRACT_COLLECTION_NAME,
  CONTRACT_COLLECTION_SHEMA,
  createNew,
  findOneById,
  findOneByIdEmployer,
  getListContract,
  udpate,
  changStatus,
  findContractByEmployer,
  totalContract,
  deleteContract
};
