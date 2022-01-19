export type PathDefinition = {
    methods?: string[];
    security?: {
        [method: string]: {
            scopes?: string[];
        }
    }
    paths?: {[route: string]: PathDefinition}
}

export type PathsDefinition = {
    [route: string]: PathDefinition
}