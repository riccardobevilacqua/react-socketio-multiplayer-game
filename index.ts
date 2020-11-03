import { Server } from './backend/Server';
import express from 'express';
import * as path from 'path';

const app = express();
const staticPath = path.join(__dirname, './frontend')
const port = process.env.PORT || 8080;

const server = new Server(app, staticPath);
server.start(port);
