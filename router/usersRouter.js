const express = require("express");
const mongoDb = require("../mongoDb");


const usersRouter = express.Router();
const client = mongoDb();

async function users() {
    try {
        await client.connect();
        const database = client.db("cycle-mart");
        const users = database.collection("users");

        usersRouter.put("/", async (req, res) => {
            const filter = { email: req.body.email };
            const user = { $set: req.body };
            const options = { upsert: true };
            const result = await users.updateOne(filter, user, options);
            res.json(result)
        });

        usersRouter.get("/:email", async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const result = await users.findOne(filter);
            res.send(result);
        });
        usersRouter.put("/carts/:email", async (req, res) => {
            const email = req.params.email;
            const cart = req.body;
            const filter = { email: email };
            const doc = {
                $set: {
                    cart: cart
                }
            }
            const option = { upsert: true };
            const result = await users.updateOne(filter, doc, option);
            res.json(result);
        });

        usersRouter.put("/admin", async (req, res) => {
            const filter = { email: req.body.email };
            const update = {
                $set: {
                    roll: "admin"
                }
            };
            const result = await users.updateOne(filter, update);
            res.json(result);
        });
    }
    finally {

    }
};
users();
module.exports = usersRouter;