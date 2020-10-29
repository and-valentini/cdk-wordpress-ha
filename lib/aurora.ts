import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import {CfnDBCluster, CfnDBSubnetGroup} from "@aws-cdk/aws-rds";
import {CfnOutput} from "@aws-cdk/core";

type PropsType = {
    port:number,
    databaseName: string,
    masterUsername: string,
    masterUserPassword: string,
    scalingConfiguration: {
        autoPause: boolean,
        maxCapacity:number,
        minCapacity: number,
        secondsUntilAutoPause: number
    }
}

export default function createAuroraDB(
    ref:cdk.Stack,
    securityGroup: ec2.SecurityGroup,
    subnetGroup: CfnDBSubnetGroup,
    props: PropsType
) {
    const aurora = new CfnDBCluster(ref, 'WPAuroraDB', {
        dbClusterIdentifier: 'wp-aurora-serverless',
        engine: 'aurora',
        engineMode: 'serverless',
        dbSubnetGroupName: subnetGroup.dbSubnetGroupName,
        vpcSecurityGroupIds: [securityGroup.securityGroupId],
        ...props
    });
    //wait for subnet group to be created
    aurora.addDependsOn(subnetGroup);

    const auroraEndpoint = aurora.attrEndpointAddress

    new CfnOutput(ref, 'WPAuroraEndPoint', {
        value: auroraEndpoint
    });
    return {auroraEndpoint}
}
