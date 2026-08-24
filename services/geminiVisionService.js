const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function geminiVisionService(message, image) {
    try {

        const base64Image = image.buffer.toString("base64");

        const imageUrl =
            `data:${image.mimetype};base64,${base64Image}`;

        const completion = await groq.chat.completions.create({

            model: "qwen/qwen3.6-27b",

            messages: [
                {
                    role: "system",
                    content: `
You are Shero AI.

Carefully analyze the uploaded image.

If the image contains:
- question papers
- books
- notes
- handwritten text
- printed text
- documents
- diagrams
- mathematical questions

Read the visible content carefully and answer the user's question.

If the user asks for:
- English → answer in English
- Marathi → answer in Marathi
- Hindi → answer in Hindi
- translation → translate accurately
- explanation → explain clearly
- answers → provide the correct answers

Do not invent information that is not visible in the image.

If the image is unclear, tell the user that a clearer image is required.
                    `
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: message
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageUrl
                            }
                        }
                    ]
                }
            ],

            temperature: 0.2,
            max_completion_tokens: 2048

        });

        return completion.choices[0].message.content;

    } catch (error) {

        console.error("Groq Vision Error:", error);

        throw error;
    }
}

module.exports = geminiVisionService;