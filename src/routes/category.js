const express = require("express");
const router = express.Router();
const authorize = require("../utils/passportConfig").authenticate("jwt", {
  session: false,
});
const { category } = require("../controller");
const {
  getCategory,
  getCategoryById,
  AddCategory,
  UpdateCategory,
  removeCategory,
} = category;

router.get("/api/category/find", getCategory);
router.get("/api/category/product/:categoryId", authorize, getCategoryById);
router.post("/api/category/add", authorize, AddCategory);
router.patch("/api/category/edit/:categoryId", authorize, UpdateCategory);
router.delete("/api/category/delete/:categoryId", authorize, removeCategory);

module.exports = router;
