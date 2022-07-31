import type { Redis as RedisType, RedisOptions } from "ioredis";
import Redis from "ioredis";

let redis: RedisType;

declare global {
  var __redis: RedisType | undefined;
}

const redisOptions: RedisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the Redis with every change either.
if (process.env.NODE_ENV === "production") {
  redis = new Redis(REDIS_URL, redisOptions);
} else {
  if (!global.__redis) {
    global.__redis = new Redis(REDIS_URL, redisOptions);
  }
  redis = global.__redis;
}

export { redis };
