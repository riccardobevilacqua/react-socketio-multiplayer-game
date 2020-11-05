import { Handler as ExpressHandler } from 'express';
import { join as pathJoin } from 'path';
import session from 'express-session';
import { createServer } from './backend/Server';
import { defaultPort, frontendPath } from './backend/Constants';
import { createSocket } from './backend/Socket';

const staticPath = pathJoin(__dirname, frontendPath);
const port = process.env.PORT || defaultPort;
const secret = process.env.NODE_ENV === 'production' ? process.env.COOKIE_SECRET || '' : 'DEV_COOKIE_SECRET';

const sessionMiddleware: ExpressHandler = session({
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000 // 2 hours
  }
});

const server = createServer({
  port,
  staticPath,
  sessionMiddleware,
});

createSocket(server, sessionMiddleware);
