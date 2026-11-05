
import dns from 'node:dns';

// DNS workaround for MongoDB SRV resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(
        `✨ Wedora Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
      );
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    });

    process.on('unhandledRejection', (err) => {
      console.error(`💥 Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM received. Shutting down gracefully.');
      server.close(() => {
        console.log('Server closed.');
      });
    });
  } catch (error) {
    console.error(`Failed to launch server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
