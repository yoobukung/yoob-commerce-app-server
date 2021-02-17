const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Product = require("./Product");
const Cart = require("./Cart");
const Order = require("./Order");

const CartItem = sequelize.define("cartItem", {
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

Cart.belongsToMany(Product, { through: "cartItem", foreignKey: "cartId" });
Product.belongsToMany(Cart, { through: "cartItem", foreignKey: "productId" });

module.exports = CartItem;
