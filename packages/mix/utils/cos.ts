import COS from 'cos-js-sdk-v5'
import { Bucket, Region, BucketCDN } from './constant'
import dayjs from 'dayjs'
// import type { LogFiles } from '@/types'
import { downloadFile } from '.'

/**
 * 获取临时密钥接口 API
 * @param data log要是json字符串
 * @returns 新建log的id
 */
const getCredential = (data?: { token?: string }): Promise<any> => {
  return fetch('cos/get_credential', {
    method: 'get',
    // params: { token: Global.token, ...data }, // todo 接入fetch访问
  })
}

// const cos = new COS({
//   /**
//    * 异步获取临时密钥 getAuthorization 必选参数
//    * 初始化时不会调用，只有调用 cos 方法（例如 cos.putObject）时才会进入
//    * @param options
//    * @param callback
//    */
//   getAuthorization: function (options, callback) {
//     getCredential().then(data => {
//       if (!data) {
//         console.error('credentials invalid:\n' + JSON.stringify(data, null, 2))
//         return
//       }

//       callback({
//         TmpSecretId: data.credentials.tmpSecretId,
//         TmpSecretKey: data.credentials.tmpSecretKey,
//         SecurityToken: data.credentials.sessionToken,
//         // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
//         StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
//         ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
//       })
//     })
//   },
// })

// export default cos

let index = 1 // 文件名的索引
/**
 * 获取文件Key封装，要记得自己给index++，不然会一直是0
 * @param filename 文件名
 * @param index 文件索引
 * @returns 文件不重复的Key
 */
export const getKey = (filename: string) =>
  `${dayjs().format('YYMMDD_HHmmss')}_${index++}-${filename}`

/**
 * 从files对象中，取出cos文件对象
 * @param files 文件对象
 */
// export const getCosFiles = (files: LogFiles): COS.UploadFileItemParams[] => {
//   const cosFiles: COS.UploadFileItemParams[] = []

//   // 大压缩图、95压缩图、原图。大压缩图必发，95压缩图和原图选择性发送
//   // 目前先实现发 大压缩图＋原图
//   for (const file of files.imgs) {
//     cosFiles.push({
//       // 原图
//       Bucket,
//       Region,
//       Key: `${cosPath()}imgs/${file.key}`,
//       Body: file.raw!,
//     })
//     cosFiles.push({
//       // 大压缩图
//       Bucket,
//       Region,
//       Key: `${cosPath()}compress-imgs/${file.key}`,
//       Body: file.compressImg!,
//     })
//   }
//   for (const file of files.videos) {
//     cosFiles.push({
//       Bucket,
//       Region,
//       Key: `${cosPath()}videos/${file.key}`,
//       Body: file.raw!,
//     })
//   }
//   for (const file of files.audios) {
//     cosFiles.push({
//       Bucket,
//       Region,
//       Key: `${cosPath()}audios/${file.key}`,
//       Body: file.raw!,
//     })
//   }
//   for (const file of files.files) {
//     cosFiles.push({
//       Bucket,
//       Region,
//       Key: `${cosPath()}files/${file.key}`,
//       Body: file.raw!,
//     })
//   }

//   return cosFiles
// }

/**
 * 返回如 users/[userid]/mylog/
 * @param userid 要插入其中的用户id，如果不传用当前用户id
 * @returns 返回链接字符串
 */
export const cosPath = (userid: number) => `users/${userid}/mylog/`

/**
 * 处理文件地址
 * 若是http开头，就转https然后直接用
 * 否则加上OOS地址 `${BucketCDN}${cosPath(userid)}${prefix}${file}`
 * @param file 可以传入单个字符串，或者字符串数组
 * @param prefix 一般是文件类型 如 img/
 * @returns 不改变log的源数据，只返回新的数组
 */
export const toFileUrl = <T extends string | string[]>(
  file: T,
  prefix: string = '',
  userid: number,
): T => {
  if (Array.isArray(file)) {
    return file.map((f) => toFileUrl(f, prefix, userid)) as T
  } else {
    // 处理单个字符串的逻辑
    return file.indexOf('http') !== 0
      ? (`${BucketCDN}${cosPath(userid)}${prefix}${file}` as T)
      : (file.replace('http://', 'https://') as T)
  }
}

