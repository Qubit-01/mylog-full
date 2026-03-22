import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

/** 统一异常体里可能出现的字段 */
type ErrorBody = {
  code?: unknown;
  statusCode?: unknown;
  message?: unknown;
  data?: unknown;
};

const normalizeException = (exception: unknown) => {
  const raw = exception instanceof HttpException ? exception.getResponse() : exception;
  const body = typeof raw === 'object' && raw !== null ? (raw as ErrorBody) : null;

  return {
    code:
      typeof body?.code === 'number'
        ? body.code
        : typeof body?.statusCode === 'number'
          ? body.statusCode
        : HttpStatus.INTERNAL_SERVER_ERROR,
    message: Array.isArray(body?.message)
      ? String(body.message[0] ?? '请求失败')
      : typeof body?.message === 'string'
        ? body.message
        : exception instanceof Error
          ? exception.message
          : typeof raw === 'string'
            ? raw
            : '服务器内部错误',
    data:
      body?.data ??
      (exception instanceof Error
        ? {
            name: exception.name,
            stack: exception.stack ?? null,
            cause: exception.cause ?? null,
          }
        : body ?? (typeof raw === 'string' ? { raw } : raw ?? null)),
  };
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  /**
   * 把所有异常统一整理成 { code, message, data }
   *
   * 约定：
   * 1. 客户端永远收到 HTTP 200
   * 2. 真正的成功失败看 payload.code
  * 3. 如果异常本身没有明确业务 code，一律按 500 处理
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    // 项目约定：客户端永远收到 HTTP 200，真正的失败信息放在 payload.code 里。
    response.status(HttpStatus.OK).json(normalizeException(exception));
  }
}
