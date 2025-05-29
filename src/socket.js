import { Server } from 'socket.io';
import { TARGET_PAIRS, CURRENCY_PAIRS } from './config.js';
import logger from './utils/logger.js';
import {  configDotenv } from "dotenv";
configDotenv();

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const connectedClients = new Map();

  io.on('connection', (socket) => {
    const clientId = socket.id;
    connectedClients.set(clientId, socket);
    logger.info(`Client connected: ${clientId}`);
    
    socket.on('disconnect', () => {
      connectedClients.delete(clientId);
      logger.info(`Client disconnected: ${clientId}`);
    });
    
    // Send initial configuration
    socket.emit('init', {
      pairs: TARGET_PAIRS,
      types: Object.keys(CURRENCY_PAIRS)
    });
  });

  return io;
}