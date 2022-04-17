const router = require("express").Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../../../s3");
const randomString = require("randomstring");
const connection = require("../../../models/connection");

const upload = multer({
    storage: multerS3({
        s3,
        bucket: "apm-bucket-01",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + randomString.generate(10));
        },
    }),
});

router.post("/single", upload.single("data"), (req, res) => {
    try {
        return res.status(201).json({ success: true, url: req.file.location });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.post("/multi", upload.array("data"), (req, res) => {
    try {
        return res.status(201).json({ success: true, files: req.files });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
