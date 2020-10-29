import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import autoscaling = require('@aws-cdk/aws-autoscaling');
import ecs = require('@aws-cdk/aws-ecs');


export default function createASG(ref:cdk.Stack, vpc:ec2.Vpc, securityGroup: ec2.SecurityGroup, port:number) {

    const asg = new autoscaling.AutoScalingGroup(ref, 'WPEcsInstances', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
        machineImage: new ecs.EcsOptimizedAmi(),
        updateType: autoscaling.UpdateType.REPLACING_UPDATE,
        desiredCapacity: 2,
        vpc,
    });
    asg.connections.allowTo(securityGroup, ec2.Port.tcp(port))

    return {asg}

}
