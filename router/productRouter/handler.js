const deleteImage = require("../../middleWare/cloudinary/deleteImage/deleteImage");
const ObjectId = require('mongodb').ObjectId;
const mongoDb = require("../../mongoDb");

const client = mongoDb();

//connect to database
async function connectDb() {
    await client.connect();
};


connectDb();
const database = client.db("cycle-mart");
const products = database.collection("products");

//get products
async function getProducts(req, res) {
    const result = await products.find({}).toArray();
    res.send(result)
};

//post product
async function postProduct(req, res) {
    products.insertOne(req.body)
        .then(result => res.send(result))
        .catch(err => {
            if (req.body.productImg.imgId) {
                deleteImage(req.body.productImg.imgId);
            }
            if (req.body.imgGallery?.length) {
                req.body.imgGallery.forEach(img => {
                deleteImage(img.imgId);
                })
            };
            res.send(err)
        })
};

//update product
async function updateProduct(req, res) {
    const id = req.body.id;
    delete req.body.id;
    delete req.body.productImgId;
    delete req.body.Gallery;
    const filter = { _id: ObjectId(id) };
    const updateDoc = { $set: req.body };
    const result = await products.updateOne(filter, updateDoc);
    res.send(result);
};

//products for home page
async function getProductsForHome(req, res) {
    const result = await products.find({}).limit(8).toArray();
    res.send(result)
};


//category product
async function getCategoryProduct(req, res) {
    const categoryName = req.params.name;
    const quary = { category: categoryName };
    const result = await products.find(quary).toArray();
    res.send(result);
};

//get rendom product
async function getRandomProduct(req, res) {
    const number = parseInt(req.params.num);
    const result = await products.find({}).skip(number).limit(1).toArray();
    res.send(result);
};

//get product by brand name
async function getBrandProduct(req, res) {
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
};

//get product by type
async function getProductByType(req, res) {
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
}

//product by price range
async function getProductByPrice(req, res) {
    const from = req.query.from;
    const till = req.query.till;
    const quary = {
        price: { $gte: from },
        price: { $lt: till }
    };
    const result = await products.find(quary).toArray();
    res.send(result);
};

// get product by id
async function getProductById(req, res) {
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
};

//delete product by id
async function deleteProduct(req, res) {
    const id = req.params.id;
    deleteImage(req.body.imgId);
    const filter = { _id: ObjectId(id) };
    const result = await products.deleteOne(filter);
    res.send(result);
}


module.exports = {
    getProducts,
    postProduct,
    updateProduct,
    getProductsForHome,
    getBrandProduct,
    getCategoryProduct,
    getProductByType,
    getProductByPrice,
    getProductById,
    deleteProduct,
    getRandomProduct
}
