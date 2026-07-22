const marketDataService = require('./marketData.service');
const technicalService = require('./technicalIndicator.service');
const notificationService = require('./notification.service');
const logger = require('../utils/logger');

class RecommendationService {
  async generateDailyRecommendations() {
    logger.info('🚀 Generating daily stock recommendations...');

    const recommendations = [];

    for (const symbol of marketDataService.getSymbols()) {
      try {
        const data = await marketDataService.getHistoricalData(symbol);
        const analysis = await technicalService.analyzeStock(symbol, data);

        const finalRecommendation = this.aggregateSignals(analysis);

        recommendations.push({
          symbol,
          recommendation: finalRecommendation,
          confidence: this.calculateConfidence(analysis),
          date: new Date().toISOString().split('T')[0]
        });
      } catch (err) {
        logger.error(`Failed to analyze ${symbol}`, err);
      }
    }

    await notificationService.sendRecommendations(recommendations);
    logger.info(`✅ Generated ${recommendations.length} recommendations`);
    return recommendations;
  }

  aggregateSignals(analysis) {
    // Weighted scoring logic - make dynamic via config later
    let score = 0;
    if (analysis.rsi.signal === 'BUY') score += 40;
    if (analysis.ema.signal === 'BUY') score += 30;
    if (analysis.breakout.signal === 'BUY') score += 30;

    return score > 70 ? 'STRONG BUY' : score > 50 ? 'BUY' : score < 30 ? 'SELL' : 'HOLD';
  }

  calculateConfidence(analysis) {
    return Math.min(95, Math.round(
      (analysis.rsi.score + (analysis.ema.score || 50) + (analysis.breakout.score || 50)) / 3
    ));
  }
}

module.exports = new RecommendationService();