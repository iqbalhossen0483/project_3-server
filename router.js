const ObjectId = require('mongodb').ObjectId;
async function run(client, app) {
    try {
        await client.connect();
        const database = client.db("cycle-mart");
        const products = database.collection("products");
        const reviews = database.collection("reviews");
        const news = database.collection("news");
        const orders = database.collection("orders");
        const users = database.collection("users");

        //products part
        app.post("/products", async (req, res) => {
            const result = await products.insertOne(req.body);
            res.json(result);
        });
        //get all products
        app.get("/products", async (req, res) => {
            const result = await products.find({}).toArray();
            res.send(result)
        });
        //products for home page
        app.get("/products/home", async (req, res) => {
            const result = await products.find({}).limit(8).toArray();
            res.send(result)
        });
        // get product by id
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            if (id.startsWith("&&")) {
                const splitId = id.split("&&");
                const sliced = splitId.slice(1, splitId.length);
                const arryOfId = [];
                for (const id of sliced) {
                    arryOfId.push(ObjectId(id));
                }
                const quary = {
                    _id: {
                        $in: arryOfId
                    }
                }
                const result = await products.find(quary).toArray();
                res.send(result);
            }
            else {
                const quary = { _id: ObjectId(id) };
                const result = await products.findOne(quary);
                res.send(result);
            }
        });

        //category product
        app.get("/products/category/:name", async (req, res) => {
            const categoryName = req.params.name;
            const quary = { category: categoryName };
            const result = await products.find(quary).toArray();
            res.send(result);
        })

        //get rendom product
        app.get("/products/rendom/:num", async (req, res) => {
            const number = parseInt(req.params.num);
            const result = await products.find({}).skip(number).limit(1).toArray();
            res.send(result);
        });
        //get product by brand name
        app.get("/products/brand/:brand", async (req, res) => {
            let brandName = [];
            const brand = req.params.brand;
            if (!brand.includes("&&")) {
                brandName = [brand];
            }
            else {
                const brands = brand.split("&&");
                brandName = brands;
            };
            const quary = {
                vendor: {
                    $in: brandName
                }
            };
            const result = await products.find(quary).toArray();
            res.send(result);
        })
        //get product by type
        app.get("/products/type/:type", async (req, res) => {
            let typeName = [];
            const type = req.params.type;
            if (!type.includes("&&")) {
                typeName = [type];
            }
            else {
                const types = type.split("&&");
                typeName = types;
            };
            const quary = {
                type: {
                    $in: typeName
                }
            };
            const result = await products.find(quary).toArray();
            res.send(result);
        });
        //product by price range
        app.get("/productsByPrice", async (req, res) => {
            const from = req.query.from;
            const till = req.query.till;
            const quary = {
                price: { $gte: from },
                price: { $lt: till }
            };
            const result = await products.find(quary).toArray();
            res.send(result);
        })
        app.put("/products", async (req, res) => {
            const id = req.body.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = { $set: req.body }
            const result = await products.updateOne(filter, updateDoc);
            res.json(result);
        });
        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await products.deleteOne(filter);
            res.send(result);
        });


        //reviews part
        app.post("/reviews", async (req, res) => {
            const result = await reviews.insertOne(req.body);
            res.json(result);
        });
        app.get("/reviews", async (req, res) => {
            const result = await reviews.find({}).toArray();
            res.send(result);
        });
        app.get("/reviews/:email", async (req, res) => {
            const email = req.params.email;
            const quary = { email: email };
            const result = await reviews.find(quary).toArray();
            res.send(result);
        })


        //news part
        app.post("/news", async (req, res) => {
            const result = await news.insertOne(req.body);
            res.json(result)
        });
        app.get("/news", async (req, res) => {
            const result = await news.find({}).toArray();
            res.send(result);
        });


        //orders part
        app.post("/orders", async (req, res) => {
            const result = await orders.insertOne(req.body);
            res.json(result);
        });
        app.get("/orders", async (req, res) => {
            const result = await orders.find({}).toArray();
            res.send(result);
        });
        app.get("/orders/:email", async (req, res) => {
            const email = req.params.email;
            const quary = { email: email };
            const result = await orders.find(quary).toArray();
            res.send(result);
        });
        app.put("/orders", async (req, res) => {
            const id = req.body.id;
            const filter = { _id: ObjectId(id) };
            const doc = { $set: { status: req.body.status } };
            const result = await orders.updateOne(filter, doc);
            res.json(result);
        });
        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await orders.deleteOne(filter);
            res.send(result);
        });


        //users part
        app.put("/users", async (req, res) => {
            const filter = { email: req.body.email };
            const user = { $set: req.body };
            const options = { upsert: true };
            const result = await users.updateOne(filter, user, options);
            res.json(result)
        });
        app.put("/admin", async (req, res) => {
            const filter = { email: req.body.email };
            const update = {
                $set: {
                    roll: "admin"
                }
            };
            const result = await users.updateOne(filter, update);
            res.json(result);
        });
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const result = await users.findOne(filter);
            res.send(result);
        });
        app.put("/users/carts/:email", async (req, res) => {
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
    }
    finally {

    }
}

module.exports = run;