require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 2002,
    logLevel: process.env.LOG_LEVEL || 'info',
    marketTimezone: process.env.MARKET_TIMEZONE || 'Asia/Kolkata',

    // App name for logging
    appName: 'stock-recommendation',

    // Enable/disable features
    enableScheduler: process.env.SCHEDULER_ENABLED !== 'false',
    enableNotifications: process.env.NOTIFICATION_ENABLED !== 'false'
};