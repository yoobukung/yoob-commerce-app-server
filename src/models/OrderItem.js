const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Product = require("./Product");
const Cart = require("./Cart");
const Order = require("./Order");

const OrdertItem = sequelize.define("orderItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  codeShipping: Sequelize.STRING,
});

Order.belongsToMany(Product, { through: "orderItem", foreignKey: "orderId" });
Product.belongsToMany(Order, { through: "orderItem", foreignKey: "productId" });

module.exports = OrdertItem;
