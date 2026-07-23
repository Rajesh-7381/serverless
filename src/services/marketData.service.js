const yahooProvider = require("../providers/yahoo.provider");
const { stockSymbols } = require("../config/market.config");
const logger = require("../utils/logger");

class MarketDataService {
  constructor() {
    this.provider = yahooProvider;
  }

  /** ✅ Fixed: Return array of symbols */
  getSymbols() {
    if (!stockSymbols || stockSymbols.length === 0) {
      logger.warn("No stock symbols configured in market.config");
      return ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS"]; // fallback
    }
    return stockSymbols;
  }

  async getHistoricalData(symbol, period = "6mo", interval = "1d") {
    try {
      logger.info(`Fetching historical data for ${symbol}`);
      const data = await this.provider.getHistoricalData(
        symbol,
        period,
        interval,
      );
      return data || [];
    } catch (error) {
      logger.error(`Historical data failed for ${symbol}:`, error.message);
      return [];
    }
  }

  async getCurrentQuote(symbol) {
    try {
      return await this.provider.getQuote(symbol);
    } catch (error) {
      logger.error(`Quote failed for ${symbol}:`, error.message);
      return null;
    }
  }

  async getAllQuotes() {
    const quotes = [];
    for (const symbol of this.getSymbols()) {
      const quote = await this.getCurrentQuote(symbol);
      if (quote) quotes.push({ symbol, ...quote });
    }
    return quotes;
  }
}

module.exports = new MarketDataService();
