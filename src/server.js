/* eslint-disable no-console */
import express from 'express';
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb';
import cors from 'cors';
import exitHook from 'async-exit-hook';
import { env } from './config/environment';
import { APIs_V1 } from '~/routes/v1';
import { corsOptions } from './config/cors';
import cookieParser from 'cookie-parser';
import { errorHandlingMiddleware } from './middlewares/errorsHandlingMiddleware';
import { CONNECT_ES } from './config/elasticsearch';
import http from 'http';
import socketIo from 'socket.io';
import { chatSocket } from './sockets/chatSocket';
const START_SERVER = () => {
  const app = express();
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
  });
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(express.json());

  app.use('/api/v1', APIs_V1);
  app.use(errorHandlingMiddleware);
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: corsOptions
  });
  // eslint-disable-next-line no-unused-vars
  io.on('connection', (socket) => {
    chatSocket(socket);
  });
  server.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Running at ${env.APP_HOST}:${env.APP_PORT}/`);
  });
  exitHook(() => {
    CLOSE_DB();
  });
};
(async () => {
  try {
    await CONNECT_DB();
    console.log('Connected to MongoDB Cloud Atlas !');
    await CONNECT_ES();
    console.log('Connect to ES !');
    START_SERVER();
  } catch (error) {
    process.exit(0);
  }
})();
