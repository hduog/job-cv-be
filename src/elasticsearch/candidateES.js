import { GET_ES } from '~/config/elasticsearch';
import { candidateModel } from '~/models/candidateModel';
import { userModel } from '~/models/userModel';
import { STATUS } from '~/utils/constants';
const createNew = async (idCandidate, reqBody, user) => {
  try {
    const currentUser = await userModel.findOneById(user._id);
    return await GET_ES().index({
      index: candidateModel.CANDIDATE_COLLECTION_NAME,
      id: idCandidate,
      document: {
        indoUser: {
          ...currentUser
        },
        ...reqBody,
        status: STATUS.PENDING,
        createdAt: new Date()
      }
    });
  } catch (error) {
    throw new Error(error);
  }
};
const getListCandidates = async (user, reqQuery) => {
  const { expensive, skills, education, desiredSalary } = reqQuery;

  let mustQuery = [];
  mustQuery.push({ match: { employerId: user._id } });
  if (expensive) {
    mustQuery.push({ match: { 'indoUser.expensive': expensive } });
  }

  if (skills) {
    const skillsArray = skills.split(','); // Chuyển string thành mảng

    mustQuery.push({
      exists: { 'indoUser.skills': skillsArray }
    });
  }
  if (education) {
    mustQuery.push({
      match: {
        'indoUser.education': {
          query: education,
          fuzziness: 'AUTO',
          operator: 'and'
        }
      }
    });
  }
  if (desiredSalary) {
    mustQuery.push({
      range: {
        'indoUser.desiredSalary': {
          gte: desiredSalary
        }
      }
    });
  }

  try {
    const body = await GET_ES().search({
      index: candidateModel.CANDIDATE_COLLECTION_NAME,
      size: 1000,
      body: {
        sort: [{ createdAt: { order: 'desc' } }],
        query: {
          bool: {
            must: mustQuery
          }
        }
      }
    });
    return body.hits.hits;
  } catch (error) {
    throw new Error(error);
  }
};
const deleteCandidate = async (id) => {
  try {
    const response = await GET_ES().delete({
      index: candidateModel.CANDIDATE_COLLECTION_NAME,
      id
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
const changeStatus = async (id, status) => {
  try {
    const response = await GET_ES().update({
      index: candidateModel.CANDIDATE_COLLECTION_NAME,
      id,
      body: {
        doc: {
          ['status']: status
        }
      }
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
const getCandidateDetails = async (idCandidate) => {
  try {
    const result = await GET_ES().get({
      index: candidateModel.CANDIDATE_COLLECTION_NAME, // Thay thế bằng index của bạn
      id: idCandidate
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const candidateES = {
  createNew,
  getListCandidates,
  deleteCandidate,
  changeStatus,
  getCandidateDetails
};
