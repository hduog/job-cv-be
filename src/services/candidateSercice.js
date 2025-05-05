import { candidateES } from '~/elasticsearch/candidateES';
import { candidateModel } from '~/models/candidateModel';
import { BrevoProvider } from '~/providers/brevoProvider';
import { STATUS } from '~/utils/constants';
const createNew = async (reqBody, user) => {
  try {
    const result = await candidateModel.createNew(reqBody);
    await candidateES.createNew(result.insertedId, reqBody, user);
    return await candidateES.createNew(result.insertedId, reqBody, user);
  } catch (error) {
    throw error;
  }
};

const getListCandidates = async (user, reqQuery) => {
  try {
    const result = await candidateES.getListCandidates(user, reqQuery);
    return result.map((hit) => ({
      id: hit._id,
      ...hit._source
    }));
  } catch (error) {
    throw error;
  }
};
const deleteCandidate = async (idCandidate) => {
  try {
    const result = await candidateES.deleteCandidate(idCandidate);
    return result;
  } catch (error) {
    throw error;
  }
};
const changeStatus = async (idCandidate, status, email, user) => {
  try {
    await candidateES.changeStatus(idCandidate, status);
    await candidateModel.changeStatus(idCandidate, status);
    const customSubject = `${user.companyName} thông báo tuyển dụng`;
    let htmlContent = '';
    if (status === STATUS.ACCEPT) {
      htmlContent =
        '<h3>Bạn đã ứng tuyển thành công vui lòng kiểm tra tin nhắn từ người phỏng vấn của chúng tôi</h3>';
    } else {
      htmlContent = '<h3>Điểu kiện bạn không đủ đáp ứng với chúng tôi</h3>';
    }
    await BrevoProvider.sendEmail(email, customSubject, htmlContent);
    return true;
  } catch (error) {
    throw error;
  }
};
const getCandidateDetails = async (idCandidate) => {
  try {
    const result = await candidateES.getCandidateDetails(idCandidate);
    return result;
  } catch (error) {
    throw error;
  }
};
const getJobsApplied = async (user) => {
  try {
    const result = await candidateModel.getJobsApplied(user);
    return result;
  } catch (error) {
    throw error;
  }
};
export const candidateSercice = {
  createNew,
  getListCandidates,
  deleteCandidate,
  changeStatus,
  getCandidateDetails,
  getJobsApplied
};
