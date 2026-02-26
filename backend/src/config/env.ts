import dotenv from 'dotenv';

dotenv.config();

export type UserRole = 'ADMIN' | 'DEALER';

export const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  databaseUrl:
    process.env.DATABASE_URL ||
    'mysql://auction_user:auction_pass@localhost:3306/auction_db',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
};

