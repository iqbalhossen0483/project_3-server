const express = require("express");
const mongoDb = require("../mongoDb");
const { ObjectId } = require("mongodb");


const client = mongoDb();
const menuRouter = express.Router();

const menus = async () => {
    try {
        await client.connect();
        const database = client.db("cycle-mart");
        const categoryMenus = database.collection("product-category-menus");

        menuRouter.post("/", async (req, res) => {
            const result = await categoryMenus.insertOne(req.body);
            res.send(result);
        });
        menuRouter.get("/", async (req, res) => {
            const result = await categoryMenus.find({}).toArray();
            res.send(result);
        });
        menuRouter.delete("/:id", async (req, res) => {
            const id = req.params.id;
            const result = await categoryMenus.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        })
    }
    finally {

    }
}
menus();

module.exports = menuRouter;