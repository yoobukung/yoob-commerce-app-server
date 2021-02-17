const express = require("express");
const router = express.Router();
const authorize = require("../utils/passportConfig").authenticate("jwt", {
  session: false,
});

const {
  FindCategory,
  AddCategory,
  UpdateCategory,
  DeleteCategory,
  FindCategoryById,
} = require("../controller/category");

router.get("/api/category/find", FindCategory);
router.get("/api/category/product/:categoryId", authorize, FindCategoryById);
router.post("/api/category/add", authorize, AddCategory);
router.patch("/api/category/edit/:categoryId", authorize, UpdateCategory);
router.delete("/api/category/delete/:categoryId", authorize, DeleteCategory);

module.exports = router;
