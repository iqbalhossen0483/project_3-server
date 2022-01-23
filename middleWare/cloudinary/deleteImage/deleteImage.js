const cloudinary = require("../cloudinary.confiq");

module.exports = function deleteImage(id){
    cloudinary.uploader.destroy(id, (result) => {
        console.log("img deleted", id)
    })
}