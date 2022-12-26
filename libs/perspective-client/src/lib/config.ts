export interface PerspectiveConfigEndpoints {
    analyze: string;
}

export interface PerspectiveConfig {
    apiBase: string;
    apiKey: string;
    analyzeEndpoint: string;
    endpoints: PerspectiveConfigEndpoints;
}
