import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const INTERVIEW_COLLECTION_NAME = 'jobs';
const INTERVIEW_COLLECTION_SCHEMA = Joi.object({
  creatorId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  employerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  jobSeekerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  schedule: Joi.date().required().greater('now'),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
});
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(INTERVIEW_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const validateBeforeCreate = async (data) => {
  return await INTERVIEW_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data);
    const newInterview = {
      ...valiData,
      creatorId: ObjectId.createFromHexString(valiData.creatorId)
    };
    return await GET_DB().collection(INTERVIEW_COLLECTION_NAME).insertOne(newInterview);
  } catch (error) {
    throw new Error(error);
  }
};
const totalInterview = async (employer) => {
  try {
    const result = await GET_DB()
      .collection(INTERVIEW_COLLECTION_NAME)
      .countDocuments({
        _destroy: false,
        employerId: ObjectId.createFromHexString(employer._id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const interviewerModel = {
  findOneById,
  createNew,
  totalInterview
};
