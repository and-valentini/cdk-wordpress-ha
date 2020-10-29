import cdk = require('@aws-cdk/core');
import {CfnFileSystem, CfnMountTarget} from "@aws-cdk/aws-efs";
import {CfnOutput} from "@aws-cdk/core";
import ec2 = require('@aws-cdk/aws-ec2');


export default function createEFS(ref:cdk.Stack, vpc: ec2.Vpc, securityGroup: ec2.SecurityGroup) {
    const efs = new CfnFileSystem(ref, 'WPEfs', {
        encrypted: true,
    });
    new CfnOutput(ref, 'EfsFileSystemId', {
        value: efs.getAtt('FileSystemId').toString()
    });

    const efsMounted = new CfnMountTarget(ref, 'EfsMount', {
        fileSystemId: efs.getAtt('FileSystemId').toString(),
        subnetId: vpc.privateSubnets[0].subnetId,
        securityGroups: [securityGroup.securityGroupId]
    });

    return {efsMounted}

}
