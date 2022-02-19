const express = require("express");
const checkUser = require("../../middleWare/userMiddleware");
const { postOffer, getOffers, deleteOffers } = require("./handler");


const offerRouter = express.Router();

offerRouter.post("/",
    checkUser,
    postOffer
);

offerRouter.get("/", getOffers);

offerRouter.delete("/:id",
    checkUser,
    deleteOffers
);



module.exports = offerRouter;