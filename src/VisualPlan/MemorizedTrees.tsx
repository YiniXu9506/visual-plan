import React, { memo } from 'react'
import SingleTree from './SingleTree'

import { TreeNodeDatum, NodeProps, LinkProps} from './types'

interface MultiTreesProps {
  treeNodeDatum: TreeNodeDatum[]
  zoomToFitViewportScale: number
  customLink: LinkProps
  customNode: NodeProps
  toggleNode: (nodeId: string) => void
  // onNodeDetailClick?: (node: TreeNodeDatum) => void
  getTreePosition: (treeIdx: number) => any
}

const _Trees = ({
  treeNodeDatum,
  zoomToFitViewportScale,
  customLink,
  customNode,
  toggleNode,
  // onNodeDetailClick,
  getTreePosition
}: MultiTreesProps) => (
  <>
    {treeNodeDatum.map((datum, idx) => (
      <SingleTree
        key={datum.name}
        datum={datum}
        treeIdx={idx}
        zoomToFitViewportScale={zoomToFitViewportScale}
        customLink={customLink}
        customNode={customNode}
        toggleNode={toggleNode}
        // onNodeDetailClick={onNodeDetailClick!}
        getTreePosition={getTreePosition}
      />
    ))}
  </>
)

export const Trees = memo(_Trees)
