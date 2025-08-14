import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UserModule } from '../user/user.module';
import * as dotenv from 'dotenv';
import {RefreshTokenModule} from "../refreshTokens/refresh.token.module";
import { RedisModule } from '../redis/redis.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from './email.service';
dotenv.config();

@Module({
    imports: [
        UserModule,
        RefreshTokenModule,
        ScheduleModule.forRoot(),
        RedisModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '30s' },
        }),
    ],
    providers: [AuthService, JwtStrategy, LocalStrategy, EmailService],
    controllers: [AuthController],
    exports: [AuthService, EmailService],
})
export class AuthModule {}