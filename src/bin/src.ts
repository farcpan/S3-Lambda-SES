import * as cdk from 'aws-cdk-lib';
import { SrcStack } from '../lib/src-stack';

const app = new cdk.App();
const id = "srcstack-20221001";
new SrcStack(app, id, {});