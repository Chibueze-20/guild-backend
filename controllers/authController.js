const User = require("../models/User");
const Token = require("../models/Token");
const PasswordReset = require("../models/PasswordReset");
const jwt = require("jsonwebtoken");
const randomString = require("randomstring");
const { differenceInMinutes } = require("date-fns");
require("dotenv").config();
const EmailService = require('../Services/EmailService');

//handle errors
const handleErrors = (err) => {
  let errors = {};

  //login errors
  if (err.message === "Incorrect email") {
    errors.email = "Incorrect email";
    return errors;
  }
  if (err.message === "Incorrect password") {
    errors.email = "Incorrect password";
    return errors;
  }

  //duplicate error code
  if ((err.code = 11000)) {
    if (err.message.includes("username")) {
      errors.username = "Username already in use";
    }
    if (err.message.includes("email")) {
      errors.email = "Email already in use";
    }
    return errors;
  }

  //validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.GUILD_API_SECRET, { expiresIn: "1y" });
};

module.exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
    await Token.create({ token: token });
    const user_data = user.toJSON();
    delete user_data.password;
    delete user_data.__v;
    res.status(201).json({ user_data, token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    await Token.create({ token: token });
    res.status(200).json({ user, token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout = async (req, res) => {
  try {
    await Token.revokeTokens(req.body.token);
    res.status(200).send({
      status: "success",
      message: "Logout successful",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "There was a problem, please try again later.",
    });
  }
};

module.exports.send_reset_link = async (req, res) => {
  const { email } = req.body;
  const url = process.env.WEB_URL;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "There is no user with this email address",
      });
    }
    await PasswordReset.findOneAndUpdate({ email: email, is_deleted: false }, { is_deleted: true });
    const { token } = await PasswordReset.create({ email: user.email, token: randomString.generate(40), date_created: new Date() });
    const data = {
      email: user.email,
      subject: "Password Reset",
      url: url,
      token: token
    }
    await EmailService("reset-password", data)
    res.status(200).send({
      status: "success",
      message: "Password reset email sent successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "There was a problem, please try again later.",
    });
  }
};

module.exports.reset_password = async (req, res) => {
  const { new_password, token } = req.body;
  try {
    if (!new_password || !token) {
      return res.status(403).send({
        status: "error",
        message: "Please provide new password or token",
      });
    }
    const password_reset = await PasswordReset.findOne({ token: token, is_deleted: false });
    if (!password_reset) {
      return res.status(403).send({
        status: "error",
        message: "Invalid token",
      });
    }
    const minutes_diff = differenceInMinutes(new Date(), new Date(password_reset.date_created));
    if (minutes_diff > 10) {
      return res.status(403).send({
        status: "error",
        message: "Token expired",
      });
    }
    await User.findOneAndUpdate({ email: password_reset.email }, { password: new_password });
    return res.status(200).send({
      status: "success",
      message: "User password reset successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "There was a problem, please try again later.",
    });
  }
}
