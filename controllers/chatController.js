const systemPrompt = require("../services/promptService");
const chatService = require("../services/chatService");
const buildVisionMessage = require("../services/visionService"
    
);

const detectIntent = require("../services/routerService");
const webSearchService = require("../services/webSearchService");

async function chatController(req, res) {
    try {

        const message = req.body.message;

        const history = req.body.history
            ? JSON.parse(req.body.history)
            : [];

        const image = req.file;
        const intent = detectIntent(message);

if (intent === "web" && !image) {

    const result = await webSearchService(message);

    return res.json({
        reply: result.success
            ? result.answer
            : "Sorry, I couldn't search the web right now."
    });

}

        let messages = [
            {
                role: "system",
                content: systemPrompt
            }
        ];

        // Previous conversation
        history.forEach(chat => {
            messages.push(chat);
        });

        // User message
        if (image) {

            messages.push(
                await buildVisionMessage(message, image)
            );

        } else {

            messages.push({
                role: "user",
                content: message
            });

        }

        // Select Model
        const model = image
            ? "meta-llama/llama-4-scout-17b-16e-instruct"
            : "openai/gpt-oss-120b";

        const reply = await chatService(messages, model);

        res.json({
            reply
        });

    } catch (error) {

        console.error(error);

       res.status(500).json({
    success: false,
    reply: "⚠️ Sorry, something went wrong. Please try again in a moment."
});
    }
}

module.exports = chatController;