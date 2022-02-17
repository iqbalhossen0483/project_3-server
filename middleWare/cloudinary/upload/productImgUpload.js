const cloudinary = require('../cloudinary.confiq');


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
   
    const file = req.files["img"][0].path;
    const files = req.files["gallery"];

    try {
        const result = await uploader(file);
        const productImg = {
            imgUrl: result.secure_url,
            imgId: result.public_id
        };
        req.body.productImg = productImg;

        if (!files.length) {
                next();
            }
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



