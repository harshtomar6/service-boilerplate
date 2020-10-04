/**
 * Loading of environment variables and other configurations
 * 
 * @author - Harsh Tomar
 */

// Dependencies
import dotEnv from 'dotenv';
dotEnv.config();

const appConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3002,
  MONGO_URL: process.env.MONGO_URL,
  SECRET: process.env.SECRET,
}

export default appConfig;