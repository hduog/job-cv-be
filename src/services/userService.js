import { StatusCodes } from 'http-status-codes';
import { candidateModel } from '~/models/candidateModel';
import { complainModel } from '~/models/complainModel';
import { jobModel } from '~/models/jobModel';
import { userModel } from '~/models/userModel';
import ApiError from '~/utils/ApiError';
import bcryptjs from 'bcryptjs';
import { ROLE_USER } from '~/utils/constants';
import { interviewerModel } from '~/models/interviewerModel';
import { JwtProvider } from '~/providers/JwtProvider';
import { env } from '~/config/environment';
import { pickUser } from '~/utils/formatter';

const createNew = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exist');
    }
    const nameFromEmail = reqBody.email.split('@')[0];
    const newUser = {
      ...reqBody,
      username: nameFromEmail,
      password: bcryptjs.hashSync(reqBody.password, 8)
    };
    const createdUser = await userModel.createNew(newUser);
    const getNewUser = await userModel.findOneById(createdUser.insertedId);
    return getNewUser;
  } catch (error) {
    throw error;
  }
};
const update = async (idUser, reqBody, user) => {
  try {
    reqBody.username = reqBody.email.split('@')[0];
    const updated = await userModel.update(idUser, reqBody);
    let userInfo = {
      _id: updated._id,
      email: updated.email,
      role: updated.role
    };
    if (user._id === idUser) {
      const accessToken = await JwtProvider.generateToken(
        userInfo,
        env.ACCESS_TOKEN_SECRET_SIGNATURE,
        env.ACCESS_TOKEN_LIFE
      );
      const refreshToken = await JwtProvider.generateToken(
        userInfo,
        env.REFRESH_TOKEN_SECRET_SIGNATURE,
        env.REFRESH_TOKEN_LIFE
      );
      return {
        ...pickUser(updated),
        accessToken,
        refreshToken
      };
    }
    return updated;
  } catch (error) {
    throw error;
  }
};
const getListUser = async (reqQuery) => {
  try {
    const updated = await userModel.getListUser(reqQuery);
    return updated;
  } catch (error) {
    throw error;
  }
};
const deleteUser = async (idUser) => {
  try {
    const updated = await userModel.deleteUser(idUser);
    return updated;
  } catch (error) {
    throw error;
  }
};
const statistic = async () => {
  try {
    const users = await userModel.totalUser();
    const jobs = await jobModel.totalJob();
    const candidates = await candidateModel.totalCandidate();
    const complains = await complainModel.totalComplain();
    return {
      users,
      jobs,
      candidates,
      complains
    };
  } catch (error) {
    throw error;
  }
};
const getListEmployer = async (reqQuery) => {
  try {
    const result = await userModel.getListEmployer(reqQuery);
    return result;
  } catch (error) {
    throw error;
  }
};
const getDetailUser = async (id) => {
  try {
    const user = await userModel.findOneById(id);
    let result = {
      ...user
    };
    if (user.role === ROLE_USER.INTERVIEER) {
      const employer = await userModel.findOneById(user.employerId);
      result = {
        ...result,
        companyName: employer.companyName
      };
    }
    return result;
  } catch (error) {
    throw error;
  }
};
const statisticByEmployer = async (employer, reqQuery) => {
  try {
    const totalCandidate = await candidateModel.totalCandidateByEmployer(employer);
    const totalJob = await jobModel.totalJobByEmployer(employer);
    const totalJobAccept = await jobModel.totalJobByEmployer(employer, reqQuery);
    const totalInterview = await interviewerModel.totalInterview(employer);
    return {
      totalCandidate,
      totalJob,
      totalJobAccept,
      totalInterview
    };
  } catch (error) {
    throw error;
  }
};
export const userService = {
  createNew,
  update,
  getListUser,
  deleteUser,
  statistic,
  getListEmployer,
  getDetailUser,
  statisticByEmployer
};
