import { chatModel } from '~/models/chatModel';

export const chatSocket = (socket) => {
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });
  socket.on('CLIENT_SEND_MESSAGE', async ({ id, data }) => {
    data.roomChatId = id;
    await chatModel.createNew(data);
    socket.broadcast.to(id).emit('SERVER_RETURN_MESSAGE', data);
  });
};
