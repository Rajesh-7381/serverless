const rsiStrategy = require('../strategies/rsi.strategy');
const emaStrategy = require('../strategies/ema.strategy');
const breakoutStrategy = require('../strategies/breakout.strategy');

class TechnicalIndicatorService {
  async analyzeStock(symbol, historicalData) {
    const prices = historicalData.map(d => d.close);

    return {
      symbol,
      rsi: rsiStrategy.calculateRsi(prices),
      ema: emaStrategy.calculate(prices), // implement similarly
      breakout: breakoutStrategy.analyze(prices),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new TechnicalIndicatorService();