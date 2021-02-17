const express = require("express");
const router = express.Router();
const authorize = require("../utils/passportConfig").authenticate("jwt", {
  session: false,
});

const {
  register,
  // finduser,
  loginLocal,
  getProfile,
  logout,
  // resetPassword,
} = require("../controller/auth");
const { validateRegister, resultvalid } = require("../validator/validAuth");

router.post("/api/register", validateRegister, resultvalid, register);
router.post("/api/login/local", loginLocal);
router.get("/api/user/profile", authorize, getProfile);
router.post("/api/logout/local", authorize, logout);
// router.put("/api/password/reset", resetPassword);

module.exports = router;
