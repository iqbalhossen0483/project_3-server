const productImgUpload = require("../../middleWare/cloudinary/upload/productImgUpload");
const checkUser = require("../../middleWare/userMiddleware");
const multer = require("../../middleWare/multer/multer");
const express = require("express");
const productRouter = express.Router();
const {
    getProducts,
    postProduct,
    updateProduct,
    getProductsForHome,
    getCategoryProduct,
    getRandomProduct,
    getBrandProduct,
    getProductByType,
    getProductByPrice,
    getProductById,
    deleteProduct
} = require("./handler");

productRouter.route("/")
    .get(getProducts)
    .post(
        checkUser,
        multer.fields([
            { name: "img", maxCount: 1 },
            { name: "gallery", maxCount: 3 }
        ]),
        productImgUpload,
        postProduct
    )
    .put(checkUser,
        multer.fields([
            { name: "img", maxCount: 1 },
            { name: "gallery", maxCount: 3 }
        ]),
        productImgUpload,
        updateProduct
    );

//products for home page
productRouter.get("/home", getProductsForHome);


//category product
productRouter.get("/category/:name", getCategoryProduct)

//get rendom product
productRouter.get("/rendom/:num", getRandomProduct);

//get product by brand name
productRouter.get("/brand/:brand", getBrandProduct);

//get product by type
productRouter.get("/type/:type", getProductByType);

//product by price range
productRouter.get("/price/byrange", getProductByPrice)

// get product by id
productRouter.get("/:id", getProductById);

//delete product by id
productRouter.delete("/:id", checkUser, deleteProduct);


module.exports = productRouter;
