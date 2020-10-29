import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import createASG from "./asg";
import ecs = require('@aws-cdk/aws-ecs');


export default function createEcsCluster(ref:cdk.Stack, vpc:ec2.Vpc, securityGroup: ec2.SecurityGroup, port:number) {
    const {asg} = createASG(ref, vpc, securityGroup, port)

    const cluster = new ecs.Cluster(ref, "WPCluster", {
        vpc: vpc
    });

    cluster.addAutoScalingGroup(asg);
    cluster.connections.addSecurityGroup(securityGroup)


    return {cluster}
}
