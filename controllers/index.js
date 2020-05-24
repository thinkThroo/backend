const commonResponse = require('../utils/common-response');
var aws = require('aws-sdk');
require('dotenv').config(); // Configure dotenv to load in the .env file
const uuidv4 = require('uuid/v4'); // I chose v4 ‒ you can select others

// console.log("process.env.AWSAccessKeyId:", process.env.AWSAccessKeyId);

// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
    region: 'us-east-2', // Put your aws region here
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey
})

const S3_BUCKET = process.env.bucket

let {
    successRes,
    failureRes
} = commonResponse;

exports.upload_file = function (req, res) {

    const s3 = new aws.S3();  // Create a new instance of S3
    // let fileName = new Date()+req.body.fileName;
    let fileName = uuidv4(); // '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
    const fileType = req.body.fileType;
    // fileName = fileName.replace(/ /g,"_");
    // console.log("fileName", fileName, "fileType", fileType);
    // Set up the payload of what we are sending to the S3 api
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 500,
        ContentType: fileType,
        ACL: 'public-read'
    };
    // Make a request to the S3 API to get a signed URL which we can use to upload our file
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ ...failureRes, msg: err })
            return;
        }
        // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved. 
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
        // Send it all back
        res.status(200).json({ ...successRes, data: { ...returnData } });
    });

}