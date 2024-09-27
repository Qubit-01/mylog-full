import * as ExifReader from 'exifreader'
// import EXIF from 'exif-js'

/**
 * 压缩图片
 * raw 6651136 6.35MB
 * 95 1500686 1.43MB
 * 20 80343 78.45KB
 * @param file 压缩文件
 * @param rate 压缩率，默认0.2
 * @returns
 */
export function compressImg(file: File, rate = 0.2): Promise<File> {
  function dataURLtoFile(dataurl: string, fileName: string) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)![1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], fileName, { type: mime })
  }

  let disposeFile = file

  // 如果是gif图片，不压缩
  if (file.type == 'image/gif') return Promise.resolve(file)

  if (Object.prototype.toString.call(file) === '[object Blob]') {
    disposeFile = new File([file], file.name, { type: file.type })
  }
  const read = new FileReader()
  // const fileSize = parseFloat(parseInt(disposeFile['size']) / 1048576).toFixed(
  //   2
  // )
  // 小于1m不压缩
  // if (fileSize < 1) return file;
  read.readAsDataURL(disposeFile)
  return new Promise((resolve, reject) => {
    try {
      read.onload = e => {
        const img = new Image()
        img.src = e.target!.result as string
        img.onload = function () {
          let w = Math.floor(img.width / 2)
          let h = Math.floor(img.height / 2)

          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          let base64
          canvas.setAttribute('width', w.toString())
          canvas.setAttribute('height', h.toString())
          ctx!.drawImage(img, 0, 0, w, h)
          // console.log(w, h);
          base64 = canvas.toDataURL(disposeFile['type'], rate)

          let overImg = dataURLtoFile(base64, disposeFile.name)
          // console.log("压缩完成，压缩前：" + file.size / 1048576 + " 压缩后：" + overImg.size / 1048576)
          resolve(overImg)
        }
      }
    } catch (error) {
      reject(disposeFile)
    }
  })
}

/**
 * 文件URL转 File, 输入url和文件名，，是异步操作
 * 返回File对象
 * @param url 资源统一定位符
 * @param fileName 文件名，不传则从url中获取
 * @returns File对象Promise
 */
export function getFileByUrl(url: string, fileName?: string): Promise<File> {
  return new Promise((resolve, reject) => {
    let _fileName = fileName || url.split('/').pop()!
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.setRequestHeader('Accept', 'image/png')
    xhr.responseType = 'blob'
    // 加载时处理
    xhr.onload = () => {
      // 获取返回结果
      let file = new File([xhr.response], _fileName, { type: 'image/png' })
      resolve(file)
    }
    xhr.onerror = reject
    // 发送
    xhr.send()
  })
}

/**
 * 在File类型基础上加入可选 exifdata 和 iptcdata 数据
 */
export interface ExifImgFile extends File {
  exifdata?: any
}

/**
 * 提取EXIF信息，写入文件属性中，并返回。如果错误，就写入空对象
 * 以前的exif-js太垃圾了，全是bug，现在换成了ExifReader
 * 目前要用到的信息有(这是手机上拍的，直接上传电脑的)
 * 信息项             exif-js                                     ExifReader.value
 * DateTimeOriginal  "2024:03:24 14:37:51"                       "2024:03:24 14:37:51" √
 * DateTime          "2024:03:24 14:37:51"                       "2024:03:24 14:37:51" √
 * DateTimeDigitized "2024:03:24 14:37:51"                       "2024:03:24 14:37:51" √
 * GPSLongitude      [Number {121, numerator: 121, denominator: 1},   [[121, 1],[58, 1],[47064000, 10000000]]
 * 121.967974         Number {58, numerator: 58, denominator: 1},
 *                    Number {4.7064, numerator: 47064000, denominator: 10000000}]
 * GPSLatitude       [Number {30, numerator: 30, denominator: 1},   [[30, 1],[53, 1],[17412000, 10000000]]
 * 30.883817          Number {53, numerator: 53, denominator: 1},
 *                    Number {1.7412, numerator: 17412000, denominator: 10000000}
 * @see https://github.com/mattiasw/ExifReader
 * @param file
 * @return Promise<图片EXIF信息>
 */
export function getExif(file: File): Promise<ExifReader.Tags> {
  // 传入 File 对象或者 URL
  return ExifReader.load(file, { async: true }).then(tags => {
    // MakerNote标签可以非常大。如果您正在解析大量文件并保存标记，请删除它以降低内存使用
    delete tags['MakerNote']

    // 如果想提取缩略图，可以这样使用
    // if (tags['Thumbnail'] && tags['Thumbnail'].image) {
    //   const image = document.getElementById('thumbnail')
    //   image.classList.remove('hidden')
    //   image.src = 'data:image/jpg;base64,' + tags['Thumbnail'].base64
    // }
    ;(file as ExifImgFile).exifdata = tags
    console.log(tags)
    return tags
  })

  // @ts-ignore
  // window.n = 0 // exif-js 自身的bug修复
  // return new Promise((resolve, reject) => {
  //   try {
  //     // 回调没有输入
  //     EXIF.getData(file, () => {
  //       resolve(EXIF.getAllTags(file))
  //     })
  //   } catch (error) {
  //     reject(error)
  //   }
  // })
}

/**
 * 传入 ExifReader 读取的 exif 数据
 * @param lng 经度
 * @param lat 纬度
 * @returns GPS标准坐标
 */
export const getLnglatByExif = (
  lng: [[number, number], [number, number], [number, number]],
  lat: [[number, number], [number, number], [number, number]]
): [number, number] => {
  const lng1 = [
    lng[0][0] / lng[0][1],
    lng[1][0] / lng[1][1],
    lng[2][0] / lng[2][1],
  ]
  const lat1 = [
    lat[0][0] / lat[0][1],
    lat[1][0] / lat[1][1],
    lat[2][0] / lat[2][1],
  ]
  return [
    lng1[0] + lng1[1] / 60 + lng1[2] / 3600,
    lat1[0] + lat1[1] / 60 + lat1[2] / 3600,
  ]
}

// 传入URL，返回图片EXIF信息
export function getExifByURL(url: string): Promise<ExifReader.Tags> {
  // 传入 File 对象或者 URL
  return ExifReader.load(url, { async: true }).then(tags => {
    // MakerNote标签可以非常大。如果您正在解析大量文件并保存标记，请删除它以降低内存使用
    delete tags['MakerNote']

    // 如果想提取缩略图，可以这样使用
    // if (tags['Thumbnail'] && tags['Thumbnail'].image) {
    //   const image = document.getElementById('thumbnail')
    //   image.classList.remove('hidden')
    //   image.src = 'data:image/jpg;base64,' + tags['Thumbnail'].base64
    // }
    return tags
  })
}
