const memory = {};

function remember(userId, key, value) {
    if (!memory[userId]) {
        memory[userId] = {};
    }

    memory[userId][key] = value;
}

function recall(userId, key) {
    if (!memory[userId]) return null;

    return memory[userId][key] || null;
}

function clearMemory(userId) {
    delete memory[userId];
}

module.exports = {
    remember,
    recall,
    clearMemory
};