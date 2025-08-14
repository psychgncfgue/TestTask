import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly redisService: RedisService) {}

  async create(userId: number, token: string): Promise<void> {
    const hashedToken = await bcrypt.hash(token, 10);
    const redisKey = `local-refresh-token:${userId}`;

    await this.redisService.setLocalRefreshToken(redisKey, hashedToken, 7 * 24 * 60 * 60);
  }

  async validate(userId: number, token: string): Promise<boolean> {
    const redisKey = `local-refresh-token:${userId}`;
    const storedToken = await this.redisService.getLocalRefreshToken(redisKey);

    if (!storedToken) {
      return false;
    }

    return await bcrypt.compare(token, storedToken);
  }

  async delete(userId: number): Promise<void> {
    const redisKey = `local-refresh-token:${userId}`;
    await this.redisService.delLocalRefreshToken(redisKey);
  }
}