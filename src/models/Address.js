const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Order = require("./Order");

const Address = sequelize.define("address", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  addressNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  zone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  telephon: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Address.hasOne(Order);

module.exports = Address;
