const express = require("express");
const checkUser = require("../middleWare/userMiddleware");
const mongoDb = require("../mongoDb");
const multer = require("../middleWare/multer/multer");
const uploadeImages = require("../middleWare/cloudinary/upload/uploadImages");


const newsRouter = express.Router();
const client = mongoDb();

async function news() {
    try {
        await client.connect();
        const database = client.db("cycle-mart");
        const news = database.collection("news");

        newsRouter.post("/", checkUser,
            multer.single("img"),
            uploadeImages("cycle-mart/news"),
            async (req, res) => {
                const result = await news.insertOne(req.body);
                res.json(result)
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