const express = require("express");
const dotenv = require("dotenv");
const app = express();
const logger = require("./src/utils/logger");
const scheduler = require("./src/cron/scheduler");
const { port } = require("./src/config/app.config");
const websocketService = require('./src/services/websocket.service');
websocketService.init();

dotenv.config();

const startServer = async () => {
  try {
    // Load routes dynamically
    const loadRoutes = require("./src/routes/index");
    await loadRoutes(app);

    // Initialize scheduler (cron jobs)
    scheduler.init();

    app.listen(port, () => {
      logger.info(`🚀 Server running on port ${port} | ENV: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Server listening at http://localhost:${port}`);
    });

  } catch (error) {
    logger.error("❌ Failed to start application:", error);
    process.exit(1);
  }
};

startServer();