const express = require("express");
const cors = require("cors");
const mongoDb = require("./mongoDb");
const productRouter = require("./router/productRouter");
const reviewsRouter = require("./router/reviewsRouter");
const newsRouter = require("./router/newsRouter");
const ordersRouter = require("./router/ordersRouter");
const usersRouter = require("./router/usersRouter");
const menuRouter = require("./router/MenusRouter");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//mongodb
const client = mongoDb();

//all router here
async function run() {
    try {
        await client.connect();

        //products part
        app.use("/products", productRouter);

        //reviews part
        app.use("/reviews", reviewsRouter);

        //news part
        app.use("/news", newsRouter);

        //orders part
        app.use("/orders", ordersRouter);

        //users part
        app.use("/users", usersRouter);

        //menus
        app.use("/menus", menuRouter);
    }
    finally {

    }
};
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("it is runnig")
});
app.listen(port, () => {
    console.log("server runnig")
});
