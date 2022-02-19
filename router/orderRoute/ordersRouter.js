const express = require("express");
const checkUser = require("../../middleWare/userMiddleware");
const {
    postOrder,
    getOrders,
    findOrderByuser,
    updateOrder,
    deleteOrder
} = require("./handler");


const ordersRouter = express.Router();

//post order
ordersRouter.post("/", postOrder);

//get order
ordersRouter.get("/", checkUser, getOrders);

//find by user of order
ordersRouter.get("/:email", checkUser, findOrderByuser);

//update status of order
ordersRouter.put("/", updateOrder);

//delete
ordersRouter.delete("/:id", deleteOrder);

module.exports = ordersRouter;