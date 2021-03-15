const express = require("express");
const { order } = require("../controller");
const { payment } = require("../controller");
const authorize = require("../utils/passportConfig").authenticate("jwt", {
  session: false,
});

const router = express.Router();

const {
  sendToAddress,
  getAddress,
  createOrder,
  getMyAllAddress,
  getOrder,
  getOrderDetails,
  getAddressById,
  getOrderForShipping,
  updateShipping,
} = order;

const { paidMoney, sendProducts, getPaymentByOrderNumber } = payment;

// Address
router.post("/api/address/add", authorize, sendToAddress);
router.get("/api/address/all", authorize, getMyAllAddress);
router.get("/api/address/:addressNumber", authorize, getAddress);
router.get("/api/addressById/:addressId", authorize, getAddressById);

// Order
router.get("/api/order", authorize, getOrder);
router.get("/api/order/shipping", authorize, getOrderForShipping);
router.get("/api/order/product/:ordernumber", authorize, getOrderDetails);

router.post("/api/order/add", authorize, createOrder);
router.post("/api/order/update/shipping", authorize, updateShipping);

router.post("/api/payment/add", authorize, paidMoney);
// router.patch("/api/payment/check", authorize, checkPayments);
router.patch("/api/oder/sendproduct", authorize, sendProducts);
router.get("/api/getpayment/:ordernumber", authorize, getPaymentByOrderNumber);

module.exports = router;
