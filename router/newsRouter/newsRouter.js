const uploadeImages = require("../../middleWare/cloudinary/upload/uploadImages")
const checkUser = require("../../middleWare/userMiddleware");
const multer = require("../../middleWare/multer/multer");
const { postNews, getNews } = require("./handler");
const express = require("express");


const newsRouter = express.Router();

newsRouter.post("/",
    checkUser,
    multer.single("img"),
    uploadeImages("cycle-mart/news", 436, 640),
    postNews
);
        
newsRouter.get("/", getNews);
        
module.exports = newsRouter;