const express = require("express");
const authorize = require("../utils/passportConfig").authenticate("jwt", {
  session: false,
});

const {
  getProductInCart,
  ProductToCart,
  DeleteCartItem,
} = require("../controller/cart");

const router = express.Router();

router.post("/api/cart/add", authorize, ProductToCart);
router.get("/api/cart", authorize, getProductInCart);
router.delete("/api/cart/delete", authorize, DeleteCartItem);

module.exports = router;
