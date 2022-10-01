import * as cdk from 'aws-cdk-lib';
import { SrcStack, SrcStackProps } from '../lib/src-stack';

const app = new cdk.App();
const props: SrcStackProps = {};
const stackId = "srcstack-20221001";
// creation of stack
new SrcStack(app, stackId, props);
