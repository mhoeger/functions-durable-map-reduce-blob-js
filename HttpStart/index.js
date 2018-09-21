const uuidv1 = require("uuid/v1");

module.exports = function (context, req) {
    context.log("Starting function " + req.params.functionName);
    const id = uuidv1();

    let startArgs = [{
        FunctionName: req.params.functionName,
        Input: req.body,
        InstanceId: id
    }];

    let storageCode = process.env.AzureWebJobsStorageKey;
    let url = context.req.url.split("/api/")[0];

    let statusEndpoints = {
        id: id,
        statusQueryGetUri: `${url}/runtime/webhooks/durabletask/instances/${id}?taskHub=DurableFunctionsHub&connection=Storage&code=${storageCode}`,
        sendEventPostUri: `${url}/runtime/webhooks/durabletask/instances/${id}?/raiseEvent/{eventName}?taskHub=DurableFunctionsHub&connection=Storage&code=${storageCode}`,
        terminatePostUri: `${url}/runtime/webhooks/durabletask/instances/${id}/terminate?reason={text}&taskHub=DurableFunctionsHub&connection=Storage&code=${storageCode}`,
        rewindPostUri: `${url}/runtime/webhooks/durabletask/instances/${id}/rewind?reason={text}&taskHub=DurableFunctionsHub&connection=Storage&code=${storageCode}`
    }

    context.bindings.starter = startArgs;
    context.done(null, {status: 202, body: statusEndpoints});
};