const express = require("express");
const checkUser = require("../middleWare/userMiddleware");
const mongoDb = require("../mongoDb");
const multer = require("../middleWare/multer/multer");
const uploadeImages = require("../middleWare/cloudinary/upload/uploadImages");
const deleteImage = require("../middleWare/cloudinary/deleteImage/deleteImage");


const newsRouter = express.Router();
const client = mongoDb();

async function news() {
    try {
        await client.connect();
        const database = client.db("cycle-mart");
        const news = database.collection("news");

        newsRouter.post("/",
            checkUser,
            multer.single("img"),
            uploadeImages("cycle-mart/news"),
            async (req, res) => {
                try {
                    // res.status(500).json({ err: "there was an server side error" });
                    // throw new Error({ err: "there was an server side error" });
                    const result = await news.insertOne(req.body);
                    res.json(result)
                }
                catch (err) {
                    deleteImage(req.imgId);
                    res.status(500).json(err);
                }
            });
        
        newsRouter.get("/", async (req, res) => {
            const result = await news.find({}).toArray();
            res.send(result);
        });
    }
    finally {

    }
};
news();
module.exports = newsRouter;