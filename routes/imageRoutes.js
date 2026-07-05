const express = require("express");

const imageController = require("../controllers/imageController");

const router = express.Router();

router.post(
    "/generate-image",
    imageController
);

module.exports = router;