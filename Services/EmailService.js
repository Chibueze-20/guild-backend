const handlebars = require("handlebars");
const { promisify } = require("util");
const fs = require("fs");
const nodemailer = require("nodemailer");
require("dotenv").config();

const EmailService = async (emailTemplate, data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });
  const readFile = promisify(fs.readFile);
  const html = await readFile(`./emails/${emailTemplate}.html`, "utf8");
  const template = handlebars.compile(html);
  const htmlToSend = template(data);
  await transporter.sendMail({
    from: `Crunch Guild <crunch.guild@gmail.com>`,
    to: "okedelep@gmail.com",
    subject: data.subject,
    html: htmlToSend,
  });
};

module.exports = EmailService;
