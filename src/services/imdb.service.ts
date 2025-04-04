let IMDBService: IMDBServiceType;
const TTL = 60; // 1 min (60 s)

interface IMDBServiceType {
  bootstrap(config: { uri: string }): Promise<void>;
  get(key: string): Promise<string | null>;
  setex(key: string, value: object | string, ttl: number): Promise<void>;
  del(key: string): Promise<void>;
  disconnect(): void;
}

async function bootstrap(service: IMDBServiceType, config: { uri: string }): Promise<void> {
  IMDBService = service;
  IMDBService.bootstrap(config);
}

async function get(key: string): Promise<string | null> {
  return IMDBService.get(key);
}

async function del(key: string): Promise<void> {
  IMDBService.del(key);
}


async function setex(key: string, value: object | string, ttl: number = TTL): Promise<void> {
  IMDBService.setex(key, JSON.stringify(value), ttl);
}

function disconnect(): void {
  IMDBService.disconnect();
}

export default {
  bootstrap,
  get,
  setex,
  del,
  disconnect
};
