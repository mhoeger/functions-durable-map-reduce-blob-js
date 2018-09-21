// const TextAnalyticsAPIClient = require("azure-cognitiveservices-textanalytics");
// const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
// const credentials = new CognitiveServicesCredentials(process.env["CognitiveServicesKey"]);
// const client = new TextAnalyticsAPIClient(credentials, "https://api.cognitive.microsoft.com/sts/v1.0/");

// module.exports = client;

// in retrieveContent
// const client = require("../services/cognitiveServices");

//, "azure-cognitiveservices-textanalytics": "2.0.0"

// let input = {
//     documents: [
//         {
//             id: "1",
//             text: text
//         }
//     ]
// };
// client.sentiment(input).then((sentiment) => {
//     context.done(null, sentiment);
// }).catch((error) => {
//     context.done(error);
// });