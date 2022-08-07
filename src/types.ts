import React from 'react'
import { HierarchyPointNode, HierarchyPointLink } from 'd3'

export interface VisualPlanProps {
  // node raw data
  data: BinaryPlan

  // custom Node/Link render
  customNode?: CustomNode
  customLink?: CustomLink

  // the gap between multiple trees
  cte?: {
    gap: number
  }

  // theme, default light mode
  theme?: Theme

  // minimap
  minimap?:
    | {
        scale?: number
      }
    | boolean

  // tree behavior
  onNodeClick?: (node: RawNodeDatum) => void
}

export type Theme = 'light' | 'dark'

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

export interface CustomNode {
  nodeSize: RectSize
  nodeMargin: NodeMargin
  renderNodeElement: React.FC<NodeProps>
}

export interface NodeProps {
  node: HierarchyPointNode<TreeNodeDatum>
  onToggle: (node: TreeNodeDatum) => void
  onClick?: (node: TreeNodeDatum) => void
}

export interface CustomLink {
  renderLinkElement: React.FC<LinkProps>
}

export interface LinkProps {
  link: HierarchyPointLink<TreeNodeDatum>
}
