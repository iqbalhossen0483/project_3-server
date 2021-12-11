const express = require("express");
const mongoDb = require("../mongoDb");
const ObjectId = require('mongodb').ObjectId;


const ordersRouter = express.Router();
const client = mongoDb();

async function orders() {
    try {
        await client.connect();
        const database = client.db("cycle-mart");
        const orders = database.collection("orders");

        ordersRouter.post("/", async (req, res) => {
            const result = await orders.insertOne(req.body);
            res.json(result);
        });
        ordersRouter.get("/", async (req, res) => {
            const result = await orders.find({}).toArray();
            res.send(result);
        });
        ordersRouter.get("/:email", async (req, res) => {
            const email = req.params.email;
            const quary = { email: email };
            const result = await orders.find(quary).toArray();
            res.send(result);
        });
        ordersRouter.put("/", async (req, res) => {
            const id = req.body.id;
            const filter = { _id: ObjectId(id) };
            const doc = { $set: { status: req.body.status } };
            const result = await orders.updateOne(filter, doc);
            res.json(result);
        });
        ordersRouter.delete("/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await orders.deleteOne(filter);
            res.send(result);
        });
    }
    finally {

    }
};
orders();
module.exports = ordersRouter;