const webSearchService = require("../services/webSearchService");

async function webSearchController(req, res) {

    try {

        const { query } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required."
            });
        }

        const result = await webSearchService(query);

        res.json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Web Search failed."
        });

    }

}

module.exports = webSearchController;