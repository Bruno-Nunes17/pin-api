const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleware = (req, res, next) => {
  try {
    const secret = process.env.TOKEN_SECRET;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ erro: "Acesso negado!" });
      return;
    }

    const dados = jwt.verify(token, secret);
    const { userName, email } = dados;
    req.userName = userName;
    req.userEmail = email;
    next();
  } catch (error) {
    res.status(400).json({ erro: "O Token é inválido!" });
  }
};
