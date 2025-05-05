import { StatusCodes } from 'http-status-codes';
import { userModel } from '~/models/userModel';
import ApiError from '~/utils/ApiError';
import bcryptjs from 'bcryptjs';
import { pickUser } from '~/utils/formatter';
import { env } from '~/config/environment';
import { JwtProvider } from '~/providers/JwtProvider';
import { ROLE_USER } from '~/utils/constants';

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
    const craetedUser = await userModel.createNew(newUser);
    const getNewUser = await userModel.findOneById(craetedUser.insertedId);

    return pickUser(getNewUser);
  } catch (error) {
    throw error;
  }
};
const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found');
    }

    let userInfo = {
      _id: existUser._id,
      email: existUser.email,
      role: existUser.role
    };
    if (existUser.role === ROLE_USER.EMPLOYER) {
      userInfo.companyName = existUser.companyName;
    }
    if (existUser.role === ROLE_USER.INTERVIEER) {
      userInfo.employerId = existUser.employerId.toString();
    }
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

    return { accessToken, refreshToken, ...pickUser(existUser) };
  } catch (error) {
    throw error;
  }
};
const refreshToken = async (clietRefreshToken) => {
  try {
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clietRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    );
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email,
      role: refreshTokenDecoded.role
    };
    if (refreshTokenDecoded?.companyName) {
      userInfo.companyName = refreshTokenDecoded.companyName;
    }
    if (refreshTokenDecoded?.employerId) {
      userInfo.employerId = refreshTokenDecoded.employerId;
    }
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    );
    return { accessToken };
  } catch (error) {
    throw error;
  }
};

export const authService = {
  createNew,
  login,
  refreshToken
};
