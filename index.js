const express = require("express");
const cors = require("cors");
const router = require("./router");
const { MongoClient, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.wewoq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//all router here
router(client, app).catch(console.dir);


app.get("/", (req, res) => {
    res.send("it is runnig")
})
app.listen(port, () => {
    console.log("server runnig")
})
