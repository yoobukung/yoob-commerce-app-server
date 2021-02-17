const Sequelize = require("sequelize");
const sequelize = require("../utils/database");
const Order = require("./Order");

const Cart = sequelize.define("cart", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  sendorder: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

Cart.hasOne(Order);

module.exports = Cart;
