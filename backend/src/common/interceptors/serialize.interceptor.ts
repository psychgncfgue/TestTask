import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable,
    UseInterceptors,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { plainToInstance } from 'class-transformer';
  
  @Injectable()
  export class SerializeInterceptor<T> implements NestInterceptor {
    constructor(private dto: new (...args: any[]) => T) {}
  
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<T> | Promise<Observable<T>> {
      return next.handle().pipe(
        map(data =>
          plainToInstance(this.dto, data, { excludeExtraneousValues: true }),
        ),
      );
    }
  }
  
  export function Serialize<T>(dto: new (...args: any[]) => T) {
    return UseInterceptors(new SerializeInterceptor(dto));
  }