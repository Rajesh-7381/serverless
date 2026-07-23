const cron = require('node-cron');
const { dailyRecommendationCron, enabled } = require("../config/scheduler.config");
const recommendationJob = require('../jobs/stockRecommendation.job');
const logger = require('../utils/logger');

class Scheduler {
  init() {
    if (!enabled) {
      logger.warn('⚠️ Scheduler is disabled in config');
      return;
    }

    cron.schedule(dailyRecommendationCron, async () => {
      logger.info(`🕒 Running scheduled job at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
      await recommendationJob.execute();
    }, {
      timezone: "Asia/Kolkata"
    });

    logger.info(`✅ Scheduler initialized - Daily recommendation at ${dailyRecommendationCron} IST`);
  }
}

module.exports = new Scheduler();