const { body, validationResult } = require("express-validator");

exports.resultvalid = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array()[0].msg });
  }
  next();
};

exports.validateRegister = [
  body("password", "กรอกอย่างน้อย 8 ตัวอักษร").isLength({ min: 8 }),
  body("username").notEmpty().withMessage("กรุณากรอก username ด้วย"),
  body("email").notEmpty().withMessage("กรุณากรอก email ด้วย"),
];
