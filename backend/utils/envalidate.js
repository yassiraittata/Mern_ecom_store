import dotenv from "dotenv";
import { cleanEnv, port } from "envalid";
dotenv.config();

const env = cleanEnv(process.env, {
  PORT: port(),
});

export default env;
