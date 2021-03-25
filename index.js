const Client=require('pg').Pool
const client=new Client({
    host:"mydatabase.cmvpye9gdenq.us-east-1.rds.amazonaws.com",
    port:5432,
    user:"postgres",
    password:"Passw0rd",
    database:"postgres"
});
const AWS = require('aws-sdk');
var s3 = new AWS.S3();
const parser = require('lambda-multipart-parser');

// exports.handler = async (event) => {
//         // TODO implement
//         return new Promise(async(reslove,reject)=>{
//           await client.query("select * from customer",(error,response)=>{
//                 return reslove({
//                 body:JSON.stringify(response.rows)
//             });
//           });
//         });
//     };

    exports.handler = async (event, context, callback) => {
         const result = await parser.parse(event);
  console.log(result.files);
  console.log(result)
   
     var filePath = "avatars/" + result.files[0].filename
      var params = {
      "Body": result.files[0].content,
      "Bucket": "customerimagedata",
      "Key": filePath,  
      'Content-Type': 'binary/octet-stream' ,
     
   };
   await s3.upload(params, function(err, data){
    if(err) {
        callback(err, null);
    } else {
        let response = {
     "statusCode": 200,
     "headers": {
         "my_header": "multipart/form-data"
     },
     "body": JSON.stringify(data),
    //  "isBase64Encoded": false
 };
        callback(null, response);
 }
 }).promise();
            // TODO implement
            
            // const { files }=result.files;
            return new Promise(async(reslove,reject)=>{
              await client.query("insert into customer(cust_name,cust_email,cust_password,cust_mno,cust_image) values($1,$2,$3,$4,$5)",[result.cust_name,result.cust_email,result.cust_password,result.cust_mno,result.cust_image],(error,response)=>{
                    return reslove({
                    body:JSON.stringify("Added")
                });
              });
            });
        };