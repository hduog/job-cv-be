import { StatusCodes } from 'http-status-codes';
import { contractModel } from '~/models/contractModel';
import { jobModel } from '~/models/jobModel';
import ApiError from '~/utils/ApiError';
import { ROLE_USER, STATUS } from '~/utils/constants';

const canCreateJob = async (req, res, next) => {
  try {
    const contract = await contractModel.findContractByEmployer(req.jwtDecoded._id);
    if (!contract) {
      next(new ApiError(StatusCodes.NOT_FOUND, 'Hợp đồng công việc chưa tạo !'));
      return;
    }
    if (contract?.status !== STATUS.ACTIVE) {
      next(new ApiError(StatusCodes.FORBIDDEN, 'Hợp đồng chưa được phê duyệt !'));
      return;
    }
    next();
  } catch (error) {
    next(new Error(error));
  }
};
const canDeleteGetDetailJob = async (req, res, next) => {
  const { role, _id } = req.jwtDecoded;
  const { id } = req.params;
  if (role === ROLE_USER.ADMIN) {
    return next();
  }
  const jobDetail = await jobModel.findOneById(id);
  if (jobDetail.creatorId.toString() === _id) {
    return next();
  }
  next(new ApiError(StatusCodes.FORBIDDEN, 'UNAUTHORIZED !'));
};

export const jobMiddleware = {
  canCreateJob,
  canDeleteGetDetailJob
};
