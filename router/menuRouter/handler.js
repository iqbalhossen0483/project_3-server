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

//update menu
async function updateMenu(req, res, next) {
    try {
        const filter = { _id: ObjectId(req.params.id) };
        const docs = { $push: { subMenus: req.body.name } };
        const result = await categoryMenus.updateOne(filter, docs);
        res.send(result);
    }
    catch (err) {
        next(err);
    }
};

//delete menu handler
async function deleteMenu (req, res) {
    const id = req.params.id;
    const result = await categoryMenus.deleteOne({ _id: ObjectId(id) });
    res.send(result);
};

async function deleteSubCategory(req, res) {
    const filter1 = { _id: ObjectId(req.body.menuId) };
    const filter2 = { $pullAll: { subMenus: [req.body.subText] } };
    try {
        const result = await categoryMenus.updateOne(filter1, filter2);
        res.send(result);
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    postMenu,
    getMenu,
    deleteMenu,
    updateMenu,
    deleteSubCategory
};