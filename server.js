const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const logger = require("./src/utils/logger");
const scheduler = require("./src/cron/scheduler");
const websocketService = require("./src/services/websocket.service");
const loadRoutes = require("./src/routes");
const { sequelize } = require("./src/model");
const { port } = require("./src/config/app.config");

async function bootstrap() {
  try {
    logger.info("🚀 Starting Application...");

    // ==============================
    // Database Connection
    // ==============================
    await sequelize.authenticate();
    logger.info("✅ Database Connected");
    logger.info("Before Sync");

await sequelize.sync({ alter: true });

logger.info("After Sync");

    // ==============================
    // Sync Models (Development Only)
    // ==============================
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true });
      logger.info("✅ Database Synced");
    }

    // ==============================
    // Express Middleware
    // ==============================
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // ==============================
    // Load Routes
    // ==============================
    await loadRoutes(app);
    logger.info("✅ Routes Loaded");

    // ==============================
    // Scheduler
    // ==============================
    scheduler.init();

    // ==============================
    // WebSocket
    // ==============================
    await websocketService.init();

    // ==============================
    // Start Server
    // ==============================
    app.listen(port, () => {
      logger.info(
        `🚀 Server running on http://localhost:${port} (${process.env.NODE_ENV})`
      );
    });
  } catch (error) {
    logger.error("❌ Application Startup Failed", error);
    process.exit(1);
  }
}

bootstrap();