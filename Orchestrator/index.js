const df = require("durable-functions");
const commonWords = ["the", "of", "to", "and", "a", "in", "is", "it", "you", "that"]

module.exports = df(function*(context) {
    context.log.info("Begin map reduce orchestrator");
    // Get list of files in container
    const textFileNames = yield context.df.callActivityAsync("listFiles", "out-container");

    // Get text content for each file
    const tasks = [];
    textFileNames.forEach(fileName => {
        tasks.push(context.df.callActivityAsync("retrieveContent", fileName));
    });

    const blobContent = yield context.df.Task.all(tasks);

    // Analyze content
    let mostUsed = topUsedWords(blobContent, 20);
    context.log(mostUsed);
    return mostUsed;
});

function topUsedWords(textFiles, topN) {
    const wordCounts = {};
    let sortable = [];
    // Count words in files
    textFiles.forEach(phrase => {
        const words = phrase.split(" ").filter((word) => word);
        words.forEach((word) => {
            let count = wordCounts[word];
            wordCounts[word] = count ? count + 1 : 1;
        });
    });
    // Sort words by count (descending)
    for (const key in wordCounts) {
        sortable.push({ "word": key, "count": wordCounts[key] });
    };
    return sortable
        .filter((tuple) => !(commonWords.indexOf(tuple.word.toLowerCase()) > -1))
        .sort(sortDescendingByCount)
        .map((tuple) => tuple.word)
        .slice(0, topN);
}

function sortDescendingByCount(a, b) {
    return b.count - a.count;
}

