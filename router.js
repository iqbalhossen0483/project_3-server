const { ObjectId } = require('mongodb');
async function run(client, app) {
    try {
        await client.connect();
        const database = client.db("cycle-mart");
        const products = database.collection("products");
        const reviews = database.collection("reviews");
        const news = database.collection("news");
        const orders = database.collection("orders");
        const users = database.collection("users");
        app.post("/products", async (req, res) => {
            const result = await products.insertOne(req.body);
            res.json(result);
        });
        app.get("/products", async (req, res) => {
            const result = await products.find({}).toArray();
            res.send(result)
        });
        app.get("/products/home", async (req, res) => {
            const result = await products.find({}).limit(8).toArray();
            res.send(result)
        });
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) };
            const result = await products.findOne(quary);
            res.send(result);
        });
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

        app.post("/reviews", async (req, res) => {
            const result = await reviews.insertOne(req.body);
            res.json(result);
        });
        app.get("/reviews", async (req, res) => {
            const result = await reviews.find({}).toArray();
            res.send(result);
        });

        app.post("/news", async (req, res) => {
            const result = await news.insertOne(req.body);
            res.json(result)
        });
        app.get("/news", async (req, res) => {
            const result = await news.find({}).toArray();
            res.send(result);
        });

        app.post("/orders", async (req, res) => {
            const result = await orders.insertOne(req.body);
            res.json(result);
        });
        app.get("/orders", async (req, res) => {
            const result = await orders.find({}).toArray();
            res.send(result)
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
            console.log(cart);
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