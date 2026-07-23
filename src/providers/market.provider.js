const mockProvider = require('./mock.provider');
const yahooProvider = require('./yahoo.provider');
// const choiceProvider = require('./choice.provider');
// const indianProvider = require('./indian.provider');

const { activeProvider } = require('../config/market.config');
const logger = require('../utils/logger');

class MarketProvider {
  constructor() {
    this.providers = {
      mock: mockProvider,
      yahoo: yahooProvider,
      // choice: choiceProvider,
      // indian: indianProvider
    };
    this.active = activeProvider;
  }

  getActiveProvider() {
    return this.providers[this.active] || this.providers.mock;
  }

  async getHistoricalData(symbol) {
    return this.getActiveProvider().getHistoricalData(symbol);
  }

  async getQuote(symbol) {
    return this.getActiveProvider().getQuote(symbol);
  }

  // Switch provider at runtime
  switchProvider(providerName) {
    if (this.providers[providerName]) {
      this.active = providerName;
      logger.info(`Switched to ${providerName} provider`);
    }
  }
}

module.exports = new MarketProvider();