'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');
var SQS = new AWS.SQS();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const AWS_ACCOUNT = process.env.ACCOUNT_ID;
const QUEUE_URL = `https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT}/MyQueue`;


//Lambda 1
 // Produce message
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


  //lambda 2
  //consume message
let messageCount = 0
module.exports.sqsConsume = async (event) => { 

  const recvCount = process.env.maxReceiveCount;
  

  try{
        let random = Math.random();
      // Record number of messages received
          if (event.Records) {
              messageCount += event.Records.length
          }
      //error logic
          if (random > 0.5) {
            const err = new Error('Im an error2!')
            throw err
        }
          console.log('Message Count: ', messageCount)
          console.log(JSON.stringify(event))
  }

  catch(err) {
        //backoff logic
          let count = 0;
          count++;
          if(count <= recvCount){
            let jitter = Math.floor((Math.random() * 60) + 1);
            let backoff = Math.pow(2, count) + 30 + jitter; 
          
            let reciept = event.Records.receiptHandle;
            var params = {
              QueueUrl: QUEUE_URL, 
              ReceiptHandle: reciept,
              VisibilityTimeout: parseInt(backoff) 
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

//lambda 3
//Save failed messages to DynamoDB
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




  
