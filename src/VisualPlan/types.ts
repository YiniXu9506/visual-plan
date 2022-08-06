import { HierarchyPointNode, HierarchyPointLink } from 'd3'

export interface Translate {
  x: number
  y: number
  k: number
}

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

export interface RectSize {
  width: number
  height: number
}

export interface NodeMargin {
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
  nodeSize: RectSize
  nodeMargin: NodeMargin
  renderNodeElement: (node: HierarchyPointNode<TreeNodeDatum>) => JSX.Element
}

export interface LinkProps {
  renderLinkElement: (link: HierarchyPointLink<TreeNodeDatum>) => JSX.Element
}
