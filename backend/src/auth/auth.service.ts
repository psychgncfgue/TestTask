import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, Provider } from '../DTO/register.dto';
import { RefreshTokenService } from '../refreshTokens/refresh.token.service';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from './email.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private redisService: RedisService,
    private emailService: EmailService,
  ) { }
  

  async validateUser(login: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmailOrUsername(login, login);
    if (!user || !user.password) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return null;
    }
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '60s' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.refreshTokenService.create(user.id, refreshToken);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: await this.userService.findById(user.id),
    };
  }

  async sendPasswordResetCode(userId: number): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.setPasswordResetCode(userId, code)
    await this.emailService.sendPasswordResetCode(user.email, code);
  }

  async resetPassword(
    userId: number,
    code: string,
    newPassword: string
  ): Promise<void> {
    const expected = await this.redisService.getPasswordResetCode(userId);
    if (!expected || expected !== code) {
      throw new UnauthorizedException('Invalid reset code');
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userService.updatePassword(userId, hashed);
    await this.redisService.delPasswordResetCode(userId);
  }

  async oauthLogin(
    provider: Provider,
    email: string,
    providerId: string,
    providerAccessToken: string,
    providerRefreshToken: string,
  ) {
    const user = await this.userService.findByProviderAndProviderId(provider, providerId);

    if (user) {
      const payload = { email: user.email, sub: user.id };
      const accessToken = this.jwtService.sign(payload, { expiresIn: '60s' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      await this.refreshTokenService.create(user.id, refreshToken);

      await this.redisService.setProviderRefreshToken(providerId, providerRefreshToken);
      await this.redisService.setProviderAccessToken(providerId, providerAccessToken);

      return { access_token: accessToken, refresh_token: refreshToken, user };
    } else {
      const newUser = await this.userService.create({
        email,
        provider,
        providerId,
        username: email.split('@')[0],
      });

      const payload = { email: newUser.email, sub: newUser.id };
      const accessToken = this.jwtService.sign(payload, { expiresIn: '60s' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      await this.refreshTokenService.create(newUser.id, refreshToken);

      await this.redisService.setProviderRefreshToken(providerId, providerRefreshToken);
      await this.redisService.setProviderAccessToken(providerId, providerAccessToken);
      return { access_token: accessToken, refresh_token: refreshToken, user: newUser };
    }
  }

  async checkAuthTokens(accessToken: string, refreshToken: string): Promise<{
    isAuthenticated?: boolean;
    newAccessToken?: string;
    error?: string;
    status?: number;
    clearCookies?: boolean;
  }> {
    const decoded = this.jwtService.decode(refreshToken);
    const userId = decoded?.sub;

    if (!userId) {
      return { error: 'Invalid refresh token payload', status: 400 };
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      return { error: 'User not found', status: 404 };
    }

    const provider = user.provider as Provider;
    const providerId = user.providerId;

    if (provider === Provider.LOCAL) {
      const isAccessTokenValid = await this.verifyAccessToken(accessToken);
      if (isAccessTokenValid) {
        return { isAuthenticated: true };
      }

      if (refreshToken) {
        const newAccessToken = await this.refreshToken(refreshToken);
        if (newAccessToken) {
          return { isAuthenticated: true, newAccessToken };
        }
        return { error: 'Failed to refresh access token', status: 401 };
      }

      return { error: 'Access token is invalid, and no refresh token found', status: 401 };
    }

    if (provider === Provider.GOOGLE || provider === Provider.APPLE) {
      if (!providerId) {
        return { error: 'Missing providerId in user record', status: 400 };
      }

      const providerAccessToken = await this.redisService.getProviderAccessToken(providerId);
      const providerRefreshToken = await this.redisService.getProviderRefreshToken(providerId);

      if (!providerRefreshToken) {
        return { error: 'Provider tokens are missing', status: 400 };
      }

      let currentProviderAccessToken = providerAccessToken;
      let isProviderAccessTokenValid = false;

      if (currentProviderAccessToken) {
        isProviderAccessTokenValid = await this.verifyProviderToken(provider, currentProviderAccessToken);
      }

      if (!isProviderAccessTokenValid) {
        const newProviderAccessToken = await this.refreshProviderAccessToken(provider, providerRefreshToken);
        if (!newProviderAccessToken) {
          await this.refreshTokenService.delete(user.id);
          await this.redisService.delProviderRefreshToken(providerId);
          await this.redisService.delProviderAccessToken(providerId);
          return {
            error: 'Failed to refresh provider access token',
            status: 401,
            clearCookies: true,
          };
        }

        await this.redisService.setProviderAccessToken(providerId, newProviderAccessToken);
        currentProviderAccessToken = newProviderAccessToken;
        isProviderAccessTokenValid = true;
      }

      const isAccessTokenValid = await this.verifyAccessToken(accessToken);

      if (isAccessTokenValid) {
        return { isAuthenticated: true };
      }

      if (refreshToken && isProviderAccessTokenValid) {
        const newAccessToken = await this.refreshToken(refreshToken);
        if (newAccessToken) {
          return { isAuthenticated: true, newAccessToken };
        }
        return { error: 'Failed to refresh access token', status: 401 };
      }
      return { error: 'Access token is invalid, and no refresh token found', status: 401 };
    }
    return { error: 'Invalid provider', status: 400 };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      const user = await this.userService.findById(decoded.sub);

      if (!user || !(await this.refreshTokenService.validate(user.id, refreshToken))) {
        throw new NotFoundException('User not found or invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign({ email: user.email, sub: user.id }, { expiresIn: '60s' });
      return newAccessToken;
    } catch (e) {
      console.log('Ошибка в refreshToken', e);
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, username, password, provider, phone, country } = registerDto;

    const existingUser = await this.userService.findByEmailOrUsername(email, username);
    if (existingUser) {
      throw new ConflictException('Email или Username уже существуют');
    }
    const hashed = bcrypt.hash(password!, 10);
    const confirmationToken = this.jwtService.sign({ email, username, hashed, provider, phone, country }, { expiresIn: '1h' });

    await this.emailService.sendConfirmationEmail(email, confirmationToken);

    return {
      message: 'Письмо с подтверждением отправлено на вашу почту',
    };
  }

  async confirmEmailToken(token: string): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('Неверный или просроченный токен');
    }

    const { email, username, password, provider, phone, country } = payload as {
      email: string;
      username: string;
      password: string;
      provider: Provider;
      phone?: string;
      country?: string;
    };

    if (await this.userService.findByEmail(email)) {
      throw new ConflictException('Email уже подтверждён');
    }

    let user: User;
    try {
      const hashed = await bcrypt.hash(password, 10);
      user = await this.userService.create({
        email,
        username,
        password: hashed,
        provider,
        phone,
        country,
      });
    } catch (e: any) {
      if (e.code === '23505') {
        throw new ConflictException('Пользователь с таким email уже существует');
      }
      throw new InternalServerErrorException('Ошибка при создании пользователя');
    }

    const jwtPayload = { email: user.email, sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(jwtPayload, { expiresIn: '60s' });
    const refreshToken = this.jwtService.sign(jwtPayload, { expiresIn: '7d' });

    await this.refreshTokenService.create(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  }

  async logout(refreshToken: string): Promise<boolean> {
    const decoded = this.jwtService.decode(refreshToken) as { sub?: string | number } | null;
    const sub = decoded?.sub;
    if (sub === undefined || sub === null) {
      return false;
    }

    const userId = typeof sub === 'string' ? Number(sub) : sub;
    if (!Number.isInteger(userId)) {
      return false;
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      return false;
    }

    await this.refreshTokenService.delete(userId);
    const provider = user.provider;
    const providerId = user.providerId;
    if (providerId && provider !== Provider.LOCAL) {
      const provRefresh = await this.redisService.getProviderRefreshToken(providerId);
      if (provRefresh) {
        if (provider === Provider.GOOGLE) {
          await this.revokeGoogleToken(provRefresh);
        } else if (provider === Provider.APPLE) {
          await this.revokeAppleToken(provRefresh);
        }
      }
      await this.redisService.delProviderAccessToken(providerId);
      await this.redisService.delProviderRefreshToken(providerId);
    }

    return true;
  }

  async verifyAccessToken(accessToken: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(accessToken);
      const user = await this.userService.findById(decoded.sub);

      if (!user) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  async getUserFromAccessToken(accessToken: string) {
    const decoded = this.jwtService.verify(accessToken);
    const user = await this.userService.findById(decoded.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /////////////////////// Отзывы токенов провайдера при разлогине пользователя, вошедшего через провайдера

  private async revokeGoogleToken(token: string) {
    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/revoke?token=${token}`,
        { method: 'POST' }
      );
      if (!response.ok) {
        console.error('Failed to revoke Google token');
      } else {
        console.log('Google token successfully revoked');
      }
    } catch (error) {
      console.error('Error revoking Google token:', error);
    }
  }

  private async revokeAppleToken(token: string) {
    try {
      const response = await fetch(`https://appleid.apple.com/auth/revoke?token=${token}`, {
        method: 'POST',
      });
      if (!response.ok) {
        console.error('Failed to revoke Apple token');
      } else {
        console.log('Apple token successfully revoked');
      }
    } catch (error) {
      console.error('Error revoking Apple token:', error);
    }
  }

  /////////////// Методы проверки валидности access_token провайдера

  async verifyProviderToken(provider: Provider, token: string): Promise<boolean> {
    switch (provider) {
      case Provider.GOOGLE:
        return this.verifyGoogleToken(token);
      default:
        return false;
    }
  }

  async verifyGoogleToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
      const data = await response.json();
      return response.ok && !!data.expires_in;
    } catch (error) {
      console.error('Google token validation failed:', error);
      return false;
    }
  }

  ///////////////// Методы обновления access_token провайдера при помощи refresh_token провайдера

  async refreshProviderAccessToken(provider: Provider, refreshToken: string): Promise<string | null> {
    switch (provider) {
      case Provider.GOOGLE:
        return this.refreshGoogleAccessToken(refreshToken);
      case Provider.APPLE:
        return this.refreshAppleAccessToken(refreshToken);
      default:
        return null;
    }
  }

  async refreshGoogleAccessToken(refreshToken: string): Promise<string | null> {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        body: JSON.stringify({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.error('Google token refresh failed');
        return null;
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error refreshing Google access token:', error);
      return null;
    }
  }

  async refreshAppleAccessToken(refreshToken: string): Promise<string | null> {
    return null;
  }
}