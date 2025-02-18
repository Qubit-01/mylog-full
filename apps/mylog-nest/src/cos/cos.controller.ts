import { Body, Controller, Post } from '@nestjs/common';
import { Userid } from 'src/utils';
import STS from 'qcloud-cos-sts';

// 配置参数
const configInit = {
  /* 固定密钥 */
  secretId: process.env.CosSecretId!,
  secretKey: process.env.CosSecretKey!,
  proxy: '',
  /* 临时密钥有效时长，秒 */
  durationSeconds: Number(process.env.CosDurationSeconds!),
  // host: 'sts.tencentcloudapi.com', // 域名，非必须，默认为 sts.tencentcloudapi.com
  endpoint: 'sts.tencentcloudapi.com', // 域名，非必须，与host二选一，默认为 sts.tencentcloudapi.com

  // 放行判断相关参数
  bucket: process.env.CosBucket!,
  region: process.env.CosRegion!,
  /**
   * 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径
   * 例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
   */
  allowPrefix: 'null',
  // 简单上传和分片，需要以下的权限，其他权限列表请看 https://cloud.tencent.com/document/product/436/31923
  allowActions: [
    'name/cos:*',
    // "name/cos:List*",
    // "name/cos:Get*",
    // "name/cos:Head*",
    // "name/cos:OptionsObject",

    // "name/cos:PutObject", //简单上传操作
    // "name/cos:PostObject", //表单上传对象、小程序上传
    // "name/cos:GetBucket", //获取对象
    // "name/cos:HeadBucket", //检索存储桶及其权限
    // "name/cos:DeleteBucket", //删除对象
    // 分块上传
    // "name/cos:InitiateMultipartUpload", // 初始化分块操作
    // "name/cos:ListMultipartUploads", // List 进行中的分块上传
    // "name/cos:ListParts", // List 已上传分块操作
    // "name/cos:UploadPart", // 上传分块操作
    // "name/cos:CompleteMultipartUpload", // 完成所有分块上传操作
    // "name/cos:AbortMultipartUpload", // 取消分块上传操作
  ],
};

/**
 * 对象存储服务
 * @see https://github.com/tencentyun/qcloud-cos-sts-sdk/tree/master/nodejs
 */
@Controller('cos')
export class CosController {
  /**
   * 获取cos凭证
   * @param userid 用户id
   * @returns cos凭证
   */
  @Post('get_credential')
  async getCredential(@Userid() userid: number, @Body() body: any) {
    // TODO 这里根据自己业务需要做好放行判断
    console.log('🐔', userid, body);
    if (!userid) return;

    const config = { ...configInit, allowPrefix: `users/${userid}/mylog/*` };
    // 获取临时密钥
    const [shortBucketName, appId] = config.bucket.split('-');

    // Statement statement = new Statement();
    // statement.setEffect("allow"); // 声明设置的结果是允许操作
    /**
     * 密钥的权限列表。必须在这里指定本次临时密钥所需要的权限。
     * 权限列表请参见 https://cloud.tencent.com/document/product/436/31923
     * 规则为 {project}:{interfaceName}
     * project : 产品缩写  cos相关授权为值为cos,数据万象(数据处理)相关授权值为ci
     * 授权所有接口用*表示，例如 cos:*,ci:*
     * 添加一批操作权限 :
     */
    // statement.addActions(new String[]{
    //         "cos:PutObject",
    //         // 表单上传、小程序上传
    //         "cos:PostObject",
    //         // 分块上传
    //         "cos:InitiateMultipartUpload",
    //         "cos:ListMultipartUploads",
    //         "cos:ListParts",
    //         "cos:UploadPart",
    //         "cos:CompleteMultipartUpload",
    //         // 处理相关接口一般为数据万象产品 权限中以ci开头
    //         // 创建媒体处理任务
    //         "ci:CreateMediaJobs",
    //         // 文件压缩
    //         "ci:CreateFileProcessJobs"
    // 视频截帧
    // ci:GenerateSnapshot
    // });

    /**
     * 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径
     * 资源表达式规则分对象存储(cos)和数据万象(ci)两种
     * 数据处理、审核相关接口需要授予ci资源权限
     *  cos : qcs::cos:{region}:uid/{appid}:{bucket}/{path}
     *  ci  : qcs::ci:{region}:uid/{appid}:bucket/{bucket}/{path}
     * 列举几种典型的{path}授权场景：
     * 1、允许访问所有对象："*"
     * 2、允许访问指定的对象："a/a1.txt", "b/b1.txt"
     * 3、允许访问指定前缀的对象："a*", "a/*", "b/*"
     *  如果填写了“*”，将允许用户访问所有资源；除非业务需要，否则请按照最小权限原则授予用户相应的访问权限范围。
     *
     * 示例：授权examplebucket-1250000000 bucket目录下的所有资源给cos和ci 授权两条Resource
     */
    // statement.addResources(new String[]{
    //         "*",
    //         // "qcs::cos:ap-chongqing:uid/1250000000:examplebucket-1250000000/*",
    //         // "qcs::ci:ap-chongqing:uid/1250000000:bucket/examplebucket-1250000000/*"
    // });

    // 把一条 statement 添加到 policy，可以添加多条
    // Policy policy = new Policy();
    // policy.addStatement(statement);
    // // 将 Policy 示例转化成 String，可以使用任何 json 转化方式，这里是本 SDK 自带的推荐方式
    // config.put("policy", Jackson.toJsonPrettyString(policy));

    const policy = {
      version: '2.0',
      statement: [
        {
          action: config.allowActions,
          effect: 'allow',
          principal: { qcs: ['*'] },
          resource: [
            `qcs::cos:${config.region}:uid/${appId}:prefix//${appId}/${shortBucketName}/${config.allowPrefix}`,
          ],
          // condition生效条件，关于 condition 的详细设置规则和COS支持的condition类型可以参考https://cloud.tencent.com/document/product/436/71306
          // 'condition': {
          //   // 比如限定ip访问
          //   'ip_equal': { 'qcs:ip': '10.121.2.10/24' }
          // }
        },
      ],
    };

    return await new Promise((resolve) => {
      STS.getCredential(
        {
          secretId: config.secretId,
          secretKey: config.secretKey,
          proxy: config.proxy,
          durationSeconds: config.durationSeconds,
          endpoint: config.endpoint,
          policy: policy,
        },
        function (err, tempKeys) {
          resolve(err || tempKeys);
        },
      );
    });
  }
}
