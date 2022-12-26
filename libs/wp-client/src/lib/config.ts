export interface WpConfigEndpoints {
    posts?: string;
    tags?: string;
    categories?: string;
    media?: string;
    currentUser?: string;
}

export interface WpConfigAuthParams {
    username: string;
    password: string;
}

export interface WpConfig {
    WP_URL: string;
    apiBase: string;
    endpoints: WpConfigEndpoints;
    authParams: WpConfigAuthParams;
}
