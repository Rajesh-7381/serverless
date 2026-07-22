import dotenv from "dotenv";

dotenv.config();

export default {
    enabled: process.env.CRON_ENABLED === "true",

    expression: process.env.CRON_EXPRESSION,

    timezone: process.env.TIMEZONE
};