const express = require("express");
const {
  findProduct,
  findProductByName,
  AddProduct,
  EditProduct,
  RemoveProduct,
  ProductForSeller,
  ProductForSellerByName,
  ProductForSellerById,
} = require("../controller/product");

const authorize = require("../utils/passportConfig").authenticate("jwt", {
  session: false,
});

const router = express.Router();

// Not Authenicate
router.get("/api/product", findProduct);
router.get("/api/product/:slug", findProductByName);

// For Seller
router.get("/api/manage/product", authorize, ProductForSeller);
router.get("/api/manage/product/:id", authorize, ProductForSellerByName);
router.get(
  "/api/manage/productbyId/:productId",
  authorize,
  ProductForSellerById
);

router.post("/api/manage/product/add", authorize, AddProduct);
router.patch("/api/manage/product/edit/:id", authorize, EditProduct);
router.delete("/api/manage/product/delete/:id", authorize, RemoveProduct);

module.exports = router;
