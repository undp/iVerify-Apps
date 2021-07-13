export interface Token {
  token_type?: string;
  // expires_in?: number;
  accessToken?: string;
  refreshToken?: string;
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
