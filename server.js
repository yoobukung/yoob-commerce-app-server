const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const helmet = require("helmet");
const passport = require("./src/utils/passportConfig");

// Import Config
const sequelize = require("./src/utils/database");

const app = express();
const port = process.env.PORT || 8000;

// Import Router
const orderRouter = require("./src/routes/order");
const authRouter = require("./src/routes/auth");
const categoryRouter = require("./src/routes/category");
const cartRouter = require("./src/routes/cart");
const productRouter = require("./src/routes/product");
const { get404 } = require("./src/controller/error404");

// Middleware
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true, limit: "8mb" }));
app.use(express.json({ limit: "8mb" }));
app.use(logger("dev"));
app.use(cookieParser());
app.use(passport.initialize());
app.use(
  cors({
    origin: process.env.URL_CLIENT,
  })
);

// Router
app.use(authRouter);
app.use(productRouter);
app.use(categoryRouter);
app.use(cartRouter);
app.use(orderRouter);

app.use(get404);

// Connect
sequelize.sync({ alter: true });
app.listen(port, () => console.log(`server is on port ${port}`));

// Export สำหรับการ test
module.exports = app;
