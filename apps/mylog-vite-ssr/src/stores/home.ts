import { toLogVO4DTO } from '@mylog-full/utils';

/**
 * 要分页查询需要的数据项
 */
export interface PageStore {
  /** 真正显示的数据 */
  list: Log[];
  /** 请求参数 */
  params: { skip: number; limit: number };
  /** 加载状态 */
  loading: boolean;
  /** 是否还有数据 */
  noMore: boolean;
}

const useHomeStore = defineStore('home', () => {
  const logs = reactive<PageStore>({
    list: [],
    params: { skip: 0, limit: 10 },
    loading: true,
    noMore: false,
  });

  /**
   * 继续获取log数据
   * 如果noMore为真就pass，否则loading设为真，再去获取数据
   * 如果获取到数据不足limit个，则noMore设为真
   * 把数据放入list，skip+=limit，loading=false
   * @returns
   */
  const addLogs = async () => {
    if (logs.noMore) return;
    logs.loading = true;
    const data = await []; // trpc.log.getPublics.query(logs.params);
    if (data.length < logs.params.limit) logs.noMore = true;
    logs.list.push(...data.map(toLogVO4DTO));
    logs.params.skip += logs.params.limit;
    logs.loading = false;
  };

  return { logs, addLogs };
});

export default useHomeStore;
