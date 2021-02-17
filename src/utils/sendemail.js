const nodemailer = require("nodemailer");

// exports.sendEmail = (emailData) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     requireTLS: true,
//     auth: {
//       user: "givedatazero@gmail.com", // generated ethereal user
//       pass: "datazero00", // generated ethereal password
//     },
//   });
//   return transporter
//     .sendMail(emailData)
//     .then((info) => console.log(`Message send info${info.response}`))
//     .catch((error) => console.log(`Message sending email: ${error}`));
// };
