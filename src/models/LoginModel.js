const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const LoginSchema = new mongoose.Schema({
  name: { type: String, require: true },
  lastName: { type: String, require: true },
  userName: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.error = [];
    this.user = null;
    this.token = null;
  }

  async login() {
    this.loginValidate();
    if (this.error.length > 0) return;

    this.user = await LoginModel.findOne({ email: this.body.email });
    if (!this.user) {
      this.error.push("E-mail ou senha invalidos");
      return;
    }
    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.error.push("Senha Inválida");
      this.user = null;
      return;
    }
    this.token = this.tokenGenerator(this.user);
  }

  async register() {
    this.registerValidate();
    if (this.error.length > 0) return;

    await this.userExists();

    if (this.error.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);

    this.token = this.tokenGenerator(this.user);
  }

  async userExists() {
    const userEmail = await LoginModel.findOne({ email: this.body.email });
    if (userEmail) {
      this.error.push("O E-mail já esta cadastrado");
      return;
    }
    const userNickname = await LoginModel.findOne({
      userName: this.body.userName,
    });
    if (userNickname) this.error.push("Nome de usuário já está em uso");
  }

  tokenGenerator(user) {
    const { email, userName } = user;
    const token = jwt.sign({ email, userName }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    return token;
  }

  loginValidate() {
    this.cleanUp();
    if (!validator.isEmail(this.body.email)) {
      this.error.push("E-mail invalido");
    }
  }

  registerValidate() {
    this.cleanUp();
    if (!validator.isEmail(this.body.email)) {
      this.error.push("E-mail invalido");
    }
    if (this.body.password.length < 8 || this.body.password.length > 20) {
      this.error.push("A senha precisa ter entre 8 e 20 caracteres");
    }
  }

  cleanUp() {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }
    this.body = {
      name: this.body.name,
      lastName: this.body.lastName,
      userName: this.body.userName,
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;
