const express = require("express");
const checkUser = require("../../middleWare/userMiddleware");
const { postMenu, getMenu, deleteMenu } = require("./handler");


const menuRouter = express.Router();


menuRouter.post("/", checkUser, postMenu);

menuRouter.get("/", getMenu);

menuRouter.delete("/:id", checkUser, deleteMenu);

module.exports = menuRouter;