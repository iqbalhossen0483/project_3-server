const express = require("express");
const mongoDb = require("../mongoDb");


const reviewsRouter = express.Router();
const client = mongoDb();

async function reviews() {
    try {
        await client.connect();
        const database = client.db("cycle-mart");
        const reviews = database.collection("reviews");
        reviewsRouter.post("/reviews", async (req, res) => {
            const result = await reviews.insertOne(req.body);
            res.json(result);
        });
        reviewsRouter.get("/", async (req, res) => {
            const result = await reviews.find({}).toArray();
            res.send(result);
        });
        reviewsRouter.get("/:email", async (req, res) => {
            const email = req.params.email;
            const quary = { email: email };
            const result = await reviews.find(quary).toArray();
            res.send(result);
        })
    }
    finally {

    }
};
reviews();
module.exports = reviewsRouter;