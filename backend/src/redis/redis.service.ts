import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async setLocalRefreshToken(key: string, token: string, ttlSeconds?: number) {
    await this.redisClient.set(key, token);
    if (ttlSeconds) {
      await this.redisClient.expire(key, ttlSeconds);
    }
  }
  
  async getLocalRefreshToken(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }
  
  async delLocalRefreshToken(key: string) {
    await this.redisClient.del(key);
  }

  // ✅ Provider Refresh Token

  async setProviderRefreshToken(providerId: string, token: string, ttlSeconds?: number) {
    const key = `provider-refresh-token:${providerId}`;
    await this.redisClient.set(key, token);
    if (ttlSeconds) {
      await this.redisClient.expire(key, ttlSeconds);
    }
  }

  async getProviderRefreshToken(providerId: string): Promise<string | null> {
    const key = `provider-refresh-token:${providerId}`;
    return this.redisClient.get(key);
  }

  async delProviderRefreshToken(providerId: string) {
    const key = `provider-refresh-token:${providerId}`;
    await this.redisClient.del(key);
  }

  // ✅ Provider Access Token

  async setProviderAccessToken(providerId: string, token: string, ttlSeconds?: number) {
    const key = `provider-access-token:${providerId}`;
    await this.redisClient.set(key, token);
    if (ttlSeconds) {
      await this.redisClient.expire(key, ttlSeconds);
    }
  }

  async getProviderAccessToken(providerId: string): Promise<string | null> {
    const key = `provider-access-token:${providerId}`;
    return this.redisClient.get(key);
  }

  async delProviderAccessToken(providerId: string) {
    const key = `provider-access-token:${providerId}`;
    await this.redisClient.del(key);
  }

  async setPasswordResetCode(userId: number, code: string) {
    const key = `reset-password-code:${userId}`;
    await this.redisClient.set(key, code);
    await this.redisClient.expire(key, 5 * 60);
  }

  async getPasswordResetCode(userId: number): Promise<string | null> {
    const key = `reset-password-code:${userId}`;
    return this.redisClient.get(key);
  }

  async delPasswordResetCode(userId: number) {
    const key = `reset-password-code:${userId}`;
    await this.redisClient.del(key);
  }
}