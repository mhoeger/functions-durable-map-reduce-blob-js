#r "Microsoft.Azure.WebJobs.Extensions.DurableTask"
#r "Microsoft.Extensions.Logging"
#r "Newtonsoft.Json"

using System.Net;
using System.Net.Http.Headers;

public static async Task<HttpResponseMessage> Run(
    HttpRequestMessage req,
    DurableOrchestrationClient starter,
    string functionName,
    ILogger log)
{
    var res2 = starter.CreateCheckStatusResponse(req, "00000000000000000000000097ADF419");
    var txt = await res2.Content.ReadAsStringAsync();
    log.LogInformation(txt);

    // Function input comes from the request content.
    dynamic eventData = await req.Content.ReadAsAsync<object>();
    string instanceId = await starter.StartNewAsync(functionName, eventData);
    
    log.LogInformation($"Started orchestration with ID = '{instanceId}'.");
    
    var res = starter.CreateCheckStatusResponse(req, instanceId);
    res.Headers.RetryAfter = new RetryConditionHeaderValue(TimeSpan.FromSeconds(10));
    return res;
}
