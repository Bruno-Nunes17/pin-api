const express = require("express");
const homeController = require("../controllers/homeController");
const loginController = require("../controllers/loginController");
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/middleware");

const protectedRoutes = express.Router();
const route = express.Router();

protectedRoutes.get("/token", userController.user);

route.get("/", homeController.index);
route.post("/register", loginController.register);
route.post("/login", loginController.login);

route.use(authMiddleware, protectedRoutes);

module.exports = route;
