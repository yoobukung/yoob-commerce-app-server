const Address = require("../models/Address");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { Op } = require("sequelize");
const Category = require("../models/Category");
const Payment = require("../models/Payment");

exports.paidMoney = async (req, res, next) => {
  const { orderNumber, methodCheckout, datePayment, amountPrice } = req.body;
  try {
    const data = await Payment.create({
      orderNumber,
      methodCheckout,
      datePayment,
      amountPrice,
      userId: req.user.id,
    });
    await Order.update({ checkout: true }, { where: { orderNumber } });

    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.sendProducts = async (req, res, next) => {
  try {
    const data = await Order.update({
      orderNumber,
      methodCheckout,
      checkout: true,
      addressId,
    });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getPaymentByOrderNumber = async (req, res, next) => {
  const { ordernumber } = req.params;
  try {
    const data = await Payment.findOne({
      where: { orderNumber: ordernumber },
    });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
