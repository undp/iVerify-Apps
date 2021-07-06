export interface Token {
  token_type?: string;
  expires_in?: number;
  access_token?: string;
  refresh_token?: string;
}

export interface TokenPayload {
  aud: string;
  exp: number;
  iat: number;
  jti: string;
  nbf: number;
  scopes?: string[];
  sub: string;
}
