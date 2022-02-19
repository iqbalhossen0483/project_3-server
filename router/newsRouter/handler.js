const mongoDb = require("../../mongoDb");;
const deleteImage = require("../../middleWare/cloudinary/deleteImage/deleteImage");

const client = mongoDb();

//connect to database
async function connectDb() {
    await client.connect();
}

//database router
connectDb();
const database = client.db("cycle-mart");
const news = database.collection("news");

//post news
async function postNews(req, res){
    try {
        const result = await news.insertOne(req.body);
        res.json(result)
    }
    catch (err) {
        deleteImage(req.imgId);
        res.status(500).json(err);
    }
};

//get news
async function getNews(req, res) {
    const result = await news.find({}).toArray();
    res.send(result);
};

module.exports = { postNews, getNews };
