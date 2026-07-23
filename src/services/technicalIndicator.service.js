const rsiStrategy = require('../strategies/rsi.strategy');
const emaStrategy = require('../strategies/ema.strategy');
const breakoutStrategy = require('../strategies/breakout.strategy');
const logger = require('../utils/logger');

class TechnicalIndicatorService {
  async analyzeStock(symbol, historicalData) {
    if (!historicalData || historicalData.length < 14) {
      logger.warn(`Not enough data for analysis: ${symbol} (${historicalData?.length || 0} candles)`);
      return {
        symbol,
        rsi: { signal: 'NEUTRAL', score: 50 },
        ema: { signal: 'NEUTRAL', score: 50 },
        breakout: { signal: 'NEUTRAL', score: 50 }
      };
    }

    const prices = historicalData.map(d => d.close || d.Close);

    return {
      symbol,
      rsi: rsiStrategy.calculateRsi(prices),
      ema: emaStrategy.calculate(prices),
      breakout: breakoutStrategy.analyze(prices)
    };
  }
}

module.exports = new TechnicalIndicatorService();