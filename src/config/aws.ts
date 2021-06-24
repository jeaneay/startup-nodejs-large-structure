import aws from 'aws-sdk';

aws.config.update({
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: process.env.S3_ACCESS_REGION,
});

const s3 = new aws.S3();

export { s3 };
