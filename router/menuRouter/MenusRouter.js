const { postMenu, getMenu, deleteMenu, updateMenu, deleteSubCategory } = require("./handler");
const checkUser = require("../../middleWare/userMiddleware");
const express = require("express");


const menuRouter = express.Router();


menuRouter.post("/", checkUser, postMenu);

menuRouter.get("/", getMenu);

menuRouter.put("/:id", updateMenu);

menuRouter.delete("/:id", checkUser, deleteMenu);

menuRouter.put("/", deleteSubCategory);

module.exports = menuRouter;