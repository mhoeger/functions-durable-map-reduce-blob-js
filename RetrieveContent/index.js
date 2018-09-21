const blobService = require("../services/storage");

module.exports = function(context, fileName) {
    blobService.getBlobToText("out-container", fileName, function (error, text, result, response) {
        if (error) {
            context.done(error);
        } else {
            context.done(null, text);
        }
    });
};