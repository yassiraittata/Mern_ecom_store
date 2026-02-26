import dotenv from "dotenv";
import { cleanEnv, port, str } from "envalid";
dotenv.config();

const env = cleanEnv(process.env, {
  PORT: port(),
  MONGO_URI: str(),
  REDIS_URL: str(),
  ACCESS_TOKEN_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
  STRIPE_SECRET_KEY: str(),
  FRONTEND_URL: str(),
});

export default env;
