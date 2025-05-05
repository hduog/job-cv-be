import { StatusCodes } from 'http-status-codes';
import { candidateSercice } from '~/services/candidateSercice';

const createNew = async (req, res, next) => {
  try {
    const result = await candidateSercice.createNew(req.body, req.jwtDecoded);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getListCandidates = async (req, res, next) => {
  try {
    const result = await candidateSercice.getListCandidates(req.jwtDecoded, req.query);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const deleteCandidate = async (req, res, next) => {
  try {
    const result = await candidateSercice.deleteCandidate(req.params.id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const changeStatus = async (req, res, next) => {
  try {
    const result = await candidateSercice.changeStatus(
      req.params.id,
      req.params.status,
      req.params.email,
      req.jwtDecoded
    );
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getCandidateDetails = async (req, res, next) => {
  try {
    const result = await candidateSercice.getCandidateDetails(req.params.id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getJobsApplied = async (req, res, next) => {
  try {
    const result = await candidateSercice.getJobsApplied(req.jwtDecoded);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const candidateController = {
  createNew,
  getListCandidates,
  deleteCandidate,
  changeStatus,
  getCandidateDetails,
  getJobsApplied
};
