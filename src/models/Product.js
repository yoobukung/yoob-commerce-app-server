const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Category = require("./Category");

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(250),
    allowNull: false,
    unique: true,
  },
  slug: {
    type: Sequelize.STRING(250),
    allowNull: false,
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
  },
  imageKey: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING(50000),
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  shippingCost: {
    type: Sequelize.INTEGER,
  },
});

Category.hasMany(Product);

module.exports = Product;
