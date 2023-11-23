const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, require: true },
  email: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model("User", UserSchema);

class User {
  constructor(body) {
    this.body = body;
    this.error = [];
    this.user = null;
  }

  async create() {
    this.cleanUp();
    await this.userExists();
    if (this.error.length > 0) return;
    this.user = await UserModel.create(this.body);
  }

  async userExists() {
    const user = await UserModel.findOne({ email: this.body.email });
    if (user) {
      this.error.push("O usuario já existe");
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
      userName: this.body.userName,
      email: this.body.userEmail,
    };
  }
}

module.exports = User;
