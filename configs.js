require('dotenv').config(); 
module.exports = {
  db: {
    user:process.env.DB_USER,
    password : procces.env.DB_PASSWORD,
    name:procces.env.BD_NAME,
    host:procces.env.DB_HOST,
    port:process.env.DB_PORT,
    dialect:process.env.DB_DIALECT,
    poolsize:process.env.DB_POOL_SIZE || 30,

  },
  port: parseInt(process.env.PORT) || 4000,
  auth: {
    accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
    refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
    accessTokenExpiresInSeconds: process.env.ACCESS_TOKEN_EXPIRES_IN_SECONDS,
    refreshTokenExpiresInSeconds: process.env.REFRESH_TOKEN_EXPIRES_IN_SECONDS,
    google:{}
  },
  redis:{},
  domain:proccess.env.DOMAIN,
  isProduction: proccess.env.NODE_ENV=== "production"

};
