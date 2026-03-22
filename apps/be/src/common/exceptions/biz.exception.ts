import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 业务异常
 *
 * 项目约定所有响应都返回 HTTP 200，真正的成功失败由 body 中的 code 决定
 * 因此这里固定用 HttpStatus.OK，只把业务错误信息塞进响应体
 */
export class BizException extends HttpException {
  /**
   * @param code 业务错误码
   * @param message 给前端展示/判断的错误信息
   * @param data 可选附加数据，默认没有
   */
  constructor(code: number, message: string, data: unknown = null) {
    super({ code, message, data }, HttpStatus.OK);
  }
}
