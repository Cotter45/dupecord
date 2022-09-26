require('dotenv').config();

export const config = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8000,
  db: process.env.DATABASE_URL,
  jwtConfig: {
    jwtSecret: process.env.SESSION_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  },
};
