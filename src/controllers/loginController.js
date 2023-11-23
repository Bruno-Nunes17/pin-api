const Login = require("../models/LoginModel");

exports.register = async (req, res) => {
  const login = new Login(req.body);
  await login.register();
  if (login.error.length > 0) {
    res.status(400).json({ error: [...login.error] });
    return;
  }
  const { user, token } = login;
  res.status(200).json({ user, token });
};

exports.login = async (req, res) => {
  const login = new Login(req.body);
  await login.login();
  if (login.error.length > 0) {
    res.status(400).json({ error: [...login.error] });
    return;
  }
  const user = login.user._doc;
  const { token } = login;
  res.status(200).json({ user, token });
};
