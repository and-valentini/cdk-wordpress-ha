#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CdkWordpressStack } from '../lib/cdk-wordpress-stack';

const app = new cdk.App();
new CdkWordpressStack(app, 'CdkWordpressEcsStack');
