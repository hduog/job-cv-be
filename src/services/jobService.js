import { jobModel } from '~/models/jobModel';
const createNew = async (reqBody) => {
  try {
    const createdJob = await jobModel.createNew(reqBody);
    const getNewJob = await jobModel.findOneById(createdJob.insertedId);
    return getNewJob;
  } catch (error) {
    throw error;
  }
};
const getlistJobs = async (user, reqQuey) => {
  try {
    const result = await jobModel.getlistJobs(user, reqQuey);
    return result;
  } catch (error) {
    throw error;
  }
};
const getListJobsByUser = async (reqQuery) => {
  try {
    const result = await jobModel.getListJobsByUser(reqQuery);
    return result;
  } catch (error) {
    throw error;
  }
};
const getListJobsByAdmin = async (reqQuery) => {
  try {
    const result = await jobModel.getListJobsByAdmin(reqQuery);
    return result;
  } catch (error) {
    throw error;
  }
};
const changStatus = async (jobId, status) => {
  try {
    const result = await jobModel.changStatus(jobId, status);
    return result;
  } catch (error) {
    throw error;
  }
};
const deleteJob = async (jobId) => {
  try {
    const result = await jobModel.deleteJob(jobId);
    return result;
  } catch (error) {
    throw error;
  }
};
const getJobDetails = async (jobId) => {
  try {
    const result = await jobModel.findOneById(jobId);
    return result;
  } catch (error) {
    throw error;
  }
};
const getJobDetailsByUser = async (jobId) => {
  try {
    const result = await jobModel.getJobDetailsByUser(jobId);
    return result;
  } catch (error) {
    throw error;
  }
};
const update = async (jobId, reqBody) => {
  try {
    const result = await jobModel.update(jobId, reqBody);
    return result;
  } catch (error) {
    throw error;
  }
};
export const jobService = {
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
