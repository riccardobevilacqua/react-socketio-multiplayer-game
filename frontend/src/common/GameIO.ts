import io from 'socket.io-client';
import { GameIO } from './Constants';
import { generateUserId } from '../utils/utils';


export const gameIO: GameIO = io();
gameIO.userId = generateUserId();