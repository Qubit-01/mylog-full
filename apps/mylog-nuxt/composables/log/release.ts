import type { LogEdit } from "@mylog-full/mix/types"

export const useLogRelease = () => {
    const logEdit = reactive<LogEdit>({
        type: 'log',
        content: '',
    })

    const uploadInfo = reactive({
        percent: -1, // 上传进度
        speed: 0, // 上传速度 MB/s
    })

    const releaseLog = () => { }


    return {
        logEdit,
        uploadInfo,
        releaseLog,
    }
}