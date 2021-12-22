const express = require("express");
const mongoDb = require("../mongoDb");
const ObjectId = require('mongodb').ObjectId;
const checkUser = require("../middleWare/userMiddleware")


const ordersRouter = express.Router();
const client = mongoDb();

async function orders() {
    try {
        await client.connect();
        const database = client.db("cycle-mart");
        const orders = database.collection("orders");

        //post
        ordersRouter.post("/", async (req, res) => {
            const result = await orders.insertOne(req.body);
            res.json(result);
        });

        //get
        ordersRouter.get("/", checkUser, async (req, res) => {
            const admin = req.admin;
            if (admin) {
                const result = await orders.find({}).toArray();
                res.send(result);
            } else {
                res.status(401).send("You are not allowed to see these");
            }
        });

        //find by user
        ordersRouter.get("/:email", checkUser, async (req, res) => {
            const email = req.params.email;
            const quary = { email: email };
            const result = await orders.find(quary).toArray();
            res.send(result);
        });

        //update status
        ordersRouter.put("/", async (req, res) => {
            const id = req.body.id;
            const filter = { _id: ObjectId(id) };
            const doc = { $set: { status: req.body.status } };
            const result = await orders.updateOne(filter, doc);
            res.json(result);
        });

        //delete
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