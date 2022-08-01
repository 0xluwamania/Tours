import dotenv from 'dotenv';
dotenv.config()


export const DB = process.env.DATABASE;
export const jwtSecret = process.env.JWT_SECRET
export const jwtExpire = process.env.JWT_EXPIRES_IN
