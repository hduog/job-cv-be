import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';

const CHAT_COLLECTION_NAME = 'chat';
const CHAT_COLLECTION_SHEMA = Joi.object({
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  roomChatId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  content: Joi.string(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
});
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CHAT_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const validateBeforeCreate = async (data) => {
  return await CHAT_COLLECTION_SHEMA.validateAsync(data, { abortEarly: false });
};
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data);
    const newJob = {
      ...valiData,
      userId: ObjectId.createFromHexString(valiData.userId),
      roomChatId: ObjectId.createFromHexString(valiData.roomChatId)
    };
    return await GET_DB().collection(CHAT_COLLECTION_NAME).insertOne(newJob);
  } catch (error) {
    throw new Error(error);
  }
};
const getListChat = async (roomChatId) => {
  try {
    const result = await GET_DB()
      .collection(CHAT_COLLECTION_NAME)
      .find({
        roomChatId: ObjectId.createFromHexString(roomChatId),
        _destroy: false
      })
      .sort({ createdAt: 1 })
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const chatModel = {
  CHAT_COLLECTION_NAME,
  CHAT_COLLECTION_SHEMA,
  createNew,
  findOneById,
  getListChat
};
