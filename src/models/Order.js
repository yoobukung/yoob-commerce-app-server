const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  orderNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  methodCheckout: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  checkout: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  shippingCode: {
    type: Sequelize.STRING,
  },
});

module.exports = Order;
