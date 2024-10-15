/**
 * 从后端获取数据类型，但是后端的类型是不完整的，需要进行改造
 * 如：json数据不会有详细的类型，日期也会为Date，我要转为Dayjs
 */
import PrismaClient  from "@mylog-full/mylog-trpc-prisma";
import dayjs from "dayjs";

type Modify<T, R> = Omit<T, keyof R> & R;

/**
 * Log的数据结构
 * 都必须有，但是可以为空数组
 */
// export type Log = Modify<
//   DbLog,
//   {
//     /** 发送时间 */
//     sendtime: dayjs.Dayjs;
//   }
// >;

/**
 * 对后端回传的log进行处理，其中的属性加工为前端需要的东西
 * sendtime、logtime
 * 日期要从 string 转为 dayjs
 */
export const handleLog = (log: any): Log => {
  const newLog: Log = {
    ...log,
    sendtime: dayjs(log.sendtime),
    logtime: dayjs(log.logtime),
  };
  return newLog;
};

// {
//   type: 'public' | 'log' | 'tag' | 'todo'
//   /** 发送时间 */
//   sendtime: dayjs.Dayjs;
//   /** 记录时间 */
//   logtime: dayjs.Dayjs;
//   info: {
//     sex?: "男" | "女" | undefined;
//     birth?: string; // 生日
//     text?: string; // 个性签名

//     stuId?: string; // 学号
//     stuClass?: string; // 班级
//   };
// };

// /**
//  * Log的数据结构
//  * 都必须有，但是可以为空数组
//  */
// export interface Log {
//   content: string
//   tags: string[]
//   imgs: string[]
//   videos: string[]
//   audios: string[]
//   files: string[]
//   location: [[number, number], string] | []
//   people?: string[]
//   info: {
//     title?: string // log的标题
//     link?: string // 爬虫数据的原始链接
//     markdown?: boolean // 是否是MD类型
//     source?: string // 爬虫数据的来源
//     todo?: {
//       complete: boolean // 是否完成
//       level: number // 优先级
//     }
//   }
// }
