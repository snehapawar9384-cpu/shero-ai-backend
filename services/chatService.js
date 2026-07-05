const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function chatService(messages, model) {

    const completion = await groq.chat.completions.create({

        model,

        messages,

        temperature: 0.2,

        max_tokens: 1024,

    });

    return completion.choices[0].message.content;

}

module.exports = chatService;