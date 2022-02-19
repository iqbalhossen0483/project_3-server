const mongoDb = require("../../mongoDb");


const client = mongoDb();

//connect to database
async function connectDb() {
    await client.connect();
}

connectDb();
const database = client.db("cycle-mart");
const reviews = database.collection("reviews");


//post review
async function postReview(req, res) {
    const result = await reviews.insertOne(req.body);
    res.json(result);
};

//get review
async function getReview(req, res) {
    const result = await reviews.find({}).toArray();
    res.send(result);
};

//get review by user
async function getReviewByuser(req, res) {
    const email = req.params.email;
    const quary = { email: email };
    const result = await reviews.find(quary).toArray();
    res.send(result);
};

module.exports = {
    postReview,
    getReview,
    getReviewByuser
}