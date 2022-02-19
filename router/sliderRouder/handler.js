const { ObjectId } = require("mongodb");
const mongoDb = require("../../mongoDb");

const client = mongoDb();

//connect to database
async function connectDb() {
    await client.connect();
};

connectDb();
const database = client.db("cycle-mart");
const sliders = database.collection("slider");

//post slider
async function postSlider(req, res) {
    const result = await sliders.insertOne(req.body);
    res.send(result);
};

//get slider
async function getSlider(req, res) {
    const result = await sliders.find({}).toArray();
    res.send(result);
}

//delete
async function deleteSlider(req, res) {
    const query = { _id: ObjectId(req.params.id) };
    const result = await sliders.deleteOne(query);
    res.send(result);
}

module.exports = {
    postSlider,
    getSlider,
    deleteSlider
}