<!--
    筛选条件编辑器
    第一行是 全部 | 预设1 | 预设2 | 自定义

-->

<script lang="ts" setup>
const { params } = refsMylogStore()
/** 筛选器：-1是全部，-2是自定义筛选 */
const curFilter = ref(-1)

const diyFilter = reactive<LogFilter>({
  name: '',
  type: '',
  logtime: { gte: undefined, lte: undefined },
  isOrAll: true,
  content: { contains: [], isOr: false },
  people: { contains: [], isOr: false },
  tags: { contains: [], isOr: false },
  exclude: [], // 不包括，填入noteId
})

watch(curFilter, (cf) => {
  params.value.filter = cf === -2 ? diyFilter : undefined
})
</script>

<template>
  <div class="LogFilter">
    <div class="filters">
      <ElRadioGroup v-model="curFilter" size="small">
        <ElRadioButton label="全部" :value="-1" />
        <!-- <ElRadioButton v-for="(f, i) in filters" :label="f.name" :value="i" /> -->
        <ElRadioButton label="筛选" :value="-2" />
      </ElRadioGroup>

      <!-- <ElButton size="small" @click="shareLogs"> 分享 </ElButton> -->
      <!-- 删除预设应当移动到设置页面 -->
      <!-- <ElButton v-if="curFilter >= 0" size="small" @click="delFilter"
        >删除此预设</ElButton
      > -->
    </div>

    <!-- {{ diyFilter }} -->
    <div v-if="curFilter === -2" class="diy-filter _m">
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
          v-model="diyFilter.logtime.gte"
          type="date"
          placeholder="起始日期"
          size="small"
          :editable="false"
          :value-on-clear="undefined"
          style="width: 120px"
        />
        &nbsp;~&nbsp;
        <ElDatePicker
          v-model="diyFilter.logtime.lte"
          type="date"
          placeholder="结束日期"
          size="small"
          :editable="false"
          :value-on-clear="undefined"
          style="width: 120px"
        />
      </ElRow>

      <ElRow>
        <EditTags v-model="diyFilter.content.contains" label="内容含有：">
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
        <EditTags v-model="diyFilter.people.contains" label="人员含有：">
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
        <EditTags v-model="diyFilter.tags.contains" label="标签含有：">
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
          {{ tag }}
        </ElTag>
      </ElRow>

      <!-- <div class="add-filter">
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
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.LogFilter {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .diy-filter {
    border-radius: 8px;
    padding: 8px;

    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
  }
}
</style>
