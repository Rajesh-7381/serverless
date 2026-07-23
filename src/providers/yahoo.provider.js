const axios = require('axios');
const logger = require('../utils/logger');

class MarketProvider {
  async getHistoricalData(symbol) {
    try {
      logger.info(`Fetching real data for ${symbol}`);

      // Using a public API (you can change to Alpha Vantage later)
      const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, {
        params: {
          interval: '1d',
          range: '3mo'
        },
        timeout: 10000
      });

      const result = response.data.chart.result[0];
      const timestamps = result.timestamp;
      const quotes = result.indicators.quote[0];

      const data = timestamps.map((time, i) => ({
        date: new Date(time * 1000).toISOString().split('T')[0],
        close: quotes.close[i],
        open: quotes.open[i],
        high: quotes.high[i],
        low: quotes.low[i]
      }));

      logger.info(`✅ ${symbol}: ${data.length} candles loaded`);
      return data;
    } catch (error) {
      logger.error(`Failed to fetch ${symbol}: ${error.message}`);
      return [];
    }
  }

  async getQuote(symbol) {
    try {
      const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`);
      const quote = response.data.chart.result[0].meta;
      return {
        symbol,
        price: quote.regularMarketPrice,
        changePercent: quote.regularMarketChangePercent
      };
    } catch (error) {
      logger.error(`Quote failed for ${symbol}`);
      return null;
    }
  }
}

module.exports = new MarketProvider();