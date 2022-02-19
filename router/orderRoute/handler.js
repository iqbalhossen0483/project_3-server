const mongoDb = require("../../mongoDb");
const ObjectId = require('mongodb').ObjectId;


const client = mongoDb();

//connect to database
async function connectDb() {
    await client.connect();
}

//set router in database
connectDb();
const database = client.db("cycle-mart");
const orders = database.collection("orders");

//post order
async function postOrder(req, res) {
    const result = await orders.insertOne(req.body);
    res.json(result);
};

//get order
async function getOrders(req, res) {
    const admin = req.admin;
    if (admin) {
        const result = await orders.find({}).toArray();
        res.send(result);
    } else {
        res.status(401).send("You are not allowed to see these");
    }
};

//find by user
async function findOrderByuser(req, res) {
    const email = req.params.email;
    const quary = { email: email };
    const result = await orders.find(quary).toArray();
    res.send(result);
};

//update status of order
async function updateOrder(req, res) {
    const id = req.body.id;
    const filter = { _id: ObjectId(id) };
    const doc = { $set: { status: req.body.status } };
    const result = await orders.updateOne(filter, doc);
    res.json(result);
};

//delete order
async function deleteOrder(req, res) {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const result = await orders.deleteOne(filter);
    res.send(result);
}

module.exports = {
    postOrder,
    getOrders,
    updateOrder,
    deleteOrder,
    findOrderByuser
};