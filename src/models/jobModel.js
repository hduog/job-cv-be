import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { JOB_LOCATION, STATUS } from '~/utils/constants';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { userModel } from './userModel';
import { contractModel } from './contractModel';

const JOB_COLLECTION_NAME = 'jobs';
const JOB_COLLECTION_SCHEMA = Joi.object({
  creatorId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  position: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().required().min(3),
  benefit: Joi.string().required().min(3),
  requirements: Joi.array().required(),
  salary: Joi.number().required().min(200),
  status: Joi.string().valid(STATUS.ACCEPT, STATUS.PENDING, STATUS.REJECT).default(STATUS.PENDING),
  applicationDeadline: Joi.date().greater('now'),
  jobLocation: Joi.string()
    .required()
    .valid(...JOB_LOCATION)
    .min(3)
    .max(50)
    .trim()
    .strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
});
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(JOB_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const totalJob = async () => {
  try {
    return await GET_DB().collection(JOB_COLLECTION_NAME).countDocuments({
      _destroy: false
    });
  } catch (error) {
    throw new Error(error);
  }
};
const validateBeforeCreate = async (data) => {
  return await JOB_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data);
    const newJob = {
      ...valiData,
      creatorId: ObjectId.createFromHexString(valiData.creatorId)
    };
    return await GET_DB().collection(JOB_COLLECTION_NAME).insertOne(newJob);
  } catch (error) {
    throw new Error(error);
  }
};
const getlistJobs = async (user, reqQuery) => {
  try {
    const limit = parseInt(reqQuery?.limit) || 10;
    const skip = (parseInt(reqQuery?.page) - 1) * limit || 0;
    let jobs = null;
    jobs = await GET_DB()
      .collection(JOB_COLLECTION_NAME)
      .aggregate([
        { $match: { creatorId: ObjectId.createFromHexString(user._id), _destroy: false } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ])
      .toArray();
    let result = {
      jobs: jobs
    };

    if (reqQuery.limit) {
      const totalJobs = await totalJob();
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
    throw new Error(error);
  }
};

const getListJobsByUser = async (reqQuery) => {
  try {
    const find = {
      _destroy: false,
      status: STATUS.ACCEPT
    };
    if (reqQuery.skills) {
      find.requirements = { $all: reqQuery.skills.split(',') };
    }
    if (reqQuery.salary) {
      find.salary = parseInt(reqQuery.salary);
    }
    if (reqQuery.workLocation) {
      find.jobLocation = reqQuery.workLocation;
    }
    const pipeline = [{ $match: { status: STATUS.ACTIVE } }, { $group: { _id: '$creatorId' } }];

    const creatorIdsCursor = await GET_DB()
      .collection(contractModel.CONTRACT_COLLECTION_NAME)
      .aggregate(pipeline)
      .toArray();
    const creatorIds = creatorIdsCursor.map((item) => item._id);
    find.creatorId = { $in: creatorIds };
    const limit = parseInt(reqQuery?.limit) || 3;
    const skip = (parseInt(reqQuery?.page) - 1) * limit || 0;
    const listJobs = await GET_DB()
      .collection(JOB_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'creatorId',
            foreignField: '_id',
            as: 'employerInfo'
          }
        },
        {
          $unwind: '$employerInfo'
        },
        {
          $project: {
            'employerInfo.password': 0
          }
        },
        { $match: find },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ])
      .toArray();
    let result = {
      jobs: listJobs
    };
    if (reqQuery.limit) {
      const totalJobs = await totalJob();

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
    throw new Error(error);
  }
};
const getListJobsByAdmin = async (reqQuery) => {
  try {
    const limit = parseInt(reqQuery?.limit) || 10;
    const skip = (parseInt(reqQuery?.page) - 1) * limit || 0;
    let jobs = await GET_DB()
      .collection(JOB_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'creatorId',
            foreignField: '_id',
            as: 'employerInfo'
          }
        },
        {
          $unwind: '$employerInfo'
        },
        {
          $project: {
            'employerInfo.password': 0
          }
        },
        { $match: { _destroy: false } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ])
      .toArray();
    let result = {
      jobs: jobs
    };

    if (reqQuery.limit) {
      const totalJobs = await totalJob();
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
    throw new Error(error);
  }
};
const changStatus = async (jobId, status) => {
  try {
    const result = await GET_DB()
      .collection(JOB_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(jobId.toString())
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
const deleteJob = async (jobId) => {
  try {
    const result = await GET_DB()
      .collection(JOB_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(jobId.toString())
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
const totalJobByEmployer = async (employer, reqQuery) => {
  try {
    const find = {
      _destroy: false,
      creatorId: ObjectId.createFromHexString(employer._id.toString())
    };
    if (reqQuery?.statusJob) {
      find.status = reqQuery.statusJob;
    }
    const result = await GET_DB().collection(JOB_COLLECTION_NAME).countDocuments(find);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const getJobDetailsByUser = async (jobId) => {
  try {
    let jobs = await GET_DB()
      .collection(JOB_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'creatorId',
            foreignField: '_id',
            as: 'employerInfo'
          }
        },
        {
          $lookup: {
            from: contractModel.CONTRACT_COLLECTION_NAME, // Ghép với collection contract
            localField: 'creatorId',
            foreignField: 'creatorId',
            as: 'contract'
          }
        },
        {
          $unwind: '$employerInfo'
        },
        {
          $unwind: '$contract'
        },
        {
          $project: {
            'employerInfo.password': 0
          }
        },
        {
          $match: {
            _destroy: false,
            _id: ObjectId.createFromHexString(jobId),
            status: STATUS.ACCEPT,
            'contract.status': STATUS.ACTIVE
          }
        }
      ])
      .toArray();
    return jobs[0];
  } catch (error) {
    throw new Error(error);
  }
};
const update = async (jobId, dataUpdate) => {
  try {
    const result = await GET_DB()
      .collection(JOB_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(jobId.toString())
        },
        {
          $set: {
            ...dataUpdate,
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
export const jobModel = {
  JOB_COLLECTION_NAME,
  JOB_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getlistJobs,
  getListJobsByUser,
  getListJobsByAdmin,
  changStatus,
  totalJob,
  deleteJob,
  totalJobByEmployer,
  getJobDetailsByUser,
  update
};
