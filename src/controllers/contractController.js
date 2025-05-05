import { StatusCodes } from 'http-status-codes';
import { contractSercice } from '~/services/contractSercice';
const getListContract = async (req, res, next) => {
  try {
    const result = await contractSercice.getListContract(req.query);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const createNew = async (req, res, next) => {
  try {
    const result = await contractSercice.createNew(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const contractId = req.params.id;
    const updatedColumn = await contractSercice.update(contractId, req.body);
    res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).json(updatedColumn);
  } catch (error) {
    next(error);
  }
};
const changStatus = async (req, res, next) => {
  try {
    const contractId = req.params.id;
    const updatedColumn = await contractSercice.changStatus(contractId, req.query.status);
    res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).json(updatedColumn);
  } catch (error) {
    next(error);
  }
};
const deleteContract = async (req, res, next) => {
  try {
    const contractId = req.params.id;
    await contractSercice.deleteContract(contractId);
    res.status(StatusCodes.NO_CONTENT).json({
      deleteContract: true
    });
  } catch (error) {
    next(error);
  }
};
const getContractDetails = async (req, res, next) => {
  try {
    const contractId = req.params.id;
    const result = await contractSercice.getContractDetails(contractId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getDetailsByEmployer = async (req, res, next) => {
  try {
    const result = await contractSercice.getDetailsByEmployer(req.jwtDecoded._id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const editContract = async (req, res, next) => {
  try {
    const result = await contractSercice.editContract(req.params.id, req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const contractController = {
  getListContract,
  createNew,
  update,
  changStatus,
  deleteContract,
  getContractDetails,
  getDetailsByEmployer,
  editContract
};
