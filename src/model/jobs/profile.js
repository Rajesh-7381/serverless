const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const profile = sequelize.define(
  "Profile",
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
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    experience_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "enter experience year of the user",
    },
    experience_month: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "enter experience month of the user",
    },
    keywords: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "enter keywords for searching jobs",
    },
    sources: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "enter sources for searching jobs, like naukri, indeed, etc.",
    },
    posted_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "enter posted date for the job posting",
    },
  },
  { tableName: "profile", timestamps: true, paranoid: true },
);
module.exports = profile;
