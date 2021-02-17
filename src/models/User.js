const Sequelize = require("sequelize");
const sequelize = require("../utils/database");
const Cart = require("./Cart");
const Product = require("./Product");
const Address = require("./Address");
const Order = require("./Order");
const Payment = require("./Payment");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  username: {
    type: Sequelize.STRING(20),
    allowNull: false,
    unique: true,
  },
  email: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  resetpasswordlink: {
    type: Sequelize.STRING,
  },
  role: {
    type: Sequelize.STRING(20),
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING,
  },
});

User.hasOne(Cart);
User.hasOne(Product, { constraints: true, onDelete: "CASCADE" });
User.hasOne(Address);
User.hasMany(Order);
User.hasMany(Payment);

module.exports = User;
