import { createClient } from 'redis';

let client = null;
let unavailable = false;

export const getRedis = async () => {
  if (unavailable) return null;
  if (client?.isOpen) return client;

  const url = process.env.REDIS_URL;
  if (!url) return null;

  try {
    client = createClient({
      url,
      socket: {
        connectTimeout: 2000,
        reconnectStrategy: () => false,
      },
    });

    client.on('error', () => {});

    await client.connect();
    console.log('Redis connected successfully');
    return client;
  } catch (error) {
    unavailable = true;
    client = null;
    console.warn('Redis unavailable, continuing without cache:', error.message);
    return null;
  }
};

export const cacheGet = async (key) => {
  const redis = await getRedis();
  if (!redis) return null;
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
};

export const cacheSet = async (key, value, ttlSeconds = 300) => {
  const redis = await getRedis();
  if (!redis) return;
  await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
};

export const cacheDel = async (key) => {
  const redis = await getRedis();
  if (!redis) return;
  await redis.del(key);
};
