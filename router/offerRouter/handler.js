const { ObjectId } = require("mongodb");
const mongoDb = require("../../mongoDb");

const client = mongoDb();

//connect to database
async function connectDb() {
    await client.connect();
};

connectDb();
const database = client.db("cycle-mart");
const offers = database.collection("offers");

//post offer
async function postOffer(req, res) {
    const result = await offers.insertOne(req.body);
    res.send(result);
};

//get offers
async function getOffers(req, res) {
    const result = await offers.find({}).toArray();
    res.send(result);
}

//delete offers
async function deleteOffers (req, res) {
    const filter = { _id: ObjectId(req.params.id) };
    const result = await offers.deleteOne(filter);
    res.send(result);
}

module.exports = {
    postOffer,
    getOffers,
    deleteOffers
}
