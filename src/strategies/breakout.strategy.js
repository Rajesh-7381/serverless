const {
    BREAKOUT_STRATEGY_ENABLED,
    BREAKOUT_PERIOD,
    BREAKOUT_THRESHOLD
} = process.env;

class BreakoutStrategy {
    /**
     * Breakout Strategy Analysis
     * Detects when price breaks above resistance or below support
     */
    analyze(prices) {
        if (!BREAKOUT_STRATEGY_ENABLED || !prices || prices.length < BREAKOUT_PERIOD) {
            return {
                signal: 'NEUTRAL',
                score: 50,
                breakoutType: null,
                strength: 0
            };
        }

        const period = parseInt(BREAKOUT_PERIOD) || 20;
        const threshold = parseFloat(BREAKOUT_THRESHOLD) || 0.02; // 2% default

        const recentPrices = prices.slice(-period);
        const currentPrice = prices[prices.length - 1];

        // Calculate recent high and low (resistance & support)
        const recentHigh = Math.max(...recentPrices.slice(0, -1));   // exclude current price
        const recentLow = Math.min(...recentPrices.slice(0, -1));

        let signal = 'NEUTRAL';
        let score = 50;
        let breakoutType = null;
        let strength = 0;

        // Bullish Breakout (Price breaks above resistance)
        if (currentPrice > recentHigh * (1 + threshold)) {
            signal = 'BUY';
            breakoutType = 'BULLISH_BREAKOUT';
            strength = Math.round(((currentPrice - recentHigh) / recentHigh) * 100);
            score = 65 + Math.min(30, strength * 2);
        }
        // Bearish Breakout (Price breaks below support)
        else if (currentPrice < recentLow * (1 - threshold)) {
            signal = 'SELL';
            breakoutType = 'BEARISH_BREAKOUT';
            strength = Math.round(((recentLow - currentPrice) / recentLow) * 100);
            score = 35 - Math.min(30, strength * 2);
        }
        // Near breakout (consolidation near resistance/support)
        else if (currentPrice > recentHigh * 0.98) {
            signal = 'WATCH';
            breakoutType = 'NEAR_RESISTANCE';
            score = 55;
        }
        else if (currentPrice < recentLow * 1.02) {
            signal = 'WATCH';
            breakoutType = 'NEAR_SUPPORT';
            score = 45;
        }

        return {
            signal,
            score: Math.max(0, Math.min(100, Math.round(score))),
            breakoutType,
            strength,
            currentPrice: parseFloat(currentPrice.toFixed(2)),
            resistance: parseFloat(recentHigh.toFixed(2)),
            support: parseFloat(recentLow.toFixed(2))
        };
    }
}

// Export as singleton
module.exports = new BreakoutStrategy();