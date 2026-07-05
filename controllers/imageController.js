const imageService = require("../services/imageService");

async function imageController(req, res) {

    try {

        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required."
            });
        }

        const result = await imageService(prompt);

        res.json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Image generation failed."
        });

    }

}

module.exports = imageController;