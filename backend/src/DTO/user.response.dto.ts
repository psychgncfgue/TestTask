import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose() id: number;
  @Expose() username: string;
  @Expose() email: string;
  @Expose() isTwoFactorEnabled: boolean;
  @Expose() avatarUrl?: string;
  @Expose() phone?: string;
  @Expose() country?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}