<!-- 
  这个页面主要用到 vis-network 库
  GitHub：https://github.com/visjs/vis-network/
  英文文档：https://visjs.github.io/vis-network/docs/network/
  中文文档：https://ame.cool/pages/a7d858/
 -->
<script setup lang="ts">
import { FullScreen, Refresh, Plus, Minus } from '@element-plus/icons-vue'
import { useVisNetwork } from '@/utils/vis-network'
import { ElButton } from 'element-plus'
import { delRelation, newRelation, useRelationStore } from '@/stores/relation'
import type { Relation } from '@/types'

const Relation = useRelationStore()

const networkDom = ref<HTMLDivElement>()
// 当前显示的log
const relations = reactive<{
  list: Relation[]
  curPage: number
  node: string
}>({
  list: [],
  curPage: 1,
  node: '',
})

const vn = reactive(
  useVisNetwork(networkDom, {
    nodes: Relation.getNetworkData().then(d => d.nodes),
    edges: Relation.getNetworkData().then(d => d.edges),
  })
)

vn.init.then(network => {
  // 目前只支持单选
  network.on('click', e => {
    const n = e.nodes[0]
    relations.node = n

    relations.list = Relation.listAll.filter(i => e.nodes.includes(i.id))
  })
})

// 缩放按钮
const setScale = (num: number) => {
  if (num == 0) vn.network?.fit()
  if (num < 0 && vn.network!.getScale() < 0.12) return
  vn.network?.moveTo({ scale: vn.network?.getScale() + num })
}

/**
 * 添加人员节点和线
 * @param relation 人员对象
 */
const add = (r: Relation) => {
  newRelation(r).then(relation => {
    console.log('添加节点')
    // 添加组节点
    try {
      vn.nodes.add({
        id: r.from,
        label: r.from,
        color: '#ddd',
        shape: 'ellipse',
        font: { size: 20 },
      })
      vn.edges.add({ from: 0, to: r.from })
    } catch (error) {
      console.log('组节点已存在')
    }

    // 添加人员节点
    vn.edges.add({
      from: r.from,
      to: r.id,
      label: r.info.label,
    })
    vn.nodes.add({
      id: r.id,
      label: r.name,
      group: r.from,
    })
  })
}

// 删除ralation，网络、数据、后端
const remove = (r: Relation) => {
  // 先删后端，会同步删除数据
  delRelation(r).then(count => {
    console.log(count)
    // 更新网络
    vn.refresh({
      nodes: Relation.getNetworkData().then(d => d.nodes),
      edges: Relation.getNetworkData().then(d => d.edges),
    })
  })
}
</script>

<template>
  <div class="relation-page" v-m>
    <!-- {{ Relation.networkData }} -->
    <div class="network" ref="networkDom"></div>

    <div class="buttons">
      <!-- <ElButton type="primary" :icon="FullScreen" @click="MaxNetwork()" /> -->
      <ElButton :icon="Refresh" @click="setScale(0)" />
      <ElButton :icon="Plus" @click="setScale(0.1)" />
      <ElButton :icon="Minus" @click="setScale(-0.1)" />
    </div>

    <div class="bottom">
      <!-- 组节点：点击自己和组节点时 -->
      <div v-if="relations.node && !Number(relations.node)">
        <GroupComp :group="relations.node" :add :key="relations.node" />
      </div>

      <!-- 人员节点 -->
      <div v-if="relations.list.length">
        <RelationComp
          :relation="relations.list[relations.curPage - 1]"
          :key="relations.list[relations.curPage - 1].id"
          :add
          :remove
        >
          <!-- <ElPagination
            small
            background
            layout="prev, pager, next"
            :page-size="1"
            v-model:current-page="relations.curPage"
            :total="relations.list.length"
            hide-on-single-page
            style="justify-content: center"
          /> -->
        </RelationComp>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.relation-page {
  position: relative;
  border-radius: var(--border-radius);
  padding: var(--padding);
  height: calc(100vh - var(--header-top) - var(--gap));

  display: flex;
  flex-direction: column;

  .network {
    height: 0;
    flex: 1;
  }

  .buttons {
    position: absolute;
    top: var(--padding);
    left: var(--padding);
  }

  .bottom {
    position: absolute;
    bottom: var(--padding);
    left: var(--padding);
    right: var(--padding);
  }
}
</style>
