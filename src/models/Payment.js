const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Payment = sequelize.define("payment", {
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
    defaultValue: "จ่ายผ่านธนาคาร",
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "รอการตรวจสอบ",
  },
  datePayment: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  amountPrice: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Payment;
