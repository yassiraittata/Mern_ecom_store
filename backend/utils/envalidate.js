import dotenv from "dotenv";
import { cleanEnv, port, str, url } from "envalid";
dotenv.config();

const env = cleanEnv(process.env, {
  PORT: port(),
  MONGO_URI: str().url(),
});

export default env;
