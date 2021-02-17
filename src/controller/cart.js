const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { Op } = require("sequelize");
const Address = require("../models/Address");

exports.ProductToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;

  try {
    const findCartUser = await Cart.findOne({
      where: {
        [Op.and]: [{ userId: req.user.id }, { sendorder: false }],
      },
    });

    const data = await CartItem.create({
      cartId: findCartUser.id,
      productId,
      quantity,
    });

    res.status(201).json(data);
  } catch (error) {
    // เพิ่มสินค้าตัวเดิมไม่ได้
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getProductInCart = async (req, res, next) => {
  try {
    const data = await Cart.findOne({
      where: {
        [Op.and]: [{ userId: req.user.id }, { sendorder: false }],
      },
      include: [
        {
          model: Product,
        },
      ],
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.DeleteCartItem = async (req, res, next) => {
  const { cartId, productId } = req.body;
  console.log("test");
  try {
    const data = await CartItem.destroy({
      where: {
        [Op.and]: [{ cartId }, { productId }],
      },
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error, "That is error");
    res.status(500).json(error);
  }
};
