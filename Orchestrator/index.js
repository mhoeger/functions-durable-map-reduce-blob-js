const df = require("durable-functions");

module.exports = df(function*(context) {
    const textFileNames = yield context.df.callActivityAsync("ListFiles", "out-container");

    const tasks = [];
    textFileNames.forEach(fileName => {
        tasks.push(context.df.callActivityAsync("RetrieveContent", fileName));
    });

    const completedTasks = yield context.df.Task.all(tasks);

    return calculateMostUsed(completedTasks, 5);
});

function calculateMostUsed(stickers, count) {
    const counts = [];
    let tuples = [];
    stickers.forEach(phrase => {
        const words = phrase.split(" ").filter((word) => word);
        words.forEach((word) => {
            if (counts[word]) {
                counts[word]++;
            } else {
                counts[word] = 1;
            }
        });
    });
    for (const key in counts) {
        tuples.push({ "word": key, "count": counts[key] });
    };
    tuples = tuples
        .sort(sortByCountThenNameDescending)
        .map((tuple) => tuple.word)
        .slice(0, count);

    return tuples;
}

function sortByCountThenNameDescending(a, b) {
    if (a.count > b.count) {
        return -1;
    }
    if (a.count < b.count) {
        return 1;
    }
    return 0;
}

