const storage = require("azure-storage");

module.exports = function(context, fileName) {
    const blobService = storage.createBlobService();
    blobService.getBlobToText("out-container", fileName, function (error, text, result, response) {
        if (error) {
            context.done(error);
        } else {
            context.done(null, text);
        }
    });
};