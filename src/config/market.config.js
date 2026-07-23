require("dotenv").config();

const config = {
    stockSymbols: process.env.STOCK_SYMBOLS
        ? process.env.STOCK_SYMBOLS.split(",").map(symbol => symbol.trim())
        : [
            "RELIANCE.NS",
            "SUZLON.NS",
            "RVNL.NS",
            "IRCON.NS"
        ],

    activeProvider: process.env.ACTIVE_PROVIDER || "mock",

    choiceFinX: {
        enabled: process.env.CHOICE_FINX_ENABLED === "true",
        apiKey: process.env.CHOICE_FINX_API_KEY,
        baseUrl: "https://api.choiceindia.com"
    },

    indianApi: {
        enabled: process.env.INDIAN_API_ENABLED === "true",
        apiKey: process.env.INDIAN_API_KEY,
        baseUrl: "https://analyst.indianapi.in"
    }
};

module.exports = {

    getStockList() {
        return [...config.stockSymbols];
    },

    addStock(symbol) {
        config.stockSymbols.push(symbol);
    },

    removeStock(symbol) {
        config.stockSymbols =
            config.stockSymbols.filter(s => s !== symbol);
    },

    getProvider() {
        return config.activeProvider;
    },

    ...config
};