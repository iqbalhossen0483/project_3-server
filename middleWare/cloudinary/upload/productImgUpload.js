const cloudinary = require('../cloudinary.confiq');
const deleteImage = require('../deleteImage/deleteImage');


//uploder
async function uploader(file) {
    const result = await cloudinary.uploader.upload(file, {
        folder: "cycle-mart/products",
        use_filename: true,
        transformation: [
            { height: 436, width: 640 }
        ]
    });
    return result;
}

module.exports = productImgUpload = async (req, res, next) => {

    //delete existing images....
    if (req.body.productImgId) {
        deleteImage(req.body.productImgId);
    }
    if (req.body.imgGallery) {
        req.body.Gallery.forEach(img => {
            deleteImage(img.imgId);
        })
    }

    const file = req.files["img"][0];
    const files = req.files["gallery"];

    if (!file && !files.length) next();

    try {
        //product image upload
        if (file) {
            const result = await uploader(file.path);
            const productImg = {
                imgUrl: result.secure_url,
                imgId: result.public_id
            };
            req.body.productImg = productImg;
        }

        //check product gallery exist or not
        if (!files.length) {
                next();
        }
        //upload gallery images
        else {
            const gallery = [];
            for (const file of files) {
                const result = await uploader(file.path);
                const imgFile = {
                    imgUrl: result.secure_url,
                    imgId: result.public_id
                };
                gallery.push(imgFile);
            };
            req.body.imgGallery = gallery;
            next();
        };
    }
    catch (err) {
        next(err);
    }
};



