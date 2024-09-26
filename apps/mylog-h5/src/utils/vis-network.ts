import { Network } from 'vis-network'
import { DataSet } from 'vis-data' // 从vis-network里面拿不到，要从这个库里面拿

import type {
  DataSetEdges,
  DataSetNodes,
  Node,
  Edge,
  Options,
} from 'vis-network'
/**
 * https://visjs.github.io/vis-network/
 * 中文文档 https://ame.cool/core/frontend-tools/
 */

/**
 * 默认network配置
 */
const options: Options = {
  autoResize: true, //网络将自动检测其容器的大小调整，并相应地重绘自身
  //   interaction: {
  //     zoomView: false, //是否能缩放画布
  //   },
  nodes: {
    shape: 'box', //设置节点node样式为矩形
    fixed: false, //节点node固定可移动
    font: { size: 20 }, //显示字体大小
  },
  edges: {
    arrows: { to: true },
  },
  layout: {
    randomSeed: 5, // 布局种子，使其每次布局都一样
  },
}

/**
 * VisNetwork Hook
 * 同时支持同步和异步获取数据
 * @param domRef 渲染网络的DOM节点
 * @param opts 配置
 * @returns
 */
export function useVisNetwork(
  domRef: globalThis.Ref<HTMLDivElement | undefined>,
  data: {
    nodes?: Node[] | Promise<Node[]>
    edges?: Edge[] | Promise<Edge[]>
  },
  opts: Options = {}
) {
  const network = ref<Network>()
  const nodes: DataSetNodes = new DataSet()
  const edges: DataSetEdges = new DataSet()

  const init = new Promise<Network>((resolve, reject) => {
    onMounted(async () => {
      nodes.add((await data.nodes) || [])
      edges.add((await data.edges) || [])
      // 初始化关系图
      network.value = new Network(
        domRef.value!,
        { nodes, edges },
        { ...options, ...opts }
      )
      resolve(network.value)
    })
  })

  const refresh = async (data: {
    nodes?: Node[] | Promise<Node[]>
    edges?: Edge[] | Promise<Edge[]>
  }) => {
    nodes.clear()
    edges.clear()
    nodes.add((await data.nodes) || [])
    edges.add((await data.edges) || [])
    // network.value?.fit()
  }

  return { network, init, nodes, edges, refresh }
}