import { StatusCodes } from 'http-status-codes';
import { JwtProvider } from '~/providers/JwtProvider';
import { env } from '~/config/environment';
import ApiError from '~/utils/ApiError';
import { ROLE_USER } from '~/utils/constants';
import { userModel } from '~/models/userModel';
const isAuthorized = async (req, res, next) => {
  const clientAccessToken = req.cookies?.accessToken;
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized: {token not found}'));
    return;
  }
  try {
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    );
    const isUserExist = await userModel.findOneByEmail(accessTokenDecoded.email);
    if (!isUserExist) {
      next(new ApiError(StatusCodes.UNAUTHORIZED, 'Account was inactive !'));
      return;
    }
    req['jwtDecoded'] = accessTokenDecoded;
    next();
  } catch (error) {
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token !'));
      return;
    }
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized !'));
  }
};
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.jwtDecoded.role)) {
      next(new ApiError(StatusCodes.FORBIDDEN, 'Unauthorized !'));
      return;
    }
    next();
  };
};
const canEditUser = (req, res, next) => {
  const { role, _id } = req.jwtDecoded;
  const { id } = req.params;

  if (role === ROLE_USER.ADMIN) {
    return next();
  }
  if (_id.toString() === id.toString()) {
    return next();
  }
  next(new ApiError(StatusCodes.FORBIDDEN, 'Unauthorized !'));
};
export const authMiddleware = {
  isAuthorized,
  authorize,
  canEditUser
};
