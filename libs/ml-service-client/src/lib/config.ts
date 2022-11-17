export interface MlServiceConfigEndpoints {
    analyze: string;
}

export interface MlServiceConfig {
    apiBase: string;
    endpoints: MlServiceConfigEndpoints;
}
