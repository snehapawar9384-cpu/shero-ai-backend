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

             reasoning_format: "hidden",
             reasoning_effort: "none",

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
- Give only the final answer to the user.
- Do not show internal reasoning, analysis, or <think> tags.
- Do not mention how you analyzed the image.
- If the user asks for a specific question, answer only that question.
- Keep the response concise unless the user asks for explanation.



Do not invent information that is not visible in the image.

If the image is unclear, tell the user that a clearer image is required.
- Return only the final answer.
- Never output <think> tags.
- Never output internal reasoning or analysis.
- Do not repeat the image analysis process.
- Answer only what the user asked.
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
            max_completion_tokens: 4096

        });

        return completion.choices[0].message.content;

    } catch (error) {

       console.error("❌ Groq Vision Error");
console.error("Status:", error.status);
console.error("Message:", error.message);
console.error("Response:", error.error);

        throw error;
    }
}

module.exports = geminiVisionService;