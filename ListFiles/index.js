const blobService = require("../services/storage");

module.exports = function (context, containerName) {
    context.log("Fetching names");
    let blobNames = [];
    function aggregateBlobNames(error, result, callback) {
        if (error) {
            callback(error);
        } else {
            blobNames = blobNames.concat(result.entries.map((entry) => entry.name));
            if (result.continuationToken !== null) {
                blobService.listBlobsSegmented(
                    containerName,
                    result.continuationToken,
                    aggregateBlobNames
                );
            } else {
                callback(undefined, blobNames);
            }
        }
    }

    blobService.listBlobsSegmented(containerName, null, undefined, function (error, result) {
        aggregateBlobNames(error, result, function (error, blobNames) {
            if (error) {
                context.done(error);
            } else {
                context.done(null, blobNames);
            }
        });
    });
};