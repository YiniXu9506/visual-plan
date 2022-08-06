import React from 'react'

import { nodeMarginType, TreeNodeDatum, NodeProps } from '../types'
import { Trees } from '../MemorizedTrees'

interface MainChartProps {
  treeNodeDatum: TreeNodeDatum[]
  classNamePrefix: string
  customNode: NodeProps
}

const MainChart = ({
  treeNodeDatum,
  classNamePrefix,
  customNode,
}: MainChartProps) => {
  return (
    <svg
      className={`${classNamePrefix}SVG`}
    >
      <g
        className={`${classNamePrefix}GroupWrapper`}
      >
        <g
          className={`${classNamePrefix}Group`}
        >
          <Trees
            {...{
              treeNodeDatum,
              customNode,
            }}
          />
        </g>
      </g>
    </svg>
  )
}

export default MainChart
