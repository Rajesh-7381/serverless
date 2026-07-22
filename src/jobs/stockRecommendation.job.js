const recommendationService = require('../services/recommendation.service');
const logger = require('../utils/logger');

class StockRecommendationJob {
  async execute() {
    try {
      await recommendationService.generateDailyRecommendations();
    } catch (error) {
      logger.error('Job failed:', error);
    }
  }
}

module.exports = new StockRecommendationJob();