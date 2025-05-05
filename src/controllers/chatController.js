import { StatusCodes } from 'http-status-codes';
import { chatSercice } from '~/services/chatSercice';
const getListChat = async (req, res, next) => {
  try {
    const result = await chatSercice.getListChat(req.params.id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getListUserChat = async (req, res, next) => {
  try {
    const result = await chatSercice.getListUserChat(req.jwtDecoded);
    res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};
const getRoomChatDetails = async (req, res, next) => {
  try {
    const createdUser = await chatSercice.getRoomChatDetails(req.params.id, req.jwtDecoded);
    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    next(error);
  }
};
export const chatController = {
  getListChat,
  getListUserChat,
  getRoomChatDetails
};
