/* eslint-disable indent */
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { ROLE_USER, STATUS } from '~/utils/constants';
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE
} from '~/utils/validators';

const USER_COLLECTION_NAME = 'users';
const shemaValidation = {
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),
  username: Joi.string().required(),
  role: Joi.string()
    .valid(ROLE_USER.EMPLOYER, ROLE_USER.INTERVIEER, ROLE_USER.JOB_SEEKER)
    .required(),
  companyName: Joi.string().trim().strict().when('role', {
    is: ROLE_USER.EMPLOYER,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  employerId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).when('role', {
    is: ROLE_USER.INTERVIEER,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  expensive: Joi.when('role', {
    is: ROLE_USER.JOB_SEEKER,
    then: Joi.number().required(),
    otherwise: Joi.forbidden()
  }),
  desiredSalary: Joi.when('role', {
    is: ROLE_USER.JOB_SEEKER,
    then: Joi.number().required(),
    otherwise: Joi.forbidden()
  }),
  skills: Joi.when('role', {
    is: ROLE_USER.JOB_SEEKER,
    then: Joi.array().items(Joi.string().valid()).min(1).required(),
    otherwise: Joi.forbidden()
  }),
  education: Joi.when('role', {
    is: ROLE_USER.JOB_SEEKER,
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  status: Joi.string().valid(STATUS.ACTIVE, STATUS.INACTIVE).default(STATUS.ACTIVE),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
};
let USER_COLLECTION_SCHEMA = Joi.object(shemaValidation);

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne(
        {
          _id: ObjectId.createFromHexString(id.toString())
        },
        { projection: { password: 0 } }
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const totalUser = async () => {
  try {
    const totalUsers = await GET_DB().collection(USER_COLLECTION_NAME).countDocuments({
      _destroy: false
    });
    return totalUsers;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneByEmail = async (email) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      //  _id: new ObjectId(id),
      email: email,
      _destroy: false,
      status: STATUS.ACTIVE
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data);
    return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(valiData);
  } catch (error) {
    throw new Error(error);
  }
};
const deleteUser = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(userId.toString())
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
const update = async (userId, dataUpdate) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(userId.toString())
        },
        {
          $set: dataUpdate
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

const getListUser = async (reqQuery) => {
  try {
    const limit = parseInt(reqQuery?.limit) || 10;
    const currentPage = parseInt(reqQuery?.page) || 1;
    const skip = (currentPage - 1) * limit;
    const users = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find({
        _destroy: false
      })
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    const totalUsers = await totalUser();
    const totalPages = Math.ceil(totalUsers / limit);
    let result = {
      users: users
    };
    if (reqQuery.limit) {
      const totalJobs = await totalUser();
      result = {
        totalJobs,
        totalPages: totalPages,
        limit: limit,
        page: currentPage,
        ...result
      };
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const getListEmployer = async (reqQuery) => {
  try {
    const limit = parseInt(reqQuery?.limit) || 10;
    const currentPage = parseInt(reqQuery?.page) || 1;
    const skip = (currentPage - 1) * limit;
    let employer = null;
    if (reqQuery?.limit) {
      employer = await GET_DB()
        .collection(USER_COLLECTION_NAME)
        .find({
          _destroy: false,
          role: ROLE_USER.EMPLOYER
        })
        .project({ password: 0 })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
    } else {
      employer = await GET_DB()
        .collection(USER_COLLECTION_NAME)
        .find({
          _destroy: false,
          role: ROLE_USER.EMPLOYER
        })
        .toArray();
    }
    const totalUsers = await totalUser();
    const totalPages = Math.ceil(totalUsers / limit);
    let result = {
      employer: employer
    };
    if (reqQuery.limit) {
      result = {
        totalUsers,
        totalPages: totalPages,
        limit: limit,
        page: currentPage,
        ...result
      };
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findOneByEmail,
  update,
  deleteUser,
  getListUser,
  totalUser,
  getListEmployer
};
