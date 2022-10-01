import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejsfunc from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3_notifications from 'aws-cdk-lib/aws-s3-notifications';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export interface SrcStackProps extends cdk.StackProps {

}

export class SrcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SrcStackProps) {
    super(scope, id, props);

    // Lambda
    const lambdaFunction = new nodejsfunc.NodejsFunction(this, "nodejs-func-20221001", {
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: path.join(__dirname, `/../lambda/index.ts`),
      handler: "handler",
      environment: {  // environment variables for Lambda function
        TEST_ENV: "HelloWorld!",
      },
      logRetention: cdk.aws_logs.RetentionDays.ONE_DAY,
    });

    // IAM Role
    const policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["ses:SendEmail", "ses:SendRawEmail"],
      resources: ["*"],
    });
    lambdaFunction.addToRolePolicy(policy); // attach role to Lambda

    // S3 (already created bucket) 
    const srcBucket = s3.Bucket.fromBucketArn(
      this,
      'src-bucket-20221001',
      'arn:aws:s3:::lambda-src-stack-20221001',
    );
    const dstBucket = s3.Bucket.fromBucketArn(
      this,
      'dst-bucket-20221001',
      'arn:aws:s3:::lambda-dst-stack-20221001',
    )
    // Lambda -> S3 アクセス許可
    srcBucket.grantReadWrite(lambdaFunction); 
    srcBucket.grantDelete(lambdaFunction);
    srcBucket.grantPut(lambdaFunction);
    dstBucket.grantReadWrite(lambdaFunction);
    dstBucket.grantDelete(lambdaFunction);
    dstBucket.grantPut(lambdaFunction);

    // S3 -> Lambda 通知（イベントトリガー）
    srcBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED_PUT,
      new s3_notifications.LambdaDestination(lambdaFunction),
    );

  }
}
