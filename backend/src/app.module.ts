import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { typeOrmConfig } from './config/typeorm.config';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { WebsocketModule } from './websocket/websocket.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/orders.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UserModule,
    ScheduleModule.forRoot(),
    RedisModule,
    WebsocketModule,
    ProductModule,
    OrderModule,
    ThrottlerModule.forRoot({
      throttlers: [{ limit: 5, ttl: 60 }],
    }),
  ],
})
export class AppModule { }