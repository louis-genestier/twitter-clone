import * as dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error('No .env found !');
}

export default {
  port: parseInt(`${process.env.PORT}`, 10) || 3000,
  api: {
    prefix: '/v1/api',
  },
  jwtSecret: `${process.env.JWT_SECRET}`,
  jwtExpiration: '7 days',
};
