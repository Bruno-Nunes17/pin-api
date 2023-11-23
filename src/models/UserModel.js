const mongoose = require("mongoose");

const verifyKeys = ["userName", "email"];

const FolderSchema = new mongoose.Schema({
  name: { type: String, require: true },
  pins: [],
});
const UserSchema = new mongoose.Schema({
  userName: { type: String, require: true },
  email: { type: String, require: true },
  folders: [FolderSchema],
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

  async createFolder() {
    this.cleanUp();
    const user = await UserModel.findOne({ email: this.body.email });
    await this.folderExistis(user.folders, this.body.folders[0].name);
    if (this.error.length > 0) return;
    user.folders.push(...this.body.folders);
    await UserModel.findOneAndUpdate({ _id: user._id }, user);
    this.user = await UserModel.findById({ _id: user._id });
  }

  async userExists() {
    const user = await UserModel.findOne({ email: this.body.email });
    if (user) {
      this.error.push("O usuario já existe");
    }
  }

  async folderExistis(folders, folderName) {
    for (const folder of folders) {
      if (folder.name === folderName) {
        this.error.push("A pasta já existe");
      }
    }
  }

  cleanUp() {
    for (const key in verifyKeys) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }
    this.body = {
      userName: this.body.userName,
      email: this.body.userEmail,
      folders: [this.body.folder],
    };
  }
}

module.exports = User;
