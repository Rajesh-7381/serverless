const { Sequelize } = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectModule: require("mysql2"),
    timezone: process.env.TIMEZONE || "+05:30",
    // logging: process.env.NODE_ENV === "development" ? false : console.log,
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

if (process.env.NODE_ENV !== "test") {
  sequelize
    .authenticate()
    .then(() => console.log("MySQL connection established."))
    .catch((err) => {
      console.error("MySQL connection error:", err);
      process.exit(1);
    });
}

module.exports = sequelize;
