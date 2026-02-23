import Redis from "ioredis";
import env from "../utils/envalidate.js";

export const redis = new Redis(env.REDIS_URL);