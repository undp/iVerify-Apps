export interface CrowdtangleClientConfigEndpoints {
    posts: string;
    lists: string;
}

export interface CrowdtangleClientConfig {
    apiBase: string;
    endpoints: CrowdtangleClientConfigEndpoints;
    apiKey: string;
}
