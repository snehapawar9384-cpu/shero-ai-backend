const axios = require("axios");

async function imageService(prompt) {
    try {

        const response = await axios.post(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                inputs: prompt
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                responseType: "arraybuffer"
            }
        );

        return {
            success: true,
            image: Buffer.from(response.data).toString("base64")
        };

    } catch (error) {

        console.error("HF Status:", error.response?.status);
        console.error("HF Error:", error.response?.data || error.message);

        return {
            success: false,
            message: "Image generation failed."
        };

    }
}

module.exports = imageService;