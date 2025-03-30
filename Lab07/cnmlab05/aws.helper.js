require("dotenv").config();
const AWS = require("aws-sdk");

AWS.config.update({
    region: process.env.REIGON,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const dyamodb = new AWS.DynamoDB.DocumentClient();

module.exports = { dyamodb };
