import type { LogVO as Log } from '@mylog-full/mix/types'

export const useHomeStore = defineStore('home', () => {
  const params = reactive({ skip: 0, limit: 10 })
  const { data } = useFetch<Log[]>('https://mylog.cool:20914/user/get_user', {
    method: 'POST',
    body: params,
  })

  return {
    data,
  }
})
