import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import {CfnDBSubnetGroup} from "@aws-cdk/aws-rds";

export default function createVPC(ref:cdk.Stack) {

    const vpc = new ec2.Vpc(ref, "WPVpc", {
        cidr: '10.0.0.0/16',
    });
    const dbSecurityGroup = new ec2.SecurityGroup(ref, "SGAuroraDB", {
        vpc: vpc,
        description: 'SGAuroraDB'
    });
    const subnetIds: string[] = [];
    vpc.privateSubnets.forEach((subnet) => {
        subnetIds.push(subnet.subnetId);
    });

    const dbSubnetGroup: CfnDBSubnetGroup = new CfnDBSubnetGroup(ref, 'WPSubnetGroup', {
        dbSubnetGroupDescription: 'WPSubnetGroup',
        dbSubnetGroupName: 'wp-subnet-group',
        subnetIds
    });

    return {vpc, dbSubnetGroup, dbSecurityGroup }
}
