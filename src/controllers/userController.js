import { StatusCodes } from 'http-status-codes';
import ms from 'ms';
import { userService } from '~/services/userService';
const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body);
    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const updated = await userService.update(req.params.id, req.body, req.jwtDecoded);
    if (req.jwtDecoded._id === req.params.id) {
      res.cookie('accessToken', updated.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('14 days')
      });
      res.cookie('refreshToken', updated.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('14 days')
      });
    }
    res.status(StatusCodes.CREATED).json(updated);
  } catch (error) {
    next(error);
  }
};
const getListUser = async (req, res, next) => {
  try {
    const result = await userService.getListUser(req.query);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(StatusCodes.NO_CONTENT).json({
      deleted: true
    });
  } catch (error) {
    next(error);
  }
};
const statistic = async (req, res, next) => {
  try {
    const result = await userService.statistic();
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getListEmployer = async (req, res, next) => {
  try {
    const result = await userService.getListEmployer(req.query);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getDetailUser = async (req, res, next) => {
  try {
    const result = await userService.getDetailUser(req.params.id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const statisticByEmployer = async (req, res, next) => {
  try {
    const result = await userService.statisticByEmployer(req.jwtDecoded, req.query);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getListCandidate = async (req, res, next) => {
  try {
    const result = await userService.getListCandidate(req.jwtDecoded, req.query);
    return result;
  } catch (error) {
    next(error);
  }
};
export const userController = {
  createNew,
  update,
  getListUser,
  deleteUser,
  statistic,
  getListEmployer,
  getDetailUser,
  statisticByEmployer,
  getListCandidate
};
