import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { STATUS } from '~/utils/constants';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { userModel } from './userModel';
import { jobModel } from './jobModel';
import { roomChatModel } from './roomChatModel';
const CANDIDATE_COLLECTION_NAME = 'candidates';
const CANDIDATE_COLLECTION_SHEMA = Joi.object({
  jobSeekerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  jobId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  employerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  coverLetter: Joi.string().required().min(100).max(10000),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  status: Joi.string().valid(STATUS.ACCEPT, STATUS.REJECT, STATUS.PENDING).default(STATUS.PENDING),
  cvLink: Joi.string().default(null),
  position: Joi.string().required(),
  _destroy: Joi.boolean().default(false)
});
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CANDIDATE_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const validateBeforeCreate = async (data) => {
  return await CANDIDATE_COLLECTION_SHEMA.validateAsync(data, { abortEarly: false });
};
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data);
    const newCandidate = {
      ...valiData,
      jobSeekerId: ObjectId.createFromHexString(valiData.jobSeekerId),
      jobId: ObjectId.createFromHexString(valiData.jobId),
      employerId: ObjectId.createFromHexString(valiData.employerId)
    };
    return await GET_DB().collection(CANDIDATE_COLLECTION_NAME).insertOne(newCandidate);
  } catch (error) {
    throw new Error(error);
  }
};

const changeStatus = async (contractId, status) => {
  try {
    const result = await GET_DB()
      .collection(CANDIDATE_COLLECTION_NAME)
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
const totalCandidate = async () => {
  try {
    const employer = await GET_DB().collection(CANDIDATE_COLLECTION_NAME).countDocuments({
      _destroy: false
    });

    return employer;
  } catch (error) {
    throw new Error(error);
  }
};
const totalCandidateByEmployer = async (employer) => {
  try {
    const result = await GET_DB()
      .collection(CANDIDATE_COLLECTION_NAME)
      .countDocuments({
        _destroy: false,
        employerId: ObjectId.createFromHexString(employer._id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const getJobsApplied = async (user) => {
  try {
    const candidates = await GET_DB()
      .collection(CANDIDATE_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'employerId',
            foreignField: '_id',
            as: 'creatorInfo'
          }
        },
        {
          $lookup: {
            from: jobModel.JOB_COLLECTION_NAME,
            localField: 'jobId',
            foreignField: '_id',
            as: 'jobInfo'
          }
        },
        {
          $match: {
            _destroy: false,
            jobSeekerId: ObjectId.createFromHexString(user._id.toString())
          }
        },
        {
          $unwind: '$creatorInfo'
        },
        {
          $unwind: '$jobInfo'
        },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            'creatorInfo.password': 0
          }
        },
        { $skip: 0 },
        { $limit: 30 }
      ])
      .toArray();
    return candidates;
  } catch (error) {
    throw new Error(error);
  }
};
const getListCandidatesACCEPT = async (employerId) => {
  try {
    const result = await GET_DB()
      .collection(CANDIDATE_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'jobSeekerId',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $lookup: {
            from: roomChatModel.ROOM_CHAT_COLLECTION_NAME,
            localField: 'jobSeekerId',
            foreignField: 'jobSeekerId',
            as: 'roomChatInfo'
          }
        },

        {
          $unwind: '$userInfo'
        },
        {
          $unwind: {
            path: '$roomChatInfo',
            preserveNullAndEmptyArrays: true
          }
        },

        {
          $project: {
            'userInfo.password': 0
          }
        },
        {
          $match: {
            _destroy: false,
            employerId: ObjectId.createFromHexString(employerId),
            status: 'accept'
          }
        }
      ])
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const candidateModel = {
  CANDIDATE_COLLECTION_NAME,
  CANDIDATE_COLLECTION_SHEMA,
  createNew,
  findOneById,
  totalCandidate,
  totalCandidateByEmployer,
  changeStatus,
  getJobsApplied,
  getListCandidatesACCEPT
};
