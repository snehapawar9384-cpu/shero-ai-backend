const axios = require("axios");

async function imageService(prompt) {

    try {

        const url =
            `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

        const response = await axios.get(url, {
            responseType: "arraybuffer"
        });

        return {
            success: true,
            image: Buffer.from(response.data).toString("base64")
        };

    } catch (error) {

        console.error("Image Error:", error.message);

        return {
            success: false,
            message: "Image generation failed."
        };

    }

}

module.exports = imageService;