import { createServer } from 'http';
import { serverPort } from './src/config.js';
import logger from './src/utils/logger.js';
import { connectDatabase, setupNotificationHandler, closeDatabase } from './src/database.js';
import { setupSocket } from './src/socket.js';
import {  configDotenv } from "dotenv";
configDotenv();

async function startServer() {
  const httpServer = createServer();
  
  const io = setupSocket(httpServer);
  
  try {
    await connectDatabase();
    setupNotificationHandler(io);
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    process.exit(1);
  }
  
  httpServer.listen(serverPort, () => {
    logger.info(`Server running on port ${serverPort}`);
    console.log(`Server running on port ${serverPort}`);
    
  });
  
  process.on('SIGINT', async () => {
    logger.info('Shutting down server...');
    
    try {
      await closeDatabase();
      httpServer.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  });
}

startServer().catch(error => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});