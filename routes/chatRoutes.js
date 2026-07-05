const express = require("express");
const multer = require("multer");

const chatController = require("../controllers/chatController");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

router.post(
    "/chat",
    upload.single("image"),
    chatController
);

module.exports = router;