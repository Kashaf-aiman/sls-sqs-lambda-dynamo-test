const Backoff = require('./Backoff.js');
const AWS = require('aws-sdk');
var SQS = new AWS.SQS();


const changeMessageVisibility = (retries, maxRetryCount, queue_url, receipt) => {
    

    if(retries <= maxRetryCount) {
        var params = {
            QueueUrl: queue_url, 
            ReceiptHandle: receipt,
            VisibilityTimeout: parseInt(Backoff(retries)) 
        };
        // SQS.changeMessageVisibility(params);
        SQS.changeMessageVisibility(params);
        // console.log(visibilityData);
        // console.log("receipt:", receipt);
        // console.log("retries:", retries);
    }
    else{
        throw new Error("Failed after 3 retries");
    }

};

module.exports = changeMessageVisibility;

// function(err,data) {
//     if(err) console.log(err,err.stack); //an error occurred
//     else console.log(data); // successful response
// }