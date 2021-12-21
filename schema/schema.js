const mongoDb = require("../mongoDb");

const client = mongoDb();

// const db = client.db("cycle-mart");


//products schema
// db.command({
//     collMod: "products",
//     validator: {
//         $jsonSchema: {
//             bsonType: "object",
//             required: ["_id", "img", "name", "description", "price", "stock", "type", "vendor", "category"],
//             additionalProperties: false,
//             properties: {
//                 _id: {
//                     bsonType: "objectId",
//                     description: "must be a objectId and is required"
//                 },
//                 img: {
//                     bsonType: "string",
//                     description: "must be a string and is required"
//                 },
//                 name: {
//                     bsonType: "string",
//                     description: "must be a string and is required"
//                 },
//                 description: {
//                     bsonType: "string",
//                     description: "must be a string and is required"
//                 },
//                 price: {
//                     bsonType: "int",
//                     description: "must be a number and is required"
//                 },
//                 stock: {
//                     bsonType: "int",
//                     description: "must be a number and is required"
//                 },
//                 type: {
//                     bsonType: "string",
//                     enum: ["Geared", "Non-Geared", null],
//                     description: "must be a string and is required"
//                 },
//                 vendor: {
//                     bsonType: "string",
//                     description: "must be a string and is required"
//                 },
//                 category: {
//                     bsonType: "string",
//                     description: "must be a string and is required"
//                 },
//             }
//         }
//     },
//     validationLevel: "strict",
//     validationAction: "error"
// })