'use strict';
const AWS  = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({apiVersion:"2012-08-10"});
const postsTable = process.env.POSTS_TABLE;
const uuid  = require('uuid');
function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

function sortByDate(a,b){
  if (a.createdAt>b.createdAt) {
      return -1;

  }else return 1;

}
module.exports.createPost = (event,context,callback) => {
    const reqBody = JSON.parse(event.body)
    const post = {
      id:uuid(),
      createdAt:new Date().toISOString(),
      userId:1,
      title:reqBody.title,
      body:reqBody
    };
    return db.put({
      TableName:postsTable,
      Item:post
    }).promise().then(()=>{
      callback(null,response(201,post))
    }).catch(err=>response(null,response(err.statusCode,err)));
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};


module.exports.getAllPosts=(event,context,callback)=>{
    return db.scan({TableName:postsTable})
    .promise().then((res)=>{
        callback(null,response(200,res.Items.sort(sortByDate)))
    }).catch(err=>callback(null,response(err.statusCode,err))); 
}
