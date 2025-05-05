import { StatusCodes } from 'http-status-codes';
import { interviewService } from '~/services/interviewService';
const createNew = async (req, res, next) => {
  try {
    const createdUser = await interviewService.createNew(req.body);
    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    next(error);
  }
};
const getListCandidates = async (req, res, next) => {
  try {
    const createdUser = await interviewService.getListCandidates(req.jwtDecoded.employerId);
    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    next(error);
  }
};
const createRoomChat = async (req, res, next) => {
  try {
    const createdUser = await interviewService.createRoomChat(req.jwtDecoded._id, req.body);
    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    next(error);
  }
};
const createSchedual = async (req, res, next) => {
  try {
    const createdUser = await interviewService.createSchedual(req.body);
    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    next(error);
  }
};
const getListSchedual = async (req, res, next) => {
  try {
    const result = await interviewService.getListSchedual(req.jwtDecoded._id);
    res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};
export const interviewerController = {
  createNew,
  getListCandidates,
  createRoomChat,
  createSchedual,
  getListSchedual
};
