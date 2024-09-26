<script setup lang="ts">
import type { LogFilter } from '@/types'
import useUserStore from '@/stores/user'
import useLogStore from '@/stores/log'
import { cloneDeep } from 'lodash'
import dayjs from 'dayjs'
import { getShare } from '@/api/log'
import { webURL } from '@/stores/constant'
import { writeClipboard } from '@/utils'

const mylog = useLogStore().mylog
const User = useUserStore()

const curFilter = ref(-1) // -1是全部，-2是自定义筛选
const diyFilter = reactive<LogFilter>({
  name: '',
  type: '',
  timeLimit: [null, null],
  isOrAll: true,
  content: { include: [], isOr: false },
  people: { include: [], isOr: false },
  tags: { include: [], isOr: false },
  exclude: [], // 不包括，填入noteI
})

// 这段数据应该从后端获取的
// 因为用户筛选项应该有先后顺序，所以用数组
const filters = toRef(User.setting.mylog, 'filters')

watch([curFilter, diyFilter], () => {
  console.log('curFilter', curFilter.value, filters.value[curFilter.value])
  if (curFilter.value === -1) mylog.setFilter(undefined)
  else if (curFilter.value === -2) mylog.setFilter(diyFilter)
  else mylog.setFilter(filters.value[curFilter.value])
})

watch(diyFilter.timeLimit, () => {
  // 判断时间先后
  if (
    diyFilter.timeLimit[0] &&
    diyFilter.timeLimit[1] &&
    dayjs(diyFilter.timeLimit[0]).diff(dayjs(diyFilter.timeLimit[1])) > 0
  ) {
    delete diyFilter.timeLimit[1]
    ElMessage('结束时间必须在开始时间之后哦！')
  }
})

/**
 * 添加自定义筛选
 */
const addFilter = () => {
  if (!diyFilter.name) {
    ElMessage('给你的过滤器取个名字哦')
    return
  }
  filters.value.push(cloneDeep(diyFilter))
  curFilter.value = filters.value.length - 1
}

/**
 * 删除当前预设
 */
const delFilter = () => {
  filters.value.splice(curFilter.value, 1)
  curFilter.value = -1
}

/**
 * 分享
 */
const shareLogs = async () => {
  const logIds = mylog.listFilter.map(log => log.id)
  try {
    await ElMessageBox.confirm(`确定要分享${logIds.length}条Log吗？`, '分享', {
      confirmButtonText: '分享',
      cancelButtonText: '取消',
      type: 'info',
    })
  } catch {
    return
  }
  getShare({ logIdsJson: JSON.stringify(logIds) }).then(link => {
    // 要进行url转义
    const url = `${webURL}/#/share?share=${encodeURIComponent(link)}`
    writeClipboard(url).then(() => {
      ElMessage({ message: '分享链接已经写入剪贴板', type: 'success' })
    })
  })
}
</script>

<template>
  <div class="log-filter">
    <div class="control-filter">
      <ElRadioGroup v-model="curFilter" size="small">
        <!-- size="large" -->
        <ElRadioButton label="全部" :value="-1" />
        <ElRadioButton v-for="(f, i) in filters" :label="f.name" :value="i" />
        <ElRadioButton label="自定义" :value="-2" />
      </ElRadioGroup>

      <ElButton size="small" @click="shareLogs"> 分享 </ElButton>
      <!-- 删除预设应当移动到设置页面 -->
      <!-- <ElButton v-if="curFilter >= 0" size="small" @click="delFilter"
        >删除此预设</ElButton
      > -->
    </div>

    <!-- {{ diyFilter }} -->
    <div v-if="curFilter === -2" class="diy-filter" v-m>
      <ElRow>
        记录类型：
        <ElRadioGroup size="small" v-model="diyFilter.type">
          <ElRadioButton label="全部" value="" />
          <ElRadioButton label="隐私" value="log" />
          <ElRadioButton label="公开" value="public" />
        </ElRadioGroup>
      </ElRow>
      <ElRow>
        时间限制：
        <ElDatePicker
          v-model="diyFilter.timeLimit[0]"
          type="date"
          placeholder="起始日期"
          size="small"
          :editable="false"
          style="width: 120px"
        />
        &nbsp;~&nbsp;
        <ElDatePicker
          v-model="diyFilter.timeLimit[1]"
          type="date"
          placeholder="结束日期"
          size="small"
          :editable="false"
          style="width: 120px"
        />
      </ElRow>

      <ElRow>
        <EditTags v-model="diyFilter.content.include" label="内容含有：">
          <ElSwitch
            v-model="diyFilter.content.isOr"
            size="small"
            inline-prompt
            active-text="或"
            inactive-text="和"
          />
        </EditTags>
      </ElRow>
      <ElRow>
        <EditTags v-model="diyFilter.people.include" label="人员含有：">
          <ElSwitch
            v-model="diyFilter.people.isOr"
            size="small"
            inline-prompt
            active-text="或"
            inactive-text="和"
          />
        </EditTags>
      </ElRow>
      <ElRow>
        <EditTags v-model="diyFilter.tags.include" label="标签含有：">
          <ElSwitch
            v-model="diyFilter.tags.isOr"
            size="small"
            inline-prompt
            active-text="或"
            inactive-text="和"
          />
        </EditTags>
      </ElRow>
      <ElRow>
        <ElSwitch
          v-model="diyFilter.isOrAll"
          size="small"
          active-text="内容、人员、标签做或运算"
        />
      </ElRow>
      <ElRow v-if="diyFilter.exclude.length">
        排除 ID ：
        <ElTag
          v-for="tag in diyFilter.exclude"
          :key="tag"
          closable
          @close="diyFilter.exclude.splice(diyFilter.exclude.indexOf(tag), 1)"
          style="margin-right: 5px; margin-bottom: 5px"
        >
          {{ tag }}</ElTag
        >
      </ElRow>
      <div class="add-filter">
        <ElInput
          v-if="curFilter === -2"
          v-model="diyFilter.name"
          style="max-width: 160px"
          placeholder="预设名称"
        >
          <template #append>
            <ElButton @click="addFilter">添加</ElButton>
          </template>
        </ElInput>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.log-filter {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .control-filter {
    border-radius: var(--border-radius);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  // 自定义筛选框
  .diy-filter {
    padding: var(--padding);
    border-radius: var(--border-radius);
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;

    // 添加输入框
    .add-filter {
      position: absolute;
      // top: -32px;
      bottom: var(--padding);
      right: var(--padding);
    }
  }
}
</style>
