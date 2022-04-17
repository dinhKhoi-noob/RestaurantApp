const AWS = require("aws-sdk");
const { S3_BUCKET_REGION, IAM_ACCESS_ID, IAM_SECRET_KEY } = process.env;
AWS.config.update({ region: S3_BUCKET_REGION });

const s3 = new AWS.S3({
    accessKeyId: IAM_ACCESS_ID,
    secretAccessKey: IAM_SECRET_KEY,
});

module.exports = s3;
