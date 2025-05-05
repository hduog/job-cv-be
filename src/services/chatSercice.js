import { chatModel } from '~/models/chatModel';
import { roomChatModel } from '~/models/roomChatModel';
import { userModel } from '~/models/userModel';
import { ROLE_USER, STATUS } from '~/utils/constants';
const getListChat = async (roomChatId) => {
  try {
    const reuslt = await chatModel.getListChat(roomChatId);
    return reuslt;
  } catch (error) {
    throw error;
  }
};
const getListUserChat = async (user) => {
  try {
    const listUserChat = await roomChatModel.getListUserChat(user);
    const newListChatUser = [];
    for (const userChat of listUserChat) {
      if (user.role === ROLE_USER.JOB_SEEKER) {
        const infoUser = await userModel.findOneById(userChat.interviewerId);
        if (infoUser.status === STATUS.ACTIVE) {
          newListChatUser.push({
            ...userChat,
            infoUser
          });
        }
      } else {
        const infoUser = await userModel.findOneById(userChat.jobSeekerId);
        if (infoUser.status === STATUS.ACTIVE) {
          newListChatUser.push({
            ...userChat,
            infoUser
          });
        }
      }
    }
    return newListChatUser;
  } catch (error) {
    throw error;
  }
};
const getRoomChatDetails = async (roomChatId, user) => {
  try {
    const roomChat = await roomChatModel.findOneById(roomChatId);
    let infoUser;
    if (user.role === ROLE_USER.JOB_SEEKER) {
      infoUser = await userModel.findOneById(roomChat.interviewerId);
    } else {
      infoUser = await userModel.findOneById(roomChat.jobSeekerId);
    }
    return {
      ...roomChat,
      infoUser
    };
  } catch (error) {
    throw error;
  }
};
export const chatSercice = {
  getListChat,
  getListUserChat,
  getRoomChatDetails
};
