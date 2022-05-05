'use strict';
// import { Backoff } from './Backoff';

const AWS = require('aws-sdk');
var SQS = new AWS.SQS();
const AWS_ACCOUNT = process.env.ACCOUNT_ID;
const QUEUE_URL = `https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT}/MyQueue`;

let messageCount = 0;
const recvCount = process.env.maxReceiveCount;

module.exports.sqsConsume = async (event) => { 
    try{
            if (event.Records) {
                messageCount += event.Records.length
            }
            error();
            console.log('Message Count: ', messageCount)
            console.log(JSON.stringify(event))
    }

    catch(err) {
            let retries = event.Records[0].attributes.ApproximateReceiveCount;
            let receipt = event.Records[0].receiptHandle;
            
            console.log(retries);
            if(retries <= recvCount){
                var params = {
                    QueueUrl: QUEUE_URL, 
                    ReceiptHandle: receipt,
                    VisibilityTimeout: parseInt(Backoff(retries)) 
                };
                SQS.changeMessageVisibility(params , function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else console.log(data);           // successful response
                });
            }
            else{
                console.log(err);
            }
    }

};

const error = () => {
    let random = Math.random();
    if (random > 0.5) {
        const err = new Error('Im an error2!')
        throw err;
    }
}

const Backoff = (retries) => {
    let jitter = Math.floor((Math.random() * 60) + 1);
    let backoff = Math.pow(2, retries) + 30 + jitter;

    return backoff;
}