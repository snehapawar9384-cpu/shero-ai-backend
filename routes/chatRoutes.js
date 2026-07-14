const express = require("express");
const multer = require("multer");

const chatController = require("../controllers/chatController");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});
router.post(
    "/chat",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "pdf", maxCount: 1 }
    ]),
    chatController
);

module.exports = router;