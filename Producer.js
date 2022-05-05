'use strict';

const AWS = require('aws-sdk');
var SQS = new AWS.SQS();
const AWS_ACCOUNT = process.env.ACCOUNT_ID;
const QUEUE_URL = `https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT}/MyQueue`;



module.exports.sqsProduce= async (event) => {
  
  for (let i=0; i<10; i++) {
      await SQS.sendMessageBatch({ 
          Entries: flooder(),
          QueueUrl: QUEUE_URL,
        }).promise();
  }
  return 'done'
}

const flooder = () => {
  let entries = []
  for (let i=0; i<10; i++) {
      entries.push({
        Id: 'id'+parseInt(Math.random()*1000000),
        MessageBody: 'value'+ Math.random(),
      })
  }
  return entries
  }
  
