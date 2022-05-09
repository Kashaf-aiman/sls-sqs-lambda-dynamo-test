'use strict';

const Backoff = require('./Backoff.js');
const error = require("./error.js");
// const changeMessageVisibility = require('./ChangeVissibilityTime.js');

const AWS = require('aws-sdk');
var SQS = new AWS.SQS();
const AWS_ACCOUNT = process.env.ACCOUNT_ID;
const QUEUE_URL = `https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT}/MyQueue`;

// let messageCount = 0;
const recvCount = process.env.MAX_RETRY;


module.exports.sqsConsume = async (event) => { 

    const { Records } = event;

    for(let i=0;i<Records.length ;i++) {
        let receipt = Records[i].receiptHandle;
        let retries = Records[i].attributes.ApproximateReceiveCount;
        
                if(error()){
                    if(retries <= recvCount) {
                        var params = {
                            QueueUrl: QUEUE_URL, 
                            ReceiptHandle: receipt,
                            VisibilityTimeout: parseInt(Backoff(retries)) 
                        };
                        console.log(params);
                        let check = await SQS.changeMessageVisibility(params).promise();
                        console.log(check);
                    }
                    else{
                        throw new Error("Failed after 3 retries");
                    }

                    throw new Error(`error: Error for ${retries} try`);
                }
        console.log('successfully processed')
        console.log(JSON.stringify(Records[i]));
    }

};

// if(retries < recvCount) {

//     var params = {
//         QueueUrl: QUEUE_URL, 
//         ReceiptHandle: receipt,
//         VisibilityTimeout: parseInt(Backoff(retries)) 
//     };

//     const visibilityData = await SQS.changeMessageVisibility(params).promise();
//     console.log(visibilityData);
// }
// else{
//     console.log('error: retries <= recvCount');
// }
// const error = () => {
//     let random = Math.random();
//     if (random > 0.5) {
//         const err = new Error('Retry count exausted')
//         throw err;
//     }
// }
