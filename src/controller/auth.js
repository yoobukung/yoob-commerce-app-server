const User = require("../models/User");
const Cart = require("../models/Cart");
const bcrypt = require("bcryptjs");
const passport = require("../utils/passportConfig");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const randomnumber = Math.random();
  const iduser = randomnumber.toFixed(7).toString().split(".", 2);
  const sendId = Number(iduser[1]);
  const findData = await User.findAll({ where: { id: iduser } });
  let role;
  if (username == "admin000") role = "admin";
  else role = "user";

  if (findData.id === iduser) {
    return res.send("กรุณาลองใหม่อีกครั้ง");
  }

  try {
    const hashPasword = await bcrypt.hash(password, 5);
    const user = await User.create({
      id: sendId,
      username,
      email,
      password: hashPasword,
      role,
    });
    const cart = await Cart.create({ userId: sendId });
    res.status(201).json({ user, cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "การสมัครสมาชิกไม่ถูกต้องกรุณาติดต่อผู้ดูแล", error });
  }
};

exports.loginLocal = async (req, res, next) => {
  passport.authenticate(
    "SignUpLogin",
    { session: false },
    (err, user, info) => {
      if (err) return res.status(500).json(info);
      if (user) {
        req.logIn(user, async (err) => {
          try {
            const token = await jwt.sign(
              { user: user.username, date: Date.now() },
              process.env.JWT_SECRET
            );

            await User.update(
              { token },
              {
                where: { id: user.id },
              }
            );

            res.status(201).json({ token, role: user.role });
          } catch (err) {
            return res.status(500).json(err);
          }
        });
      } else {
        return res.status(422).json(info);
      }
    }
  )(req, res, next);
};

exports.getProfile = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.logout = async (req, res, next) => {
  const { token } = req.body;
  try {
    const update = await User.update({ token: null }, { where: { token } });
    if (update.token === null) return res.status(200).json(null);
    else return res.status(200).json(update);
  } catch (error) {
    res.status(500).json(error);
  }
};

// exports.resetPassword = async (req, res, next) => {
//   const { email } = req.body;
//   const token = jwt.sign("resetPassword", "With_password");
//   const emailData = {
//     from: "givedatazero@gmail.com",
//     to: email,
//     subject: "Password Reset Instructions",
//     text: `Please use the following link to reset your password:
//     http://localhost:8000/reset-password/${token}`,
//     html: `<p>Please use the following link to reset your password:</p>
//     <p>http://localhost:8000/reset-password/${token}</p>
//     `,
//   };
//   try {
//     sendEmail(emailData);
//     return res.status(201).json({ message: `Email has been sent to ${email}` });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };
