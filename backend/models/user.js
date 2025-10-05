
const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const E164_REGEX = /^\+[1-9]\d{1,14}$/;

const User = sequelize.define(
  "User1",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isE164(value) {
          if (!E164_REGEX.test(value)) {
            throw new Error("Phone must be in E.164 format (e.g. +919876543210)");
          }
        },
      },
    },


    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true, 
    tableName: "Users",
  }
);

module.exports = User;
