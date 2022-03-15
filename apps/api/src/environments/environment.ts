export const environment = {
  production: false,
  tokenExpTime: 1200,
  refreshExpTime: 2400,
  JWTsecret: process.env.JWT_SECRET,
  JWTSecretRefreshToken: process.env.JWT_SECRET_TOKEN,
  ClientID: process.env.CLIENT_ID,
  ClientSecret: process.env.CLIENT_SECRET,
  redirect_uri: process.env.REDIRECT_URI,
  WordpressUrl: process.env.WP_URL,
  WPPassword: process.env.WP_PASSWORD
};