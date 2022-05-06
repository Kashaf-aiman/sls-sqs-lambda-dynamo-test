'use strict';

const changeMessageVisibility = require('./ChangeVissibilityTime.js');
const error = require('./error.js');

const AWS = require('aws-sdk');
var SQS = new AWS.SQS();
const AWS_ACCOUNT = process.env.ACCOUNT_ID;
const QUEUE_URL = `https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT}/MyQueue`;

let messageCount = 0;
const recvCount = process.env.maxReceiveCount;


module.exports.sqsConsume = async (event) => { 
let receipt = event.Records[0].receiptHandle;
let retries = event.Records[0].attributes.ApproximateReceiveCount;

    if (event.Records) {
        messageCount += event.Records.length
    }
    if(error()){
        changeMessageVisibility(retries, recvCount, QUEUE_URL, receipt);
        // throw new Error('error');
    }
    console.log('Message Count: ', messageCount)
    console.log(JSON.stringify(event))
    };
    




    // console.log(event.Records);
//     event.Records.forEach(record => {
//     const { receiptHandle, attributes } = record;
//     const {ApproximateReceiveCount} = attributes;
//     console.log(receiptHandle);
//     console.log(ApproximateReceiveCount);
// });
// console.log(JSON.stringify(event.Records));
    // try{
          // }
         // catch(err) {
              // }