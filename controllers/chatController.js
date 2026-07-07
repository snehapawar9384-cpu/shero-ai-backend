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
        // ===========================
// Current Time
// ===========================

const lowerMessage = message.toLowerCase();

if (
    lowerMessage.includes("time") ||
    lowerMessage.includes("किती वाजले") ||
    lowerMessage.includes("ata kiti vajlet") ||
    lowerMessage.includes("what time")
) {

    const now = new Date();

    const currentTime = now.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });

    return res.json({
        reply: `🕒 आता ${currentTime} वाजले आहेत.`
    });
}
// ===========================
// Shero Introduction
// ===========================

if (
    lowerMessage.includes("who are you") ||
    lowerMessage.includes("your name") ||
    lowerMessage.includes("तुझं नाव") ||
    lowerMessage.includes("tu kon ahes") ||
    lowerMessage.includes("who created you")
) {

    return res.json({
        reply: `🐶 नमस्कार! मी Shero AI आहे.

मी English, Marathi आणि Hindi मध्ये मदत करू शकतो.

मी coding, studies, web search, image analysis आणि अनेक प्रश्नांची उत्तरे देऊ शकतो.

मी तुमचा AI Assistant आहे. 💜`
    });

}
// ===========================
// Greetings
// ===========================

if (
    lowerMessage.trim() === "hi" ||
    lowerMessage.trim() === "hello" ||
    lowerMessage.trim() === "hey" ||
    lowerMessage.trim() === "hii" ||
    lowerMessage.trim() === "thank you" ||
    lowerMessage.trim() === "thanks" ||
    lowerMessage.trim() === "नमस्कार" ||
    lowerMessage.trim() === "हाय"
) {

    if (
        lowerMessage.includes("thank")
        || lowerMessage.includes("thanks")
    ) {

        return res.json({
            reply: "💜 You're most welcome! मला आनंद आहे की मी मदत करू शकलो. अजून काही मदत हवी असेल तर नक्की विचारा."
        });

    }

    return res.json({
        reply: "👋 Hello! मी Shero AI आहे. 😊\n\nआज मी तुमची कशी मदत करू शकतो?"
    });

}
    

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
        const model = "llama-3.3-70b-versatile";
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