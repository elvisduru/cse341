const nodemailer = require("nodemailer");
module.exports = nodemailer.createTransport({
  host: "smtp.yandex.com",
  port: 465,
  secure: true,
  auth: {
    user: "hello@elvisduru.com",
    pass: "ctrityotlbtmiydp",
  },
});
