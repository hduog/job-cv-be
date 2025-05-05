import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';

const ROOM_CHAT_COLLECTION_NAME = 'roomChats';
const ROOM_CHAT_COLLECTION_SHEMA = Joi.object({
  jobSeekerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  interviewerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
});
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(ROOM_CHAT_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const validateBeforeCreate = async (data) => {
  return await ROOM_CHAT_COLLECTION_SHEMA.validateAsync(data, { abortEarly: false });
};
const createNew = async (userId, data) => {
  try {
    data.interviewerId = userId;
    const valiData = await validateBeforeCreate(data);
    const newChatRoom = {
      ...valiData,
      jobSeekerId: ObjectId.createFromHexString(valiData.jobSeekerId),
      interviewerId: ObjectId.createFromHexString(userId)
    };
    return await GET_DB().collection(ROOM_CHAT_COLLECTION_NAME).insertOne(newChatRoom);
  } catch (error) {
    throw new Error(error);
  }
};
const getListUserChat = async (user) => {
  try {
    const result = await GET_DB()
      .collection(ROOM_CHAT_COLLECTION_NAME)
      .find({
        $or: [
          { jobSeekerId: ObjectId.createFromHexString(user._id.toString()) },
          { interviewerId: ObjectId.createFromHexString(user._id.toString()) }
        ]
      })
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const roomChatModel = {
  ROOM_CHAT_COLLECTION_NAME,
  ROOM_CHAT_COLLECTION_SHEMA,
  findOneById,
  validateBeforeCreate,
  createNew,
  getListUserChat
};
