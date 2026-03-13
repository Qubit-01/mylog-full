import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** 统一成功响应体 */
export interface ApiResult<T = unknown> {
  code: number;
  message: string;
  data: T | null;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResult<T>>
{
  /**
   * 只处理“正常返回”的数据流
   * 如果控制器里抛了异常，会直接走全局异常过滤器，不会进入这里
   */
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResult<T>> {
    return next.handle().pipe(
      map((data) => ({
        // 成功响应统一包装，前端始终按 code/message/data 解包
        code: 0,
        message: '',
        data: data ?? null,
      })),
    );
  }
}
