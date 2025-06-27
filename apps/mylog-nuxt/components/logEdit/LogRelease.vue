<script lang="ts" setup>

</script>

<template>
    <div class="LogRelease  _m">
        <div>
            123
        </div>
        <!-- <ElProgress v-if="upload.percent > -1" :percentage="upload.percent" :text-inside="true" :stroke-width="20"
            striped striped-flow :duration="10">
            {{ upload.percent }}% {{ upload.speed }}MB/s
        </ElProgress> -->
        <!-- <div class="control">
            <ControlIcons v-model="visible" :setItem :closeItem />
            <div class="rls-btn">
                <ElRadioGroup v-model="logEdit.type" size="small">
                    <ElRadioButton label="记录" value="log" />
                    <ElRadioButton label="公开" value="public" />
                </ElRadioGroup>
                <ElButton size="small" type="primary" @click="release">发布</ElButton>
            </div>
        </div>
        <div>
            <ElInput v-model="logEdit.content" :autosize="{ minRows: 3 }" type="textarea" placeholder="记录内容" />
        </div> -->
    </div>
</template>

<style lang="scss" scoped>
.LogRelease {
    border-radius: 8px;
    padding: var(--padding);

    display: flex;
    flex-direction: column;
    gap: 8px;

    .control {
        display: flex;
        justify-content: space-between;
    }
}
</style>
