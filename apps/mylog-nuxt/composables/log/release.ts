import type { LogEdit } from "@mylog-full/mix/types"


export const useLogRelease = () => {
    const logEdit = reactive<LogEdit>({
        type: 'log',
        content: '',
    })


    return {
        logEdit,
    }
}