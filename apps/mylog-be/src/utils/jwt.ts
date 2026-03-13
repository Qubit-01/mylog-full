import JWT from 'jsonwebtoken';

type JwtExpiresIn = Parameters<typeof JWT.sign>[2]['expiresIn'];

// 从env中获取配置
const secretKey = process.env.SecretKey!;
const expiresIn = process.env.JwtExpiresIn! as JwtExpiresIn;

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
  return JWT.sign({ id }, secretKey, { expiresIn });
}

/**
 * 验证用户jwt，目前就只返回用户id
 * 如果传入预期外的数据或验证失败，会返回undefined
 * @param token 用户jwt
 * @returns 返回用户id，undefined表示验证失败
 */
export function verify(token: string): number | undefined {
  if (!token) return undefined;
  try {
    const tokenObj = JWT.verify(token, secretKey) as JwtPayload;
    return tokenObj.id;
  } catch (e) {
    console.log('🐔 Token验证失败, token: ', token);
    return undefined;
  }
}
