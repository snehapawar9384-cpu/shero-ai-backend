const fs = require("fs");
const path = require("path");

const memoryFile = path.join(__dirname, "memory.json");

// Load Memory
function loadMemory() {

    if (!fs.existsSync(memoryFile)) {
        fs.writeFileSync(memoryFile, "{}");
    }

    return JSON.parse(fs.readFileSync(memoryFile, "utf8"));

}

// Save Memory
function saveMemory(memory) {

    fs.writeFileSync(
        memoryFile,
        JSON.stringify(memory, null, 2)
    );

}

function remember(userId, key, value) {

    const memory = loadMemory();

    if (!memory[userId]) {
        memory[userId] = {};
    }

    memory[userId][key] = value;

    saveMemory(memory);

}

function recall(userId, key) {

    const memory = loadMemory();

    if (!memory[userId]) return null;

    return memory[userId][key] || null;

}

function getAllMemory(userId) {

    const memory = loadMemory();

    return memory[userId] || {};

}

function clearMemory(userId) {

    const memory = loadMemory();

    delete memory[userId];

    saveMemory(memory);

}

module.exports = {
    remember,
    recall,
    getAllMemory,
    clearMemory
};