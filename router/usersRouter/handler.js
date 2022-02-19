const deleteImage = require("../../middleWare/cloudinary/deleteImage/deleteImage");
const mongoDb = require("../../mongoDb");
const jwt = require('jsonwebtoken');


const client = mongoDb();

//connect to database
async function connectDb() {
    await client.connect();
};

connectDb();
const database = client.db("cycle-mart");
const users = database.collection("users");

//make a user to database
async function makeUserToDb(req, res) {
    const filter = { email: req.body.email };
    const user = { $set: req.body };
    const options = { upsert: true };
    const result = await users.updateOne(filter, user, options);
    if(result.upsertedId){
        const token = jwt.sign({
                admin: false,
                user: req.body
            }, process.env.JWT_SECRATE, {
                expiresIn: "7d"
            }); 
        res.send({
            admin: false,
            token
        });
    }
};

//log in user and get token for browsing
async function logInUser(req, res) {
    const filter = { email: req.params.email };
    const user = await users.findOne(filter);
    try {
        if (user?.role === "admin") {
            const token = jwt.sign({
                admin: true,
                user
            }, process.env.JWT_SECRATE, {
                expiresIn: "10h"
            });
            res.send({
                admin: true,
                token: token
            });
        }
        else if (user.email) {
            const token = jwt.sign({
                admin: false,
                user
            }, process.env.JWT_SECRATE, {
                expiresIn: "7d"
            });
            res.send({
                admin: false,
                token: token
            });
        }
        else {
            res.status(401).send({ error: "user is not allowed to do anythings" })
        }
    }
    catch {
        res.status(401).send({ error: "user is not allowed to do anything" })
    }
};

//get user his/her specefic data
async function getUserData(req, res) {
    const email = req.params.email;
    const user = req.user;
    if (user.email === email) {
        res.send(user);
    } else {
        res.status(500).json("No user found")
    }
};


//user profile update
async function updateUserProfile(req, res) {
        // //delete if img exist in cloudinary
        if (req.body.existingImg) {
            deleteImage(req.body.existingImg);
        };

        //update user to database
        const query = { email: req.body.email };
        const docs = {
            $set: req.body
        }
        try {
            users.updateOne(query, docs)
                .then(data => {
                if (data.modifiedCount > 0) {
                    res.send(data);
                }
                else {
                    deleteImage(req.body.imgId);
                    res.status(500).send({ message: "no user found" });
                }
            })
        }
        catch (err) {
            deleteImage(req.body.imgId);
            res.status(500).send({ message: err });
        }
};

//user's product collection update
async function userCartUpdate(req, res) {
    const email = req.params.email;
    const cart = req.body;
    const filter = { email: email };
    const doc = {
        $set: {
            cart: cart
        }
    }
    const option = { upsert: true };
    const result = await users.updateOne(filter, doc, option);
    res.json(result);
};

//make admin
async function makeAdmin(req, res) {
    const filter = { email: req.body.email };
    const update = {
        $set: {
            role: "admin"
        }
    };
    const result = await users.updateOne(filter, update);
    res.json(result);
};


module.exports = {
    makeUserToDb,
    logInUser,
    getUserData,
    updateUserProfile,
    userCartUpdate,
    makeAdmin
}