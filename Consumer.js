'use strict';

// const Backoff = require('./Backoff.js');
const error = require("./error.js");
const changeMessageVisibility = require('./ChangeVissibilityTime.js');

const AWS = require('aws-sdk');
var SQS = new AWS.SQS();
const AWS_ACCOUNT = process.env.ACCOUNT_ID;
const QUEUE_URL = `https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT}/MyQueue`;

// let messageCount = 0;
const recvCount = process.env.maxReceiveCount;


module.exports.sqsConsume = async (event) => { 

    const { Records } = event;

    // for(let i=0;i<Records.length ;i++) {
        
        Records.forEach(async record => {
        let receipt = record.receiptHandle;
        // let receipt = Records[i].receiptHandle;
        // let retries = Records[i].attributes.ApproximateReceiveCount;
        let retries = record.attributes.ApproximateReceiveCount;

        try{
                error();
                console.log('successfully processed')
                console.log(JSON.stringify(record));
        }
        catch(err) {

            console.log("receipt:", receipt);
            console.log("retries:", retries);
            // console.log(`error:${err}`);
            changeMessageVisibility(retries, recvCount, QUEUE_URL, receipt);
                
        }
    })

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
