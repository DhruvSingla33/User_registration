
const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const E164_REGEX = /^\+[1-9]\d{1,14}$/;

const Otp = sequelize.define(
  "Otp1",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isE164(value) {
          if (!E164_REGEX.test(value)) {
            throw new Error("Phone must be in E.164 format (e.g. +919876543210)");
          }
        },
      },
    },

    codeHash: { type: DataTypes.STRING, allowNull: false },

    expiresAt: { type: DataTypes.DATE, allowNull: false },

    attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    timestamps: true,
    tableName: "Otps",

  }
);

module.exports = Otp;
