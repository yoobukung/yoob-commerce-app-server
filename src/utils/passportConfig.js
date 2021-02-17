const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  "SignUpLogin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      // passReqToCallback : true
    },
    async (email, password, done) => {
      const user = await User.findOne({ where: { email } });
      if (!user) return done(null, false, { message: "ชื่ออีเมล์ไม่ถูกต้อง" });
      // done(null, user);
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result === true) {
          return done(null, user);
        } else {
          return done(null, false, { message: "รหัสผ่านไม่ถูกต้อง" });
        }
      });
    }
  )
);

passport.use(
  "jwt",
  new JwtStrategy(
    {
      // ตั้งค่า Header ให้มี Key เป็น Authorization และ Value เป็น Bearer <token>
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      // jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findOne({
          where: { username: jwtPayload.user },
        });
        if (user.token === null) {
          return done(error, false, { message: "โปรดเข้าสู่ระบบก่อน" });
        } else return done(null, user);
      } catch (error) {
        done(error, false, { message: "โปรดเข้าสู่ระบบก่อน" });
      }
    }
  )
);

//อยากส่งอะไรไปเก็บใน session
passport.serializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;

// //เอาของที่เก็บใน session มาใช้
// passport.deserializeUser(async (id, done) => {
//   const user = await User.findOne({ where: { id } });
//   const userInformation = user.email;
//   done(err, userInformation);
// });
