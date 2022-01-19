import {Integration, IRestApi, Method, MethodOptions, ResourceOptions, IResource} from "aws-cdk-lib/aws-apigateway";
import {PathDefinition, PathsDefinition} from "./index";

export interface Resources {
    resource: IResource;
    methods: Method[];
    children: Resources[];
}

export class CdkGenerator {
    static apiFromPaths(restApi: IRestApi, integration: Integration, paths: PathsDefinition, options?: (resource: string) => ResourceOptions | undefined, methodOptions?: (resource: string, method: string) => MethodOptions | undefined): Resources[] {
        return Object.keys(paths).map(path => CdkGenerator.apiFromPath('', restApi.root, integration, path, paths[path], options, methodOptions));
    }

    private static apiFromPath(parents: string, parent: IResource, integration: Integration, part: string, paths: PathDefinition, options?: (resource: string) => ResourceOptions | undefined, methodOptions?: (resource: string, method: string) => MethodOptions | undefined): Resources {
        const resourcePath = `${parents}${part}`;
        const partName = part.substring(1);
        const resource = parent.addResource(partName, options?.(resourcePath));
        const methods = paths.methods?.map(method => resource.addMethod(method.toUpperCase(), integration, methodOptions?.(resourcePath, method.toUpperCase()))) ?? [];
        const children = Object.keys(paths.paths ?? {}).map(child => CdkGenerator.apiFromPath(resourcePath, resource, integration, child, paths.paths![child], options, methodOptions));
        return {resource, methods, children};
    }
}