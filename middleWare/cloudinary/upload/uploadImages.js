const cloudinary = require('../cloudinary.confiq');

module.exports = function uploadImages(folder) {
    return uPloadProfile = (req, res, next) => {
        if (!req.file) {
            return next();
        }
        const file = req.file.path;
        cloudinary.uploader.upload(file, {
            folder: folder,
            use_filename: true,
            transformation: [
                { height: 436, width: 640 }
            ]
        }).then(result => {
            req.body.imgUrl = result.secure_url;
            req.body.imgId = result.public_id;
            next();
        }).catch(err => {
            throw new Error(err);
        })
    };
}



