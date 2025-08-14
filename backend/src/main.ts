import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { json, raw } from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
    });

    app.use(cookieParser());

    app.use(
      '/stripe/webhook',
      raw({
        type: 'application/json',
        verify: (req: any, res, buf) => {
          if (buf && buf.length) {
            req.rawBody = buf; 
          }
        },
      }),
    );

    app.use(json());

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

    await app.listen(5000);
}
bootstrap();