const nodemailer = require("nodemailer");
require("dotenv").config(); // .Env config
exports.sendMail = async (mailTo, subject, body) => {
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
    from: "Hello",
    to: mailTo,
    subject: "Test Nodemailer",
    html: "hello",
  };
  transporter.sendMail(mainOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: " + info.response);
    }
  });
};
