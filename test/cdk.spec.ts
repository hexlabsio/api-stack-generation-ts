import * as cdk from "aws-cdk-lib";
import {LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {CdkGenerator} from "../src/cdk";
import {Code, Runtime, Function} from "aws-cdk-lib/aws-lambda";
import {Duration} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";


describe('CDK Generator', () => {

    function testLambda(stack: cdk.Stack): Function {
        return new Function(stack, "ApiFunction", {
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromInline("console.log('test')"),
            handler: "index.handler",
            timeout: Duration.seconds(5),
            memorySize: 4096,
        });
    }

    it('should generate api with single resource and method', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'TestStack');
        const api = new RestApi(stack, 'TestApi');
        const lambda = testLambda(stack);
        const integration = new LambdaIntegration(lambda);
        CdkGenerator.apiFromPaths(api, integration, {'/test': {methods: ['GET']}});
        const template = Template.fromStack(stack);
        console.log(template.toJSON());
        template.hasResource("AWS::ApiGateway::RestApi", {});
        template.resourceCountIs("AWS::ApiGateway::Resource", 1);
        template.hasResource("AWS::ApiGateway::Resource",{
            Properties: {
                PathPart: "test",
            },
        });
    })
})