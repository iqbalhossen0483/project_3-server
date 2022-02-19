const uploadeImages = require("../../middleWare/cloudinary/upload/uploadImages")
const multer = require("../../middleWare/multer/multer");
const { postSlider, getSlider, deleteSlider } = require("./handler");
const express = require("express");
const checkUser = require("../../middleWare/userMiddleware");

const sliderRouter = express.Router();

//post slider
sliderRouter.post("/",
    checkUser,
    multer.single("image"),
    uploadeImages("cycle-mart/images", 640, 1436),
    postSlider
);

//get slider
sliderRouter.get("/", getSlider);

//delete slider
sliderRouter.delete("/:id",
    checkUser,
    deleteSlider
);

module.exports = sliderRouter;