import React, { memo } from 'react'
import SingleTree from './SingleTree'

import { TreeNodeDatum, nodeMarginType, NodeProps } from './types'

interface MultiTreesProps {
  treeNodeDatum: TreeNodeDatum[]
  customNode: NodeProps
}

const _Trees = ({
  treeNodeDatum,
  customNode,
}: MultiTreesProps) => (
  <>
    {treeNodeDatum.map((datum, idx) => (
      <SingleTree
        key={datum.name}
        datum={datum}
        treeIdx={idx}
        customNode={customNode}
      />
    ))}
  </>
)

export const Trees = memo(_Trees)
