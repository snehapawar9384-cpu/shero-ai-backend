const pdf = require("pdf-parse");

async function pdfService(buffer) {

    try {

        const data = await pdf(buffer);

        return {
            success: true,
            text: data.text
        };

    } catch (error) {

        console.error("PDF Error:", error);

        return {
            success: false,
            text: ""
        };

    }

}

module.exports = pdfService;