import { HierarchyNode } from 'd3'
export interface NodeType {
  children: NodeType[] | null
  data: RawNodeDatum
  depth: number
  height: number
  parent: NodeType[] | null
  x: number
  y: number
}

export interface LinkType {
  source: NodeType
  target: NodeType
}

export type ThemeType = 'dark' | 'light'

export interface rectSize {
  width: number
  height: number
}

export interface nodeMarginType {
  siblingMargin: number
  childrenMargin: number
}

export interface RawNodeDatum {
  name: string
  cost: number
  estRows: number
  actRows: number
  duration: string
  labels: []
  storeType: string
  diskBytes: string
  taskType: string
  memoryBytes: string
  operatorInfo: string
  rootBasicExecInfo: {}
  rootGroupExecInfo: []
  copExecInfo: {}
  accessObjects: []
  diagnosis: []
  children?: RawNodeDatum[]
}

// Tree node data contains node attributes.
export interface TreeNodeDatum extends RawNodeDatum {
  children?: TreeNodeDatum[]
  __node_attrs: {
    id: string
    collapsed?: boolean
    collapsiable?: boolean
    isNodeDetailVisible: boolean
    nodeFlexSize?: {
      width: number
      height: number
    }
  }
}

export interface BinaryPlan {
  ctes: RawNodeDatum[]
  discardedDueToTooLong: boolean
  main: RawNodeDatum
  withRuntimeStats: boolean
}

export interface NodeProps {
  nodeSize: rectSize
  renderNodeElement: (node: HierarchyNode<TreeNodeDatum>) => JSX.Element
}
