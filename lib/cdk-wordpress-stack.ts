import ecs = require('@aws-cdk/aws-ecs');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');
import cdk = require('@aws-cdk/core');
import createVPC from './vpc'
import createEFS from "./efs";
import createEcsCluster from "./cluster";
import createAuroraDB from "./aurora";
import {ApplicationLoadBalancedEc2ServiceProps} from "@aws-cdk/aws-ecs-patterns";

export class CdkWordpressStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const {vpc, dbSubnetGroup, dbSecurityGroup } = createVPC(this)

    const auroraProps = {
      port: 3306,
      scalingConfiguration: {
        autoPause: true,
        maxCapacity: 2,
        minCapacity: 1,
        secondsUntilAutoPause: 600
      },
      databaseName: 'wordpress',
      masterUsername: 'wordpress',
      masterUserPassword: 'wordpress',
    }

    const {auroraEndpoint} = createAuroraDB(this, dbSecurityGroup, dbSubnetGroup, auroraProps)


    const {cluster} = createEcsCluster(this, vpc, dbSecurityGroup, auroraProps.port)

    const ecsProps: ApplicationLoadBalancedEc2ServiceProps = {
      cluster,
      memoryLimitMiB: 1024,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('wordpress'),
        environment: {
          WORDPRESS_DB_HOST: auroraEndpoint + ":3306",
          WORDPRESS_DB_USER: auroraProps.masterUsername,
          WORDPRESS_DB_PASSWORD: auroraProps.masterUserPassword,
          WORDPRESS_DB_NAME: auroraProps.databaseName,
        },
      },
      desiredCount: 2,
    }
    new ecs_patterns.ApplicationLoadBalancedEc2Service(this, 'Service', ecsProps);

    const {efsMounted} = createEFS(this, vpc, dbSecurityGroup )

    // TODO: automatically connect EFS
    console.log(efsMounted.fileSystemId)

  }
}
