async function buildVisionMessage(message, image) {

    const base64Image = image.buffer.toString("base64");

    return {
        role: "user",
        content: [
            {
                type: "text",
                text: `
The user uploaded an image.

User request:
${message}

Carefully analyze the image before answering.

If the image contains notes, books, handwritten text, printed text, documents or question papers:

- Read all visible text carefully.
- Answer only from the image.
- If asked for summary, give a good summary.
- If asked for MCQs, generate MCQs.
- If asked to explain, explain clearly.
- If asked to translate, translate the text.
- If asked questions about the image, answer accurately.

If the image is unclear, politely ask for a clearer image.

Always answer in the user's requested language.
`
            },
            {
                type: "image_url",
                image_url: {
                    url: `data:${image.mimetype};base64,${base64Image}`
                }
            }
        ]
    };

}

module.exports = buildVisionMessage;