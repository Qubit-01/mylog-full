export const appId = "102099147";
export const appKey = "RnwueATZXHm23pNh";
export const redirectURI = "https://mylog.cool/login/qq-redirect?q=1"; // 可以自己加参数

/**
 * 用户身份的唯一标识。
 * 保存在服务器和用户绑定，以便用户下次登录时可对应到其之前的身份信息，不需要重新授权。
 */
type OpenId = string;
/**
 * 当前用户在此网站的登录状态与授权信息，保存在客户端。有有效时间
 */
type AccessToken = string;

/**
 * 自己写的QQConnect jssdk类型声明
 * @see https://wiki.connect.qq.com/js_sdk使用说明
 */
export interface QQConnect {
  /**
   * API列表 https://wiki.connect.qq.com/api列表
   * @param api	  必须，调用的OpenAPI名称。如：“add_t”。
   * @param paras	必须，调用的OpenAPI对应的参数。各参数使用JSON的键值对格式列出。参见API列表。注意：此处参数不需要自行传递access_token与openid
   * @param fmt	  可选，OpenAPI的返回格式，值为“json”或“xml”。默认“json”。注意为小写，否则将不识别。
   * @param method	可选，请求的发起方式，值为“GET”或“POST”。根据配置，默认发送数据为“POST”，获取数据为“GET”。
   */
  api: (
    api: Api | string,
    paras?: any,
    fmt?: "json" | "xml",
    method?: "GET" | "POST"
  ) => Request;
  /**
   * 其他公开方法
   */
  Login: {
    /**
     * 登出，无参无返
     */
    signOut: () => void;
    /**
     * 检查是否已经登录
     * @return 布尔值
     */
    check: () => boolean;
    /**
     * 获取用户标识 openId 和 accessToken
     * 注意：getMe方法只能在用户登录授权后调用，建议总是在使用check方法并返回true的条件下，调用getMe方法
     * @param fun function(openId, accessToken)
     * @returns void
     */
    getMe: (fun: (openId: OpenId, accessToken: AccessToken) => void) => void;
    /**
     * 直接打开窗口
     * @param obj appId 应用id，redirectURI 重定向地址
     * @returns void
     */
    showPopup: (obj: { appId: string; redirectURI: string }) => void;
    /**
     * 在控制台翻到的，文档没写的
     * fillUserInfo: ƒ(t,e)
     * reset: ƒ()
     * insertButton: ƒ s(n)
     */
    [k: string]: any;
  };
  [k: string]: any;
}

/**
 * API的字符串列表
 * @see https://connect.qq.com/sdk/webtools/index.html
 */
type Api =
  // 微博接口 =======
  // 发表一条微博信息到腾讯微博 POST https://graph.qq.com/t/add_t
  // 发表一条微博信息（纯文本）到腾讯微博平台上。注意连续两次发布的微博内容不可以重复。
  | "add_t"
  // 获取腾讯微博登录用户的用户资料。
  | "get_info"
  // 获取用户在QQ空间的个人资料（仅支持网站调用）空间的昵称、头像信息及黄钻信息
  | "get_user_info"
  // 用户在财付通的收货地址
  // 获取财付通用户的收货地址。 一个用户可能设置了多条收货地址信息。查询的用户必须为财付通用户，否则查询将返回失败。
  | "get_tenpay_addr";

/**
 * JS SDK在初始化时会根据浏览器环境创建不同的请求代理，QC.api的每次调用都是一个Request对象。
 *
 * 调用时序为success/error -> complete，每个方法都可以调用多次，每次调用返回Request本身，支持链式调用。
 * resp参数为回调函数，回调函数参数为Response对象。
 */
interface Request {
  /**
   * 请求完成并且返回码为0的回调
   * @param resp 回调函数，参数为Response对象
   */
  success: (resp: (res: Response) => void) => void;
  /**
   * 请求完成并且返回码不为0的回调。
   * @param resp 回调函数，参数为Response对象
   * @returns
   */
  error: (resp: (res: Response) => void) => void;
  /**
   * 请求完成后的回调。
   * @param resp 回调函数，参数为Response对象
   * @returns
   */
  complete: (resp: (res: Response) => void) => void;
}

/**
 * Response为Request对象绑定的回调函数的返回参数，
 * 每次QC.api调用的异步响应都会返回一个Response对象，
 * 该对象在Request对象的success/error -> complete调用流程中传递。
 */
interface Response {
  /**
   * 返回该Response对象包含的数据体的文本串。
   */
  stringifyData: () => string;
  /**
   * 响应状态，-1：代表未知；404：响应错误；200：响应成功。
   */
  status: number;
  /**
   * 响应数据格式，json/xml。
   */
  fmt: "json" | "xml";
  /**
   * 响应返回码，0为成功，其他为失败。
   */
  code: number;
  /**
   * 响应返回码，0为成功，其他为失败。
   */
  ret: number;
  /**
   * 响应数据实体，json对象/xml对象。
   */
  data: any;
  /**
   * 响应序号，从1000开始编号。
   */
  seq: number;
}

const QC = (import.meta.env.SSR ? undefined : window.QC) as QQConnect;

// https://graph.qq.com/oauth2.0/show?which=Login&display=pc&client_id=100490701&redirect_uri=https%3A%2F%2Fwww.zhihu.com%2Foauth%2Fcallback%2Fqqconn%3Faction%3Dlogin%26from%3D&response_type=code&scope=get_info%2Cget_user_info%2Cget_other_info%2Cadd_t%2Cadd_pic_t%2Cget_fanslist%2Cget_idollist%2Cadd_idol%2Cadd_share

// https://sicau.xyz/#/user#
// access_token=999C7469F6EB04273E89921CE76AB237 &
// expires_in=7776000 &
// state=wdnmd

// 获取用户信息
// myQC.getUserInfo = () => {
//   QC.api(
//     'get_user_info',
//     {
//       // oauth_consumer_key: myQC.APPID,
//       // access_token:'',
//       // openid:'',
//       // format:'json',
//     },
//     fmt,
//     method
//   ).success(res => {
//     console.log(res)
//     // qqInfo.value = res.data
//   })
// }

export default QC;

/**
 * 有跨域限制
 * @see https://wiki.connect.qq.com/unionid介绍
 * @param params
 * @returns
 */
// export const getMe = (params: {
//   access_token: string
//   unionid?: number
//   fmt?: 'jsonpb' | 'json'
// }): Promise<any> => {
//   return request({
//     url: 'https://graph.qq.com/oauth2.0/me',
//     method: 'post',
//     params: {
//       fmt: 'json',
//       ...params,
//     },
//   })
// }
