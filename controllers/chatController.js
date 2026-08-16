const systemPrompt = require("../services/promptService");
const chatService = require("../services/chatService");
const buildVisionMessage = require("../services/visionService"
    
    
);
const geminiVisionService = require("../services/geminiVisionService");

const detectIntent = require("../services/routerService");
const webSearchService = require("../services/webSearchService");
const memoryService = require("../services/memoryService");
const imageService = require("../services/imageService");
const pdfService = require("../services/pdfService");

async function chatController(req, res) {
    try {

        const message = req.body.message;

        const history = req.body.history
            ? JSON.parse(req.body.history)
            : [];

        const image = req.files?.image
    ? req.files.image[0]
    : null;

const pdf = req.files?.pdf
    ? req.files.pdf[0]
    : null;
        const intent = detectIntent(message);
        

const lowerMessage = message.toLowerCase();


// ===========================
// PDF Analysis
// ===========================

if (pdf) {

    const result = await pdfService(pdf.buffer);
    if (!result.success) {

        return res.json({
            reply: "❌ Unable to read the PDF."
        });

    }

    let messages = [
        {
            role: "system",
            content: systemPrompt
        },
        {
            role: "user",
            content:
                `PDF Content:\n\n${result.text}\n\n\nUser Question:\n${message}`
        }
    ];

    const reply = await chatService(
        messages,
        "llama-3.3-70b-versatile"
    );

    return res.json({
        reply
    });

}
// ===========================

// Image Generation
// ===========================


const imageWords = [
    "draw",
    "generate image",
    "create image",
    "make image",
    "image of",
    "photo of",
    "picture of",
    "drawing",
    "चित्र",
    "फोटो",
    "image",
    "draw me"
];

const wantsImage = imageWords.some(word =>
    lowerMessage.includes(word)
);

if (wantsImage) {
    console.log("🟢 IMAGE BLOCK TRIGGERED");

    const result = await imageService(message);

    if (result.success) {

        return res.json({
            type: "image",
            image: result.image
        });

    }

    return res.json({
        reply: "⚠️ Image generation failed."
    });

}
const isTimeQuestion =

    lowerMessage.includes("time") ||
    lowerMessage.includes("what time") ||
    lowerMessage.includes("current time") ||

    lowerMessage.includes("किती वाजले") ||
    lowerMessage.includes("आता किती") ||
    lowerMessage.includes("वेळ") ||

    lowerMessage.includes("vajle") ||
    lowerMessage.includes("vajlet") ||
    lowerMessage.includes("vel");

if (isTimeQuestion) {

    const formatter = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });

    const currentTime = formatter.format(new Date());

    return res.json({
        reply: `🕒 आता ${currentTime} वाजले आहेत.`
    });

}

// ===========================
// Memory (Name)
// ===========================

const userId = "default-user";
// ===========================
// Smart Memory
// ===========================

// Name
const nameRegex = /my name is\s+(.+)/i;
const name = message.match(nameRegex);

if (name) {

    memoryService.remember(userId, "name", name[1].trim());

    return res.json({
        reply: `😊 Nice to meet you, ${name[1].trim()}! I'll remember your name. 💜`
    });

}

// Age
const ageRegex = /i am (\d+)|i'm (\d+)/i;
const age = message.match(ageRegex);

if (age) {

    const value = age[1] || age[2];

    memoryService.remember(userId, "age", value);

    return res.json({
        reply: `🎂 Got it! I'll remember that you're ${value} years old.`
    });

}

// City
const cityRegex = /i live in (.+)/i;
const city = message.match(cityRegex);

if (city) {

    memoryService.remember(userId, "city", city[1].trim());

    return res.json({
        reply: `📍 Great! I'll remember that you live in ${city[1].trim()}.`
    });

}

// Favourite Color
const colorRegex = /my favourite color is (.+)|my favorite color is (.+)/i;
const color = message.match(colorRegex);

