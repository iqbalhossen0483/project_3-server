const express = require("express");
const mongoDb = require("../mongoDb");
const jwt = require('jsonwebtoken');
const checkUser = require("../middleWare/userMiddleware");


const usersRouter = express.Router();
const client = mongoDb();

async function users() {
    try {
        await client.connect();
        const database = client.db("cycle-mart");
        const users = database.collection("users");

        //make a user to database
        usersRouter.put("/", async (req, res) => {
            const filter = { email: req.body.email };
            const user = { $set: req.body };
            const options = { upsert: true };
            const result = await users.updateOne(filter, user, options);
            res.json(result)
        });

        //log in user and get token for browsing
        usersRouter.get("/login/:email", async (req, res) => {
            const filter = { email: req.params.email };
            const user = await users.findOne(filter);
            try {
                if (user?.role === "admin") {
                    const token = jwt.sign({
                        admin: true,
                        user
                    }, process.env.JWT_SECRATE, {
                        expiresIn: "10h"
                    });
                    res.send({
                        admin: true,
                        token: token
                    });
                }
                else if (user.email) {
                    const token = jwt.sign({
                        admin: false,
                        user
                    }, process.env.JWT_SECRATE, {
                        expiresIn: "7d"
                    });
                    res.send({
                        admin: false,
                        token: token
                    });
                }
                else {
                    res.status(401).send({ error: "user is not allowed to do anythings" })
                }
            } catch {
                res.status(401).send({ error: "user is not allowed to do anything" })
            }
        });

        //get user his/her specefic data
        usersRouter.get("/:email", checkUser, async (req, res) => {
            const email = req.params.email;
            const user = req.user;
            if (user.email === email) {
                res.send(user);
            } else {
                res.status(500).send("No user found")
            }
        })

        //user's product collection update
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

        //make admin
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
module.exports = usersRouter