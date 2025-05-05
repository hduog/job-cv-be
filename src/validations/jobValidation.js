import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import ApiError from '~/utils/ApiError';
import { JOB_LOCATION } from '~/utils/constants';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    creatorId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    position: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3),
    benefit: Joi.string().required().min(3),
    requirements: Joi.array().required(),
    salary: Joi.number().required().min(200),
    applicationDeadline: Joi.date().greater('now'),
    jobLocation: Joi.string()
      .required()
      .valid(...JOB_LOCATION)
      .min(3)
      .max(50)
      .trim()
      .strict()
  });

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
    });
    next();
  } catch (error) {
    const errorMessage = new Error(error).message;
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
    next(customError);
  }
};
export const jobValidation = {
  createNew
};
