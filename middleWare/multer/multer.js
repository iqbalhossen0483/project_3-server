const multer = require("multer");
const path = require("path");

module.exports = multer({
    storage: multer.diskStorage({
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const imgName = file.originalname
                .replace(ext, "")
                .replace(" ", "_")
                .toLowerCase() + ext;
            cb(null, imgName);
        }
    }),
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".JPG" && ext !== ".jpeg" && ext !== ".png") {
            cb(new Error("file type is not allowed"));
            return;
        }
        cb(null, true);
    }
});