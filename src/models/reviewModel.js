import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { userModel } from './userModel';

const REVIEW_COLLECTION_NAME = 'reviews';
const REVIEW_COLLECTION_SHEMA = Joi.object({
  creatorId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  jobSeekerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  content: Joi.string(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
});
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(REVIEW_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const validateBeforeCreate = async (data) => {
  return await REVIEW_COLLECTION_SHEMA.validateAsync(data, { abortEarly: false });
};
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data);
    const newJob = {
      ...valiData,
      creatorId: ObjectId.createFromHexString(valiData.creatorId),
      jobSeekerId: ObjectId.createFromHexString(valiData.jobSeekerId)
    };
    return await GET_DB().collection(REVIEW_COLLECTION_NAME).insertOne(newJob);
  } catch (error) {
    throw new Error(error);
  }
};
const getListReviews = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(REVIEW_COLLECTION_NAME)
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
const getReviewDetails = async (reviewId) => {
  try {
    const result = await GET_DB()
      .collection(REVIEW_COLLECTION_NAME)
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
        { $match: { _id: ObjectId.createFromHexString(reviewId), _destroy: false } }
      ])
      .toArray();
    return result[0];
  } catch (error) {
    throw new Error(error);
  }
};
export const reviewModel = {
  REVIEW_COLLECTION_NAME,
  REVIEW_COLLECTION_SHEMA,
  createNew,
  findOneById,
  getListReviews,
  getReviewDetails
};
