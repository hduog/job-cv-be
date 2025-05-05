import { contractModel } from '~/models/contractModel';
import { userModel } from '~/models/userModel';
const getListContract = async (reqQuery) => {
  try {
    const reuslt = await contractModel.getListContract(reqQuery);
    return reuslt;
  } catch (error) {
    throw error;
  }
};
const createNew = async (reqBody) => {
  try {
    const result = await contractModel.createNew(reqBody);
    const getNewContract = await contractModel.findOneById(result.insertedId);
    return getNewContract;
  } catch (error) {
    throw error;
  }
};
const update = async (contractId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    };
    const updatedContract = await contractModel.update(contractId, updateData);
    return updatedContract;
  } catch (error) {
    throw error;
  }
};
const changStatus = async (contractId, stauts) => {
  try {
    const updatedContract = await contractModel.changStatus(contractId, stauts);
    return updatedContract;
  } catch (error) {
    throw error;
  }
};
const deleteContract = async (contractId) => {
  try {
    const updatedContract = await contractModel.deleteContract(contractId);
    return updatedContract;
  } catch (error) {
    throw error;
  }
};
const getContractDetails = async (contractId) => {
  try {
    const contract = await contractModel.findOneById(contractId);
    const userCreate = await userModel.findOneById(contract.creatorId);
    return {
      ...contract,
      creatorInfo: {
        ...userCreate
      }
    };
  } catch (error) {
    throw error;
  }
};
const getDetailsByEmployer = async (idEmployer) => {
  try {
    const result = await contractModel.findContractByEmployer(idEmployer);
    return result;
  } catch (error) {
    throw error;
  }
};
const editContract = async (contractId, reqBody) => {
  try {
    const result = await contractModel.udpate(contractId, reqBody);
    return result;
  } catch (error) {
    throw error;
  }
};
export const contractSercice = {
  getListContract,
  createNew,
  update,
  changStatus,
  deleteContract,
  getContractDetails,
  getDetailsByEmployer,
  editContract
};