// 获取文件列表
// cos.getBucket(
//   {
//     Bucket,
//     Region,
//     Prefix: 'note-imgs/',
//     Marker: 'note-imgs/230513_0143-26-BIT08355.jpg',
//     // note-imgs/1666848767959-1.jpg
//     // note-imgs/230513_0143-26-BIT08355.jpg

//   },
//   function (err, data) {
//     a = data.Contents.map(i => i.Key)
//     console.log(a)
//   }
// )

// 复制对象到
//   cos.putObjectCopy(
//     {
//       Bucket,
//       Region,
//       Key: 'users/1/mylog/imgs/' + CopySource.split('/')[1],
//       // https://bit-1310383539.cos.ap-chengdu.myqcloud.com/web-files/README.md
//       // CopySource:
//       //   'bit-1310383539.cos.ap-chengdu.myqcloud.com/' + CopySource, // note-imgs/1666848261375-0.jpg
//       /* CopySource中的Key含中文时，需要自行转义 */
//       CopySource: `bit-1310383539.cos.ap-chengdu.myqcloud.com/${encodeURIComponent(CopySource)}`,
//     },
//     function (err, data) {
//       console.log(CopySource)
//       console.log(err || data)
//     }
//   )
// }

/**
 * 自己封装的文件上传方法
 * 如果传入空files，就直接返回一个成功的Promise
 * @param params 文件上传参数，{files[]文件对象列表，SliceSize? 触发分块的大小，onProgress? 进度条方法}
 * @returns Promise 所有文件上传完成调用then
 */
// export const myUploadFiles = (
//   params: COS.UploadFilesParams
// ): Promise<COS.UploadFilesResult> => {
//   return new Promise((resolve, reject) => {
//     // 没有文件，直接返回成功
//     if (params.files.length === 0) return resolve({ files: [] })
//     cos.uploadFiles(
//       {
//         SliceSize: 1024 * 1024 * 5,
//         onProgress: function (info) {
//           var percent = info.percent * 100
//           var speed = info.speed / 1024
//           console.log('进度：' + percent + '%; 速度：' + speed + 'KB/s')
//         },
//         ...params,
//       },
//       (err, data) => {
//         // 所有上传完成后的回调
//         if (err) reject(err)
//         resolve(data)
//       }
//     )
//   })
// }

/**
 * 自己封装的文件删除方法
 * @param objects 传入形如 { Key: '1.jpg' } 的数组
 */
// export const myDeleteFiles = (
//   Objects: { Key: string }[]
// ): Promise<COS.DeleteMultipleObjectResult> => {
//   return new Promise((resolve, reject) => {
//     // 没有文件直接返回成功
//     if (Objects.length === 0) return resolve({ Deleted: [], Error: [] })
//     cos.deleteMultipleObject(
//       {
//         Bucket,
//         Region,
//         Objects,
//       },
//       (err, data) => {
//         if (err) reject(err)
//         resolve(data)
//       }
//     )
//   })
// }

/**
 * 获取文件下载链接，默认有效期60s
 * 并且加入了下载时重命名，window.open(downloadUrl)
 * （推荐使用 window.open()方式）这里是新窗口打开 url，如果需要在当前窗口打开，可以使用隐藏的 iframe 下载，或使用 a 标签 download 属性协助下载
 * 未来要做个还原文件名的功能，但是现在COS里面文件名不统一
 * @param Key 文件在cos中的key
 * @param download 是否触发下载
 * @returns
 */
// export const myGetObjectUrl = (
//   Key: string,
//   download: boolean = true
// ): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     cos.getObjectUrl(
//       {
//         Bucket,
//         Region,
//         Key,
//         Sign: true,
//         Expires: 600, // 单位秒
//       },
//       (err, data) => {
//         if (err) return reject(err)
//         else {
//           // 补充强制下载的参数
//           let url =
//             data.Url +
//             (data.Url.indexOf('?') > -1 ? '&' : '?') +
//             'response-content-disposition=attachment'
//           // 可拼接 filename 来实现下载时重命名myname就是文件名
//           const filename = Key.substring(
//             Key.indexOf('-', Key.lastIndexOf('/')) + 1
//           )
//           // downloadUrl += `;filename=${filename}` // url会进行中文转码，不适用
//           if (download) downloadFile(url, filename)
//           resolve(url)
//         }
//       }
//     )
//   })
// }
