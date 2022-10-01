import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3_notifications from 'aws-cdk-lib/aws-s3-notifications';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import * as path from 'path';

export class SrcStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // S3
    const srcBucket = s3.Bucket.fromBucketArn(this, "src-bucket", "arn:aws:s3:::lambda-src-stack-20221001");
    const dstBucket = s3.Bucket.fromBucketArn(this, "dst-bucket", "arn:aws:s3:::lambda-dst-stack-20221001");

    // Lambda
    const lambdaFunction = new NodejsFunction(this, "lambda-20221001", {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: path.join(__dirname, `/../lambda/main.ts`),
      environment: { TEST: "Hello World!", },
      logRetention: RetentionDays.ONE_DAY,
    });

    // S3 -> Lambda event trigger
    srcBucket.addEventNotification(s3.EventType.OBJECT_CREATED_PUT, new s3_notifications.LambdaDestination(lambdaFunction));

    // Lambda -> S3 access
    srcBucket.grantDelete(lambdaFunction);
    srcBucket.grantReadWrite(lambdaFunction);
    dstBucket.grantReadWrite(lambdaFunction);
    dstBucket.grantPut(lambdaFunction);

    // Lambda -> SES access
    lambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["ses:SendEmail", "ses:SendRawEmail",],
      resources: ["*"],
    }));
  }
}
