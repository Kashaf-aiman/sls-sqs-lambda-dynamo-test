'use strict';

const Backoff = require('./Backoff.js');
// const error = require("./error.js");
// const changeMessageVisibility = require('./ChangeVissibilityTime.js');

const AWS = require('aws-sdk');
var SQS = new AWS.SQS();
const AWS_ACCOUNT = process.env.ACCOUNT_ID;
const queue_url = `https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT}/MyDLQQueue`;
const QUEUE_URL = `https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT}/MyQueue`;


// let messageCount = 0;
const recvCount = process.env.MAX_RETRY;


module.exports.sqsConsume = async (event) => { 

    const { Records } = event;
    
    let random = Math.random();

    if(random <= 0.7 || Records.length == 0){
        console.log("Success");
        console.log(JSON.stringify(Records));
        return;
    }

    for(let i=0;i<Records.length ;i++) {
        let receipt = Records[i].receiptHandle;
        let retries = Records[i].messageAttributes.reAtempts.stringValue;

        if(retries < recvCount)  {
            const sendparams = {
                DelaySeconds: Backoff(retries),
                QueueUrl: QUEUE_URL,
                MessageBody:Records[i].body,
                MessageAttributes: {
                    reAtempts: {
                        DataType: "String",
                        StringValue: (1 + parseInt(retries)).toString()
                    }
                }
            }
            const reSend = await SQS.sendMessage(sendparams).promise();
            const deleteParams = {
                QueueUrl: QUEUE_URL,
                ReceiptHandle: receipt,
            }
                // deleting message from sqs
            const Delete = await SQS.deleteMessage(deleteParams).promise();
            console.log("resend", JSON.stringify(reSend));
            console.log("Delete", JSON.stringify(Delete));
        }
    else{
        const sendParams = {
            QueueUrl: queue_url,
            MessageBody:Records[i].body
        }
        const send = await SQS.sendMessage(sendParams).promise();
        console.log(send);
        throw new Error("Failed after 3 retries");
    }
}
throw new Error("Failed to process");
};



//     var params = {
//         QueueUrl: QUEUE_URL, 
//         ReceiptHandle: receipt,
//         VisibilityTimeout: parseInt(Backoff(retries)) 
//     };
//     console.log(JSON.stringify(params));
//     let check = await SQS.changeMessageVisibility(params).promise();
//     console.log(check);
// }
// else{
//     