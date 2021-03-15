const express = require("express");
const { product } = require("../controller");
const {
  getProduct,
  getProductByName,
  addProduct,
  editProduct,
  removeProduct,
  getProductForSeller,
  getProductForSellerByName,
  getProductForSellerById,
} = product;

const authorize = require("../utils/passportConfig").authenticate("jwt", {
  session: false,
});

const router = express.Router();

// Not Authenicate
router.get("/api/product", getProduct);
router.get("/api/product/:slug", getProductByName);

router.post("/api/manage/product/add", authorize, addProduct);
router.patch("/api/manage/product/edit/:id", authorize, editProduct);
router.delete("/api/manage/product/delete/:id", authorize, removeProduct);

// For Seller
router.get("/api/manage/product", authorize, getProductForSeller);
router.get("/api/manage/product/:id", authorize, getProductForSellerByName);
router.get(
  "/api/manage/productbyId/:productId",
  authorize,
  getProductForSellerById
);

module.exports = router;
