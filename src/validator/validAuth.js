const { body, validationResult } = require("express-validator");

exports.resultvalid = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array()[0].msg });
  }
  next();
};

exports.validateRegister = [
  body("password", "กรอกรหัสอย่างน้อย 8 ตัวอักษร")
    .notEmpty()
    .isLength({ min: 8 }),
  body("username")
    .notEmpty()
    .isLength({ min: 7 })
    .withMessage("ชื่อต้องมากกว่า 6 ตัวอักษร"),
  body("email").notEmpty().isEmail().withMessage("กรุณากรอก email ด้วย"),
];
