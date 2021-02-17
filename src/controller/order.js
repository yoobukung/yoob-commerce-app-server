const Address = require("../models/Address");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const { Op } = require("sequelize");
const Category = require("../models/Category");
const CartItem = require("../models/CartItem");

exports.sendToAddress = async (req, res, next) => {
  const { name, address, zone, city, telephon } = req.body;
  const randomnumber = Math.ceil(Math.random() * 8) * Date.now();
  const addressNumber = "address" + randomnumber.toString();

  try {
    const data = await Address.create({
      addressNumber,
      name,
      address,
      zone,
      city,
      telephon,
      userId: req.user.id,
    });
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getAllCartItem = async (req, res, next) => {
  try {
    const data = await CartItem.findAll({});
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ไม่พบข้อมูล" });
  }
};

exports.getAddress = async (req, res, next) => {
  const { addressNumber } = req.params;
  try {
    const data = await Address.findOne({ where: { addressNumber } });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getMyAllAddress = async (req, res, next) => {
  try {
    const data = await Address.findAll({ where: { userId: req.user.id } });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getAddressById = async (req, res, next) => {
  const { addressId } = req.params;
  try {
    const data = await Address.findOne({ where: { id: addressId } });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createOrder = async (req, res, next) => {
  const { addressNumber, methodCheckout } = req.body;

  // cal order number
  const randomnumber = Math.ceil(Math.random() * 8) * Date.now();
  const orderNumber = "order" + randomnumber.toString();

  try {
    // find data
    const AddressOfOrder = await Address.findOne({ where: { addressNumber } });
    const cart = await Cart.findOne({
      where: {
        [Op.and]: [{ userId: req.user.id }, { sendorder: false }],
      },
    });

    // create order
    const data = await Order.create({
      orderNumber,
      methodCheckout,
      addressId: AddressOfOrder.id,
      checkout: false,
      cartId: cart.id,
      userId: req.user.id,
    });

    const products = await CartItem.findAll({
      where: {
        cartId: cart.id,
      },
    });
    console.log(cart.id);

    // update products   // create orderItem

    products.map(async (cartItem) => {
      console.log(cartItem.quantity);
      // orderItem
      await OrderItem.create({
        orderId: data.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        codeShipping: "",
      });

      // update products
      await Product.decrement(
        { quantity: cartItem.quantity },
        { where: { id: cartItem.productId } }
      );
    });

    //  update cart and newCreate cart
    await Cart.update(
      { sendorder: true },
      {
        where: {
          [Op.and]: [{ userId: req.user.id }, { sendorder: false }],
        },
      }
    );
    await Cart.create({ userId: req.user.id });

    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const data = await Order.findAll({
      where: { userId: req.user.id },
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

exports.getOrderForShipping = async (req, res, next) => {
  try {
    const data = await Order.findAll({
      include: [
        {
          model: Product,
          required: true,
          where: { userId: req.user.id },
        },
      ],
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

exports.updateShipping = async (req, res, next) => {
  const { orderNumber, shippingCode } = req.body;
  try {
    const products = await Product.findAll({
      where: {
        userId: req.user.id,
      },
    });

    const order = await Order.findOne({
      where: {
        orderNumber,
      },
    });

    await Order.update({ shippingCode }, { where: { orderNumber } });

    products.map(async (product) => {
      await OrderItem.update(
        { codeShipping: shippingCode },
        {
          where: {
            [Op.and]: [{ orderId: order.id }, { productId: product.id }],
          },
        }
      );
    });
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
  }
};

exports.getOrderDetails = async (req, res, next) => {
  const { ordernumber } = req.params;

  try {
    const order = await Order.findOne({
      where: {
        [Op.and]: [{ userId: req.user.id }, { id: ordernumber }],
      },
      include: [
        {
          model: Product,
          required: true,
        },
      ],
    });
    const address = await Address.findOne({ where: { id: order.addressId } });

    res.status(201).json({ order, address });
  } catch (error) {
    console.log(error);
  }
};