if (color) {

    const value = color[1] || color[2];

    memoryService.remember(userId, "color", value.trim());

    return res.json({
        reply: `🎨 I'll remember your favourite color is ${value.trim()}.`
    });

}

// Favourite Food
const foodRegex = /my favourite food is (.+)|my favorite food is (.+)/i;
const food = message.match(foodRegex);

if (food) {

    const value = food[1] || food[2];

    memoryService.remember(userId, "food", value.trim());

    return res.json({
        reply: `🍕 I'll remember your favourite food is ${value.trim()}.`
    });

}

// Hobby
const hobbyRegex = /my hobby is (.+)/i;
const hobby = message.match(hobbyRegex);

if (hobby) {

    memoryService.remember(userId, "hobby", hobby[1].trim());

    return res.json({
        reply: `🎯 Nice! I'll remember your hobby is ${hobby[1].trim()}.`
    });

}

// Remember user's name
const nameMatch = message.match(/my name is\s+(.+)/i);

if (nameMatch) {

    const name = nameMatch[1].trim();

    memoryService.remember(userId, "name", name);

    return res.json({
        reply: `😊 Nice to meet you, ${name}! I'll remember your name. 💜`
    });

}

// Recall user's name
if (
    lowerMessage.includes("what's my name") ||
    lowerMessage.includes("what is my name") ||
    lowerMessage.includes("माझं नाव काय") ||
    lowerMessage.includes("maz nav kay")
) {

    const savedName = memoryService.recall(userId, "name");

    if (savedName) {

        return res.json({
            reply: `😊 Your name is ${savedName}.`
        });

    }

    return res.json({
        reply: "I don't know your name yet. Tell me by saying: My name is ..."
    });

}
// ===========================
// Recall Smart Memory
// ===========================

// Age
if (
    lowerMessage.includes("how old am i") ||
    lowerMessage.includes("my age")
) {

    const age = memoryService.recall(userId, "age");

    return res.json({
        reply: age
            ? `🎂 You are ${age} years old.`
            : "I don't know your age yet."
    });

}

// City
if (
    lowerMessage.includes("where do i live") ||
    lowerMessage.includes("my city")
) {

    const city = memoryService.recall(userId, "city");

    return res.json({
        reply: city
            ? `📍 You live in ${city}.`
            : "I don't know where you live yet."
    });

}

// Favourite Color
if (
    lowerMessage.includes("favourite color") ||
    lowerMessage.includes("favorite color")
) {

    const color = memoryService.recall(userId, "color");

    return res.json({
        reply: color
            ? `🎨 Your favourite color is ${color}.`
            : "I don't know your favourite color yet."
    });

}

// Favourite Food
if (
    lowerMessage.includes("favourite food") ||
    lowerMessage.includes("favorite food")
) {

    const food = memoryService.recall(userId, "food");

    return res.json({
        reply: food
            ? `🍕 Your favourite food is ${food}.`
            : "I don't know your favourite food yet."
    });

}

// Hobby
if (
    lowerMessage.includes("my hobby") ||
    lowerMessage.includes("what's my hobby")
) {

    const hobby = memoryService.recall(userId, "hobby");

    return res.json({
        reply: hobby
            ? `🎯 Your hobby is ${hobby}.`
            : "I don't know your hobby yet."
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

    const reply = await geminiVisionService(message, image);

    return res.json({
        reply
    });

}

         else {const followUpWords = [
    "english",
    "marathi",
    "hindi",
    "translate",
    "same",
    "continue",
    "explain",
    "short",
    "long",
    "he english",
    "he marathi",
    "same in english",
    "same in marathi"
];

const isFollowUp = followUpWords.some(word =>
    lowerMessage.includes(word)
);

if (isFollowUp) {

    messages.push({
        role: "system",
        content:
            "The user's latest message refers to your PREVIOUS answer. Do NOT start a new topic. Apply the user's request to your last response only."
    });

}

            messages.push({
                role: "user",
                content: message
            });

        }

        // Select Model
        // Select Model
const model = "llama-3.1-8b-instant";

console.log("==============================");
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