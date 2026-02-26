import { createClient } from "redis";

export type RedisClient = ReturnType<typeof createClient>;

export async function makeRedisClient(url: string) {
  const client = createClient({ url });

  client.on("error", (err) => {
    console.error("Redis error:", err);
  });

  await client.connect();
  return client;
}
