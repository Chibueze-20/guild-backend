const User = require("../models/User");

module.exports.index = async (req, res) => {
  try {
    const users = await User.find({ is_deleted: false });
    let user_data = [];
    if (users) {
      for (const user of users) {
        const result = user.toJSON();
        delete result.password;
        delete result.__v;
        user_data.push(result);
      }
      return res.status(200).send({
        message: { success: "Users retrieved successfully" },
        data: { user_data },
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "There was a problem, please try again later.",
    });
  }
};

module.exports.store = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });
    const user_data = user.toJSON();
    delete user_data.password;
    delete user_data.__v;
    return res.status(201).send({
      message: { success: "User created successfully" },
      data: { user_data },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "There was a problem, please try again later.",
    });
  }
};

module.exports.show = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({ _id: id, is_deleted: false });
    const user_data = user.toJSON();
    delete user_data.password;
    delete user_data.__v;
    return res.status(200).send({
      message: { success: "User retrieved successfully" },
      data: { user_data },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "There was a problem, please try again later.",
    });
  }
};

module.exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    await User.findOneAndUpdate({ _id: id }, req.body);
    return res.status(200).send({
      message: { success: "User updated successfully" },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "There was a problem, please try again later.",
    });
  }
};

module.exports.update_password = async (req, res) => {
  const id = req.params.id;
  try {
    await User.findOneAndUpdate(
      { _id: id },
      { password: req.body.new_password }
    );
    return res.status(200).send({
      message: { success: "User password updated successfully" },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "There was a problem, please try again later.",
    });
  }
};

module.exports.destroy = async (req, res) => {
  const id = req.params.id;
  try {
    await User.findOneAndUpdate({ _id: id }, { is_deleted: true });
    return res.status(200).send({
      message: { success: "User deleted successfully" },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "There was a problem, please try again later.",
    });
  }
};
