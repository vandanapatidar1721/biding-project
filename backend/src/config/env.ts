import dotenv from 'dotenv';

dotenv.config();

export type UserRole = 'ADMIN' | 'DEALER';

// required env vars -----------------------------------------------------------
if (!process.env.DATABASE_URL) {
  throw new Error('Missing required environment variable DATABASE_URL');
}
if (!process.env.REDIS_URL) {
  console.warn('WARNING: REDIS_URL not set; continuing without redis.');
}

export const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  databaseUrl: process.env.DATABASE_URL!,
  redisUrl: process.env.REDIS_URL || '',
};

