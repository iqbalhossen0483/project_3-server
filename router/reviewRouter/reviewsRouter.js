const { postReview, getReview, getReviewByuser } = require("./handler");
const checkUser = require("../../middleWare/userMiddleware");
const express = require("express");


const reviewsRouter = express.Router();

//post review
reviewsRouter.post("/", checkUser, postReview);

//get review
reviewsRouter.get("/", getReview);

//get review by user
reviewsRouter.get("/:email", checkUser, getReviewByuser)


module.exports = reviewsRouter;