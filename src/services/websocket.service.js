const WebSocket = require('ws');
const logger = require('../utils/logger');
const marketConfig = require('../config/market.config');

class WebSocketService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnects = 5;
    this.priceCache = new Map(); // symbol -> latest data
    this.subscribedSymbols = [];
  }

  async init() {
    const provider = marketConfig.activeProvider;

    logger.info(`🔌 Initializing WebSocket for provider: ${provider}`);

    if (provider === 'mock') {
      this.startMockStream();
      return;
    }

    // TODO: Add real providers (Choice FinX, Finnhub) in next step
    this.startMockStream(); // fallback for now
  }

  // Mock Stream for Testing (Realistic live updates)
  startMockStream() {
    logger.info('🧪 Starting Mock WebSocket Stream');

    setInterval(() => {
      marketConfig.getStockList().forEach(symbol => {
        const currentPrice = this.priceCache.get(symbol)?.price || 1200;
        const change = (Math.random() * 1.2) - 0.6;

        const liveData = {
          symbol,
          price: parseFloat((currentPrice + change).toFixed(2)),
          changePercent: parseFloat(change.toFixed(2)),
          timestamp: new Date().toISOString(),
          volume: Math.floor(Math.random() * 5000000) + 1000000
        };

        this.priceCache.set(symbol, liveData);

        // Optional: Emit event or update global state
        // this.emit('priceUpdate', liveData);
      });
    }, 3000); // Update every 3 seconds (for demo)

    this.isConnected = true;
    logger.info('✅ Mock WebSocket Stream Started');
  }

  getLivePrice(symbol) {
    return this.priceCache.get(symbol) || null;
  }

  getAllLivePrices() {
    return Array.from(this.priceCache.values());
  }

  // For future real providers
  async connectChoiceFinX() {
    // Will implement in Step 2
    logger.info('Choice FinX WebSocket coming in Step 2');
  }

  async connectFinnhub() {
    // Will implement in Step 2
    logger.info('Finnhub WebSocket coming in Step 2');
  }
}

// Export Singleton
module.exports = new WebSocketService();