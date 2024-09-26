<script setup lang="ts">
import useUserStore from '@/stores/user'

const User = useUserStore()
const Setting = User.setting
const curTab = ref('mylog')

// 删除过滤预设
const delFilter = (i: number) => {
  Setting.mylog.filters.splice(i, 1)
  if (i === Setting.mylog.filterIndex) Setting.mylog.filterIndex = -1
}

// 删除自定义点
const delDiyPoint = (i: number) => {
  Setting.map.diyPoints.splice(i, 1)
}
</script>

<template>
  <div class="logger-comp" v-m>
    <ElTabs v-model="curTab" class="demo-tabs">
      <ElTabPane label="信息" name="user">
        <ElForm class="user-setting" label-width="auto" @submit.native.prevent>
          <ElFormItem label="用户名">
            <ElInput v-model="User.name" />
          </ElFormItem>
          <ElFormItem label="性别">
            <ElRadioGroup v-model="User.info.sex">
              <ElRadioButton label="男" value="男" />
              <ElRadioButton label="女" value="女" />
              <ElRadioButton label="保密" value="保密" />
            </ElRadioGroup>
          </ElFormItem>
          <ElFormItem label="生日">
            <ElDatePicker
              v-model="User.info.birth"
              type="date"
              :clearable="false"
              :editable="false"
              placeholder="选择你的生日"
              value-format="YYYY-MM-DD"
            />
          </ElFormItem>
          <ElFormItem label="个性签名">
            <ElInput v-model="User.info.text" />
          </ElFormItem>
        </ElForm>
      </ElTabPane>
      <ElTabPane label="页面" name="page">
        <ElForm class="page-setting" label-width="auto" @submit.native.prevent>
          <!-- todo: 要做自定义主题 -->
          <ElFormItem label="主题">
            <ElRadioGroup v-model="Setting.page.theme">
              <ElRadioButton label="明" value="light" />
              <ElRadioButton label="暗" value="dark" />
            </ElRadioGroup>
          </ElFormItem>
        </ElForm>
      </ElTabPane>
      <ElTabPane label="记录" name="mylog">
        <!-- {{ Object.keys(Setting.mylog) }} -->
        <ElForm class="mylog-setting" label-width="auto" @submit.native.prevent>
          <ElFormItem label="待选标签">
            <EditTags v-model="Setting.mylog.tags" size="large" />
          </ElFormItem>
          <ElFormItem label="过滤器预设">
            <div class="tags">
              <ElTag
                label="全部"
                :value="-1"
                @click="Setting.mylog.filterIndex = -1"
                size="large"
                :effect="Setting.mylog.filterIndex === -1 ? 'dark' : undefined"
              >
                全部
              </ElTag>
              <ElTag
                v-for="(tag, i) of Setting.mylog.filters.map(f => f.name)"
                :key="tag"
                closable
                @close="delFilter(i)"
                @click="Setting.mylog.filterIndex = i"
                size="large"
                :effect="Setting.mylog.filterIndex === i ? 'dark' : undefined"
              >
                {{ tag }}
              </ElTag>
            </div>
          </ElFormItem>
          <ElFormItem label="日历标签">
            <EditTags v-model="Setting.mylog.calendarTags" size="large" />
          </ElFormItem>
        </ElForm>
      </ElTabPane>
      <ElTabPane label="地图" name="map">
        <ElForm
          class="relation-setting"
          label-width="auto"
          @submit.native.prevent
        >
          <ElFormItem label="自定义点">
            <!-- <EditTags v-model="Setting.map.diyPoints" size="large" /> -->
            <div class="tags">
              <ElTag
                v-for="(p, i) of Setting.map.diyPoints"
                :key="p.lnglat.join(',')"
                closable
                @close="delDiyPoint(i)"
                size="large"
              >
                {{ p.lnglat.join(',') }}
              </ElTag>
            </div>
          </ElFormItem>
        </ElForm>
      </ElTabPane>
      <ElTabPane label="人脉" name="relation">
        <ElForm
          class="relation-setting"
          label-width="auto"
          @submit.native.prevent
        >
          人脉设置人脉设置人脉设置人脉设置
          <!-- <ElFormItem label="主题">
            <ElRadioGroup v-model="Setting.page.theme">
              <ElRadioButton label="明" value="light" />
              <ElRadioButton label="暗" value="dark" />
            </ElRadioGroup>
          </ElFormItem> -->
        </ElForm>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style scoped lang="less">
.logger-comp {
  padding: var(--padding);
  padding-top: 0;
  border-radius: var(--border-radius);

  .tags {
    display: flex;
    gap: 8px;

    .el-tag {
      cursor: pointer;
    }
  }
}
</style>
