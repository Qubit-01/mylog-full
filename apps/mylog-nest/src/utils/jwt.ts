import jwt from 'jsonwebtoken';

// 从env中获取配置
const secretKey = process.env.JwtSecretKey!;
const expiresIn = process.env.JwtExpiresIn!;

/** JwtPayload类型 */
type JwtPayload = {
  /** 用户id */
  id: number;
  /** 签发时间 */
  iat: number;
  /** 到期时间 */
  exp: number;
};

/**
 * 签发用户jwt，参数都是从env中获取
 * 目前感觉，token只需要带个id就行
 * @param id 用户id
 * @returns 用户jwt
 */
export function sign(id: number): string {
  return jwt.sign({ id }, secretKey, { expiresIn });
}

/**
 * 验证用户jwt，目前就只返回用户id，没有就抛出异常
 * @param token 用户jwt
 * @returns 返回用户id，0表示验证失败
 */
export function verify(token: string): number {
  try {
    const tokenObj = jwt.verify(token, secretKey) as JwtPayload;
    return tokenObj.id;
  } catch (e) {
    throw new Error('token验证失败' + e);
  }
}
