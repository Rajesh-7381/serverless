const { RSI_STRATEGY_ENABLED, RSI_PERIOD, RSI_OVERBOUGHT, RSI_OVERSOLD } = process.env;

class RsiStrategy {
  calculateRsi(prices) {
    if (!RSI_STRATEGY_ENABLED || prices.length < RSI_PERIOD) return { signal: 'NEUTRAL', score: 50 };

    // Simple RSI calculation (you can use TA-Lib later)
    let gains = 0, losses = 0;
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i-1];
      if (change > 0) gains += change;
      else losses -= change;
    }

    const avgGain = gains / RSI_PERIOD;
    const avgLoss = losses / RSI_PERIOD;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    let signal = 'NEUTRAL';
    if (rsi < RSI_OVERSOLD) signal = 'BUY';
    else if (rsi > RSI_OVERBOUGHT) signal = 'SELL';

    return { signal, score: Math.round(rsi) };
  }
}

module.exports = new RsiStrategy();