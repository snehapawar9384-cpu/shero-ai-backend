const express = require("express");

const webSearchController = require("../controllers/webSearchController");

const router = express.Router();

router.post(
    "/web-search",
    webSearchController
);

module.exports = router;