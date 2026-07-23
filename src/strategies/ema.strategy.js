const { EMA_STRATEGY_ENABLED, EMA_FAST, EMA_SLOW } = process.env;

class EmaStrategy {
    /**
     * Calculate Exponential Moving Average
     * @param {Array<number>} prices - Array of closing prices (oldest to newest)
     * @returns {Object} - Signal and score
     */
    calculate(prices) {
        if (!EMA_STRATEGY_ENABLED || !prices || prices.length < Math.max(EMA_FAST, EMA_SLOW)) {
            return {
                signal: 'NEUTRAL',
                score: 50,
                emaFast: null,
                emaSlow: null
            };
        }

        const fastEma = this.calculateEMA(prices, parseInt(EMA_FAST));
        const slowEma = this.calculateEMA(prices, parseInt(EMA_SLOW));

        let signal = 'NEUTRAL';
        let score = 50;

        if (fastEma > slowEma) {
            signal = 'BUY';
            score = 70 + Math.min(25, Math.round((fastEma - slowEma) / slowEma * 100));
        } else if (fastEma < slowEma) {
            signal = 'SELL';
            score = 30 - Math.min(25, Math.round((slowEma - fastEma) / slowEma * 100));
        }

        return {
            signal,
            score: Math.max(0, Math.min(100, score)),
            emaFast: parseFloat(fastEma.toFixed(2)),
            emaSlow: parseFloat(slowEma.toFixed(2))
        };
    }

    /**
     * Calculate Single EMA
     */
    calculateEMA(prices, period) {
        const multiplier = 2 / (period + 1);
        let ema = prices[0]; // Start with first price as initial EMA

        for (let i = 1; i < prices.length; i++) {
            ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
        }

        return ema;
    }
}

// Export singleton
module.exports = new EmaStrategy();