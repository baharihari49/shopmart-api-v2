// Mock Redis client for development when Redis is not available
const mockRedisClient = {
  connect: async () => Promise.resolve(),
  disconnect: async () => Promise.resolve(),
  quit: async () => Promise.resolve(),
  setEx: async (key: string, seconds: number, value: string) => Promise.resolve('OK'),
  get: async (key: string) => Promise.resolve(null),
  del: async (key: string) => Promise.resolve(0),
  on: (event: string, handler: Function) => mockRedisClient,
};

// Use mock client for development
const redisClient = mockRedisClient;

export default redisClient;