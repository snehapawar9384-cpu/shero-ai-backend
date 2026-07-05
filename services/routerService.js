function detectIntent(message) {

    const text = message.toLowerCase();

    // Web Search Keywords
    const webKeywords = [

        // English
        "today",
        "latest",
        "news",
        "weather",
        "temperature",
        "price",
        "stock",
        "bitcoin",
        "gold",
        "ipl",
        "match",
        "score",
        "live",
        "current",
        "breaking",
        "who won",

        // Marathi (Roman)
        "aaj",
        "aajcha",
        "aajchi",
        "batmi",
        "havaman",
        "kimat",
        "score",
        "match",

        // Marathi (Unicode)
        "आज",
        "आजचा",
        "आजची",
        "बातमी",
        "बातम्या",
        "हवामान",
        "तापमान",
        "किंमत",
        "सोन्याचा भाव",
        "आयपीएल",

        // Hindi
        "आज",
        "मौसम",
        "समाचार",
        "खबर",
        "तापमान",
        "आईपीएल",
        "मैच",
        "स्कोर",
        "सोने का भाव"

    ];

    for (const word of webKeywords) {
        if (text.includes(word)) {
            return "web";
        }
    }

    return "chat";
}

module.exports = detectIntent;