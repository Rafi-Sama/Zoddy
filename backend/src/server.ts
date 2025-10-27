// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import { Application } from 'express';
import { createServer } from 'http';
import app from './app';
import logger from './utils/logger';
import { initializeCronJobs } from './jobs';

const PORT = process.env.PORT || 5000;
const server: Application = app;

// Create HTTP server
const httpServer = createServer(server);

// Start server
httpServer.listen(PORT, () => {
  logger.info(`🚀 Zoddy Backend Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 API Base URL: http://localhost:${PORT}/api/${process.env.API_VERSION || 'v1'}`);

  // Initialize cron jobs if enabled
  if (process.env.ENABLE_CRON_JOBS === 'true') {
    initializeCronJobs();
    logger.info('⏰ Cron jobs initialized');
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  httpServer.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    logger.info('💤 Process terminated');
  });
});

export default httpServer;
