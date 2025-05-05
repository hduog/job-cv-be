import { StatusCodes } from 'http-status-codes';
import { jobService } from '~/services/jobService';

const createNew = async (req, res, next) => {
  try {
    const createdJob = await jobService.createNew(req.body);
    res.status(StatusCodes.CREATED).json(createdJob);
  } catch (error) {
    next(error);
  }
};
const getlistJobs = async (req, res, next) => {
  try {
    const result = await jobService.getlistJobs(req.jwtDecoded, req.query);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getListJobsByUser = async (req, res, next) => {
  try {
    const result = await jobService.getListJobsByUser(req.query);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getListJobsByAdmin = async (req, res, next) => {
  try {
    const result = await jobService.getListJobsByAdmin(req.query);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const changStatus = async (req, res, next) => {
  try {
    const result = await jobService.changStatus(req.params.id, req.query.status);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const deleteJob = async (req, res, next) => {
  try {
    await jobService.deleteJob(req.params.id);
    res.status(StatusCodes.NO_CONTENT).json({
      deleteJob: true
    });
  } catch (error) {
    next(error);
  }
};
const getJobDetails = async (req, res, next) => {
  try {
    const result = await jobService.getJobDetails(req.params.id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getJobDetailsByUser = async (req, res, next) => {
  try {
    const result = await jobService.getJobDetailsByUser(req.params.id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const result = await jobService.update(req.params.id, req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const jobController = {
  createNew,
  getlistJobs,
  getListJobsByUser,
  getListJobsByAdmin,
  changStatus,
  deleteJob,
  getJobDetails,
  getJobDetailsByUser,
  update
};
