import { candidateModel } from '~/models/candidateModel';
import { roomChatModel } from '~/models/roomChatModel';
import { schedualModel } from '~/models/schedualModel';
const getListCandidates = async (employerId) => {
  try {
    const createdJob = await candidateModel.getListCandidatesACCEPT(employerId);
    return createdJob;
  } catch (error) {
    throw error;
  }
};
const createRoomChat = async (userId, reqBody) => {
  try {
    const createdJob = await roomChatModel.createNew(userId, reqBody);
    return createdJob;
  } catch (error) {
    throw error;
  }
};
const createSchedual = async (reqBody) => {
  try {
    const createdJob = await schedualModel.createNew(reqBody);
    return createdJob;
  } catch (error) {
    throw error;
  }
};
const getListSchedual = async (userId) => {
  try {
    const createdJob = await schedualModel.getListSchedual(userId);
    return createdJob;
  } catch (error) {
    throw error;
  }
};
export const interviewService = {
  getListCandidates,
  createRoomChat,
  createSchedual,
  getListSchedual
};
