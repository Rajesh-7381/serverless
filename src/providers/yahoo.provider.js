const yahooFinance = require('yahoo-finance2').default;
const logger = require('../utils/logger');

class YahooProvider {
  async getHistoricalData(symbol, period = '1mo', interval = '1d') {
    try {
      const queryOptions = { period1: '2024-01-01' }; // dynamic in real use
      const result = await yahooFinance.historical(symbol, queryOptions);
      return result;
    } catch (error) {
      logger.error(`Yahoo Finance error for ${symbol}:`, error.message);
      return [];
    }
  }

  async getQuote(symbol) {
    try {
      return await yahooFinance.quote(symbol);
    } catch (error) {
      logger.error(`Quote error ${symbol}:`, error);
      return null;
    }
  }
}

module.exports = new YahooProvider();