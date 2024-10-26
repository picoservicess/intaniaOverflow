import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '../config.env' });

console.log('DATABASE_URL:', process.env.DATABASE_URL);
