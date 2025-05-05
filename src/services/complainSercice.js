import { complainModel } from '~/models/complainModel';
import { userModel } from '~/models/userModel';
const getListComplain = async (reqQuery) => {
  try {
    const reuslt = await complainModel.getListComplain(reqQuery);
    return reuslt;
  } catch (error) {
    throw error;
  }
};
const createNew = async (reqBody) => {
  try {
    const result = await complainModel.createNew(reqBody);
    const getNewComplain = await complainModel.findOneById(result.insertedId);
    return getNewComplain;
  } catch (error) {
    throw error;
  }
};
const resolve = async (complainId) => {
  try {
    const reuslt = await complainModel.resolve(complainId);
    return reuslt;
  } catch (error) {
    throw error;
  }
};
const getDetailsComplain = async (complainId) => {
  try {
    const complain = await complainModel.findOneById(complainId);
    const jobSeekerInfo = await userModel.findOneById(complain.jobSeekerId);
    const employerInfo = await userModel.findOneById(complain.employerId);

    return {
      ...complain,
      jobSeekerInfo: {
        ...jobSeekerInfo
      },
      employerInfo: {
        ...employerInfo
      }
    };
  } catch (error) {
    throw error;
  }
};
const deleteComplain = async (complainId) => {
  try {
    const reuslt = await complainModel.deleteComplain(complainId);
    return reuslt;
  } catch (error) {
    throw error;
  }
};
export const complainSercice = {
  getListComplain,
  createNew,
  resolve,
  getDetailsComplain,
  deleteComplain
};
