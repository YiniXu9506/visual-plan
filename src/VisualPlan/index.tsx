import React, { useEffect, useState } from 'react'
import {
  TreeNodeDatum,
  ThemeType,
  NodeType,
  LinkType,
  BinaryPlan,
  NodeProps
} from './types'

import { DefaultNode } from './Node/DefaultNode'
import { DefaultLink } from './Link/DefaultLink'
import MainChart from './MainChart'

import { AssignInternalProperties } from './utlis'
import { HierarchyNode } from 'd3'

interface VisualPlanProps {
  // node raw data
  data: BinaryPlan

  // custom Node/Link render
  customNode?: NodeProps
  customLink?: (link: LinkType) => JSX.Element

  // properties used to calculate tree layout and transform
  getContainer?: HTMLElement | (() => HTMLElement)
  cte?: {
    gap: number
  }

  // theme, default light mode
  theme?: ThemeType

  // minimap
  minimap?:
    | {
        scale?: number
      }
    | boolean

  // tree behavior
  onNodeClick?: (node: NodeType) => void
}

const VisualPlan = ({ data, customNode }: VisualPlanProps) => {
  const [treeNodeDatum, setTreeNodeDatum] = useState<TreeNodeDatum[]>([])

  useEffect(() => {
    const _data = [data.main, ...(data.ctes || [])]
    // Assigns all internal properties to tree node
    const treeNodes = AssignInternalProperties(_data, customNode!.nodeSize)
    setTreeNodeDatum(treeNodes)
  }, [data, customNode!.nodeSize])

  return (
    <div>
      <MainChart
        treeNodeDatum={treeNodeDatum}
        classNamePrefix="multiTrees"
        customNode={customNode}
      />
    </div>
  )
}

export { VisualPlan }
