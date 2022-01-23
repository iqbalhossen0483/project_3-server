const express = require("express");
const mongoDb = require("../mongoDb");
const ObjectId = require('mongodb').ObjectId;
const multer = require("../middleWare/multer/multer");
const checkUser = require("../middleWare/userMiddleware");
const deleteImage = require("../middleWare/cloudinary/deleteImage/deleteImage");
const productImgUpload = require("../middleWare/cloudinary/upload/productImgUpload");

const productRouter = express.Router();
const client = mongoDb();

async function products() {
    try {
        await client.connect();
        const database = client.db("cycle-mart");
        const products = database.collection("products");

        productRouter.route("/")
            .get(async (req, res) => {
                const result = await products.find({}).toArray();
                res.send(result)
            })
            .post(checkUser,
                multer.single("img"),
                productImgUpload,
                (req, res) => {
                    delete req.body.img;

                    products.insertOne(req.body)
                        .then(result => res.send(result))
                        .catch(err => {
                            deleteImage(req.body.imgId);
                            res.send(err)
                        })
            })
            .put(checkUser,
                multer.single("img"),
                productImgUpload,
                async (req, res) => {
                    if (req.body.existImg) {
                        deleteImage(req.body.existImg);
                    }
                    const id = req.body.id;
                    delete req.body.id;
                    delete req.body.existImg;
                    const filter = { _id: ObjectId(id) };
                    const updateDoc = req.body ;
                    const result = await products.replaceOne(filter, updateDoc);
                    res.send(result);
                })

        //products for home page
        productRouter.get("/home", async (req, res) => {
            const result = await products.find({}).limit(8).toArray();
            res.send(result)
        });


        //category product
        productRouter.get("/category/:name", async (req, res) => {
            const categoryName = req.params.name;
            const quary = { category: categoryName };
            const result = await products.find(quary).toArray();
            res.send(result);
        })

        //get rendom product
        productRouter.get("/rendom/:num", async (req, res) => {
            const number = parseInt(req.params.num);
            const result = await products.find({}).skip(number).limit(1).toArray();
            res.send(result);
        });
        //get product by brand name
        productRouter.get("/brand/:brand", async (req, res) => {
            let brandName = [];
            const brand = req.params.brand;
            if (!brand.includes("&&")) {
                brandName = [brand];
            }
            else {
                const brands = brand.split("&&");
                brandName = brands;
            };
            const quary = {
                vendor: {
                    $in: brandName
                }
            };
            const result = await products.find(quary).toArray();
            res.send(result);
        })
        //get product by type
        productRouter.get("/type/:type", async (req, res) => {
            let typeName = [];
            const type = req.params.type;
            if (!type.includes("&&")) {
                typeName = [type];
            }
            else {
                const types = type.split("&&");
                typeName = types;
            };
            const quary = {
                type: {
                    $in: typeName
                }
            };
            const result = await products.find(quary).toArray();
            res.send(result);
        });

        //product by price range
        productRouter.get("/price/byrange", async (req, res) => {
            const from = req.query.from;
            const till = req.query.till;
            const quary = {
                price: { $gte: from },
                price: { $lt: till }
            };
            const result = await products.find(quary).toArray();
            res.send(result);
        })

        // get product by id
        productRouter.get("/:id", async (req, res) => {
            const id = req.params.id;
            if (id.startsWith("&&")) {
                const splitId = id.split("&&");
                const sliced = splitId.slice(1, splitId.length);
                const arryOfId = [];
                for (const id of sliced) {
                    arryOfId.push(ObjectId(id));
                }
                const quary = {
                    _id: {
                        $in: arryOfId
                    }
                }
                const result = await products.find(quary).toArray();
                res.send(result);
            }
            else {
                const quary = { _id: ObjectId(id) };
                const result = await products.findOne(quary);
                res.send(result);
            }
        });

        //delete product by id
        productRouter.delete("/:id", checkUser, async (req, res) => {
            const id = req.params.id;
            deleteImage(req.body.imgId);
            const filter = { _id: ObjectId(id) };
            const result = await products.deleteOne(filter);
            res.send(result);
        });
    }
    finally {

    }
}
products();
module.exports = productRouter;
