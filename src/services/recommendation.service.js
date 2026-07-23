const marketDataService = require('./marketData.service');
const technicalService = require('./technicalIndicator.service');
const logger = require('../utils/logger');

class RecommendationService {
  async generateDailyRecommendations() {
    logger.info('🚀 Generating daily stock recommendations...');

    const recommendations = [];

    for (const symbol of marketDataService.getSymbols()) {
      try {
        const historicalData = await marketDataService.getHistoricalData(symbol);
        
        if (historicalData.length < 20) {
          logger.warn(`Not enough data for ${symbol}`);
          recommendations.push({
            symbol,
            recommendation: "HOLD",
            confidence: 40,
            reason: "Insufficient data",
            date: new Date().toISOString().split('T')[0]
          });
          continue;
        }

        const analysis = await technicalService.analyzeStock(symbol, historicalData);
        const finalRec = this.aggregateRecommendations(analysis);

        recommendations.push({
          symbol,
          recommendation: finalRec.recommendation,
          confidence: finalRec.confidence,
          analysis: {
            rsi: analysis.rsi?.signal,
            ema: analysis.ema?.signal,
            breakout: analysis.breakout?.signal
          },
          date: new Date().toISOString().split('T')[0]
        });

      } catch (err) {
        logger.error(`Error analyzing ${symbol}:`, err.message);
      }
    }

    logger.info(`✅ Generated ${recommendations.length} recommendations`);
    return recommendations;
  }

  aggregateRecommendations(analysis) {
    let score = 50;

    // RSI
    if (analysis.rsi?.signal === 'BUY') score += 25;
    else if (analysis.rsi?.signal === 'SELL') score -= 20;

    // EMA
    if (analysis.ema?.signal === 'BUY') score += 20;
    else if (analysis.ema?.signal === 'SELL') score -= 15;

    // Breakout
    if (analysis.breakout?.signal === 'BUY') score += 25;
    else if (analysis.breakout?.signal === 'SELL') score -= 20;

    let recommendation = 'HOLD';
    if (score >= 75) recommendation = 'STRONG BUY';
    else if (score >= 60) recommendation = 'BUY';
    else if (score <= 35) recommendation = 'SELL';

    return {
      recommendation,
      confidence: Math.max(30, Math.min(95, Math.round(score)))
    };
  }
}

module.exports = new RecommendationService();