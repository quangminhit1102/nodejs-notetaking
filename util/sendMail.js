const nodemailer = require("nodemailer");
require("dotenv").config(); // .Env config
exports.sendMail = (mailTo, subject, body) => {
  var transporter = nodemailer.createTransport({
    // config mail server
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL, //Tài khoản gmail vừa tạo
      pass: process.env.PASSWORD, //Mật khẩu tài khoản gmail vừa tạo
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  var mainOptions = {
    from: "Note Taking App",
    to: mailTo,
    subject: subject,
    html: body,
  };
  return transporter.sendMail(mainOptions);
};
