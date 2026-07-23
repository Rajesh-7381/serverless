const express = require('express');
const router = express.Router();

const recommendationService = require('../../services/recommendation.service');
const marketDataService = require('../../services/marketData.service');
const logger = require('../../utils/logger');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    version: 'v1',
    timestamp: new Date().toISOString()
  });
});

// Get Today's Stock Recommendations
router.get('/recommendations/today', async (req, res) => {
  try {
    const recommendations = await recommendationService.generateDailyRecommendations();
    res.json({
      success: true,
      date: new Date().toISOString().split('T')[0],
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    logger.error('Recommendation route error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get Market Data for Symbol
router.get('/market/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const quote = await marketDataService.getCurrentQuote(symbol);
    const history = await marketDataService.getHistoricalData(symbol);

    res.json({
      success: true,
      symbol: symbol.toUpperCase(),
      current: quote,
      last10Days: history.slice(-10)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Manual Trigger Recommendation Job
router.post('/trigger-job', async (req, res) => {
  try {
    logger.info('🔄 Manual job trigger via API');
    const result = await recommendationService.generateDailyRecommendations();
    
    res.json({
      success: true,
      message: "Stock recommendation job executed successfully",
      result
    });
  } catch (error) {
    logger.error('Trigger job failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;