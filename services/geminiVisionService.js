const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function geminiVisionService(message, image) {
  try {
    const imagePart = {
      inlineData: {
        mimeType: image.mimetype,
        data: image.buffer.toString("base64"),
      },
    };

    const prompt = `
You are Shero AI.

The user uploaded an image.

User request:
${message}

Instructions:
- Carefully analyze the image.
- If it contains notes, books, handwritten text, printed text, documents or question papers:
  - Read all visible text.
  - Answer only from the image.
  - Summarize if asked.
  - Explain if asked.
  - Translate if asked.
  - Generate MCQs if asked.
- If the image is unclear, politely ask for a clearer image.
- Reply in the same language as the user.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            imagePart,
          ],
        },
      ],
    });

    return response.text;

  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw error;
  }
}

module.exports = geminiVisionService;