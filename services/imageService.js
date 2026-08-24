const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_API_KEY);

async function imageService(prompt) {
    try {

        console.log("🟢 Image generation started");
        console.log("Prompt:", prompt);

        const image = await client.textToImage({
            model: "black-forest-labs/FLUX.1-schnell",
            inputs: prompt,
            provider: "auto"
        });

        const buffer = Buffer.from(await image.arrayBuffer());

        console.log("✅ Image generated successfully");

        return {
            success: true,
            image: buffer.toString("base64")
        };

    } catch (error) {

        console.error("❌ Image Generation Error:", error);

        return {
            success: false,
            message: "Image generation failed."
        };
    }
}

module.exports = imageService;