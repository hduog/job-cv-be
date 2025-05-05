import { reviewModel } from '~/models/reviewModel';

const createNew = async (reqBody) => {
  try {
    const reuslt = await reviewModel.createNew(reqBody);
    return reuslt;
  } catch (error) {
    throw error;
  }
};
const getListReviews = async (user) => {
  try {
    const reuslt = await reviewModel.getListReviews(user);
    return reuslt;
  } catch (error) {
    throw error;
  }
};
const getReviewDetails = async (reviewId) => {
  try {
    const reuslt = await reviewModel.getReviewDetails(reviewId);
    return reuslt;
  } catch (error) {
    throw error;
  }
};
export const reviewSercice = {
  createNew,
  getListReviews,
  getReviewDetails
};
