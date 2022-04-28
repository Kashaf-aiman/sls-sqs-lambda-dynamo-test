'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');
var SQS = new AWS.SQS();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const AWS_ACCOUNT = process.env.ACCOUNT_ID;
const QUEUE_URL = `https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT}/MyQueue`;


 // Flood SQS Queue
module.exports.hello= async (event) => {
  for (let i=0; i<10; i++) {
      await SQS.sendMessageBatch({ Entries: flooder(), QueueUrl: QUEUE_URL }).promise()
  }
  return 'done'
}
const flooder = () => {
  let entries = []
  for (let i=0; i<10; i++) {
      entries.push({
        Id: 'id'+parseInt(Math.random()*1000000),
        MessageBody: 'value'+Math.random()
      })
  }
  return entries
  }

let counter = 1
let messageCount = 0
let funcId = 'id'+parseInt(Math.random()*1000)

//consume message

module.exports.sqsConsume = async (event) => {
    // Record number of messages received
    const random = Math.random();
    
    if (event.Records) {
        messageCount += event.Records.length
    }

    if (random > 0.5) {
      const err = new Error('Im an error!')
      throw err
  }
    console.log(funcId + ' REUSE: ', counter++)
    console.log('Message Count: ', messageCount)
    console.log(JSON.stringify(event))
    // return 'done'
};


module.exports.saveDynamo = async (event) => {
  try{
    const { Records } = event;
    const body = Records[0].body;
    console.log("incoming message body from SQS: ",body);
    const params = {
      TableName: process.env.DYNAMODB_DLQ_TABLE,
      Item: {
        id: uuid.v1(),
        Value: body,
        updatedAt: new Date().getTime()  
      }
    };
    await dynamoDb.put(params).promise();

    console.log('Successfully written to DynamoDB');
  }
  catch(error){
    console.error('Error in executing lambda handler from SQS', error);
    return;
  }
};




  
