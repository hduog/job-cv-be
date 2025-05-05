import { StatusCodes } from 'http-status-codes';
import { reviewSercice } from '~/services/reviewSercice';
const createNew = async (req, res, next) => {
  try {
    const result = await reviewSercice.createNew(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getListReviews = async (req, res, next) => {
  try {
    const result = await reviewSercice.getListReviews(req.jwtDecoded._id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getReviewDetails = async (req, res, next) => {
  try {
    const result = await reviewSercice.getReviewDetails(req.params.id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const reviewController = {
  createNew,
  getListReviews,
  getReviewDetails
};
