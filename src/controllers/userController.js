// eslint-disable-next-line no-unused-vars
const User = require("../models/UserModel");

exports.user = async (req, res) => {
  const { userName, userEmail } = req;
  const userModel = new User({ userName, userEmail });
  await userModel.create();
  const { error } = userModel;
  if (error.length > 0) {
    res.status(500).json({ error });
    return;
  }
  res.status(200).json(userModel.user);
};

exports.createFolder = async (req, res) => {
  const { userName, userEmail } = req;
  req.body = { folder: req.body, userName, userEmail };
  const userModel = new User(req.body);
  await userModel.createFolder();
  const { error } = userModel;
  if (error.length > 0) {
    res.status(500).json({ error });
    return;
  }
  const { user } = userModel;
  res.status(200).json({ user });
};
