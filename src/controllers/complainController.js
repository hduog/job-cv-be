import { StatusCodes } from 'http-status-codes';
import { complainSercice } from '~/services/complainSercice';
const getListComplain = async (req, res, next) => {
  try {
    const result = await complainSercice.getListComplain(req.query);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const createNew = async (req, res, next) => {
  try {
    const result = await complainSercice.createNew(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const resolve = async (req, res, next) => {
  try {
    const complainId = req.params.id;
    const result = await complainSercice.resolve(complainId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getDetailsComplain = async (req, res, next) => {
  try {
    const complainId = req.params.id;
    const result = await complainSercice.getDetailsComplain(complainId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const deleteComplain = async (req, res, next) => {
  try {
    const complainId = req.params.id;
    const result = await complainSercice.deleteComplain(complainId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const complainController = {
  getListComplain,
  createNew,
  resolve,
  getDetailsComplain,
  deleteComplain
};
