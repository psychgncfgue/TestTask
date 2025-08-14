import { Controller, Post, Body, Request, UseGuards, Res, Req, Get, Param, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException, HttpCode, HttpStatus, UnauthorizedException, HttpException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Provider, RegisterDto } from '../DTO/register.dto';
import { Response, Request as ExpressRequest, Express } from 'express';
import { LoginDto } from '../DTO/login.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserResponseDto } from '../DTO/user.response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService,) { }

  private setCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 1000,
      path: '/',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
    return {
      message: `Письмо с подтверждением отправлено на email: ${registerDto.email}`,
    };
  }

  @Post('confirm-email')
  @HttpCode(HttpStatus.OK)
  @Serialize(UserResponseDto)
  async confirmEmail(
    @Body('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.confirmEmailToken(token);
    this.setCookies(res, accessToken, refreshToken);
    return user;
  }

  @Post('oauth/:provider')
  @Serialize(UserResponseDto)
  async oauthLogin(
    @Param('provider') provider: Provider,
    @Body()
    oauthData: {
      email: string;
      providerId: string;
      providerAccessToken: string;
      providerRefreshToken: string;
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.oauthLogin(
        provider,
        oauthData.email,
        oauthData.providerId,
        oauthData.providerAccessToken,
        oauthData.providerRefreshToken,
      );
    this.setCookies(res, access_token, refresh_token);
    return user;
  }

  @UseGuards(ThrottlerGuard, LocalAuthGuard)
  @Throttle({
    default: {
      limit: 5,
      ttl: 60,
    },
  })
  @Post('login')
  @Serialize(UserResponseDto)
  async login(
    @Body() dto: LoginDto,
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.login(req.user);
    this.setCookies(res, access_token, refresh_token);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new BadRequestException('No refresh token in cookies');
    }

    const ok = await this.authService.logout(refreshToken);
    if (!ok) {
      throw new HttpException('Logout failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    return { message: 'Successfully logged out' };
  }

  @Get('check')
  async checkAuth(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException('No tokens found');
    }

    const result = await this.authService.checkAuthTokens(
      accessToken,
      refreshToken,
    );

    if (result.error) {
      if (result.clearCookies) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
      }
      throw new HttpException(result.error, result.status || 500);
    }

    if (result.newAccessToken) {
      this.setCookies(res, result.newAccessToken, refreshToken);
      return {
        isAuthenticated: true,
        accessToken: result.newAccessToken,
      };
    }

    return { isAuthenticated: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserResponseDto)
  getCurrentUser(@Req() req: ExpressRequest) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/enable')
  @HttpCode(HttpStatus.OK)
  async enableTwoFactor(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user
    if (!user?.id) {
      throw new UnauthorizedException();
    }
    const updated = await this.userService.enableTwoFactor(user.id);
    if (!updated.isTwoFactorEnabled) {
      throw new InternalServerErrorException(
        'He удалось включить двухфакторную аутентификацию',
      );
    }
    return {
      ok: true,
      message: 'Two-factor authentication enabled',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/disable')
  @HttpCode(HttpStatus.OK)
  async disableTwoFactor(
    @Req() req,
    @Body('password') password: string,
  ) {
    const payload = req.user
    if (!payload?.id) {
      throw new UnauthorizedException();
    }
    const updated = await this.userService.disableTwoFactor(payload.id, password);
    if (updated.isTwoFactorEnabled) {
      throw new InternalServerErrorException(
        'Не удалось отключить двухфакторную аутентификацию',
      );
    }
    return {
      ok: true,
      message: 'Two-factor authentication disabled',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async sendResetCode(@Request() req) {
    const user = req.user
    try {
      await this.authService.sendPasswordResetCode(user.id);
    } catch (err) {
      throw new InternalServerErrorException(
        'Не удалось отправить код на почту. Попробуйте позже.'
      );
    }
    return { message: 'Код отправлен на вашу почту' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password-confirm')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Req() req,
    @Body('code') code: string,
    @Body('newPassword') newPassword: string
  ) {
    const user = req.user
    try {
      await this.authService.resetPassword(user.id, code, newPassword);
    } catch (err) {
      if (
        err instanceof UnauthorizedException ||
        err instanceof NotFoundException
      ) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Не удалось изменить пароль. Попробуйте позже.'
      );
    }
    return { message: 'Пароль успешно изменён' };
  }
}