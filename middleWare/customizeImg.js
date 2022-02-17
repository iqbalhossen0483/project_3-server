module.exports = function customizeImg(req,res,next) {
    req.file = req.files["img"][0];

    const gallery = req.files["gallery"];
    if (gallery?.length) {
        const files = [];
        gallery.forEach(img => {
            files.push(img.path);
        });
        req.files = files;
    }
    else {
        req.files = [];
    }

    next();
}