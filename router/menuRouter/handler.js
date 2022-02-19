const mongoDb = require("../../mongoDb");
const { ObjectId } = require("mongodb");


const client = mongoDb();

//connect to database
async function connectDb() {
    await client.connect();
}

//set database router
connectDb();
const database = client.db("cycle-mart");
const categoryMenus = database.collection("product-category-menus");

//post menu handler
async function postMenu(req, res) {
    const result = await categoryMenus.insertOne(req.body);
    res.send(result);
}

//get menu handler
async function getMenu  (req, res) {
    const result = await categoryMenus.find({}).toArray();
    res.send(result);
};

//delete menu handler
async function deleteMenu (req, res) {
    const id = req.params.id;
    const result = await categoryMenus.deleteOne({ _id: ObjectId(id) });
    res.send(result);
};

module.exports = { postMenu, getMenu, deleteMenu };