const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const user = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      validate: {
        isUUID: 4,
      },
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "enter name of the user",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "enter email of the user",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "enter password of the user",
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "enter mobile number of the user",
    },
    whatsapp_number: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "enter WhatsApp number of the user",
    },
  },
  { tableName: "user", timestamps: true, paranoid: true }
);
module.exports = user;
