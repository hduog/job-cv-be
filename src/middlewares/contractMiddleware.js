import { StatusCodes } from 'http-status-codes';
import { contractModel } from '~/models/contractModel';
import ApiError from '~/utils/ApiError';
import { ROLE_USER } from '~/utils/constants';

const canDeleteContract = async (req, res, next) => {
  try {
    const { role, _id } = req.jwtDecoded;
    const { id } = req.params;
    if (role === ROLE_USER.ADMIN) {
      return next();
    }
    const contract = await contractModel.findOneById(id);
    if (contract.creatorId === _id) {
      return next();
    }
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED !'));
  } catch (error) {
    next(new Error(error));
  }
};
export const contractMiddleware = {
  canDeleteContract
};
