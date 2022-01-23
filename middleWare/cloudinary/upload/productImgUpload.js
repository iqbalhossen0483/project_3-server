const cloudinary = require('../cloudinary.confiq');

module.exports = uPloadProfile = (req, res, next) => {
    if (!req.file) {
        return next();
    }
    const file = req.file.path;
    cloudinary.uploader.upload(file, {
        folder: "cycle-mart/products",
        use_filename: true,
        transformation: [
            { height: 300, width: 300, crop: "thumb"}
        ]
    }).then(result => {
        req.body.imgUrl = result.secure_url;
        req.body.imgId = result.public_id;
        next();
    }).catch(err => {
        throw new Error(err);
    })
};
