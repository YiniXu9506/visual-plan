import React, { useEffect, useState, useMemo, useRef } from 'react'
import { HierarchyPointLink, HierarchyPointNode } from 'd3'

import NodeWrapper from '../Node/NodeWrapper'
import LinkWrapper from '../Link/LinkWrapper'
import { TreeNodeDatum, nodeMarginType, NodeProps } from '../types'
import { generateNodesAndLinks } from '../utlis'

interface SingleTreeProps {
  datum: TreeNodeDatum
  treeIdx: number
  customNode: NodeProps
}

const SingleTree = ({
  datum,
  treeIdx,
  customNode,
}: SingleTreeProps) => {
  const singleTreeGroupRef = useRef(null)
  const inited = useRef(false)
  const [nodes, setNodes] = useState<HierarchyPointNode<TreeNodeDatum>[]>([])
  const [links, setLinks] = useState<HierarchyPointLink<TreeNodeDatum>[]>([])
  const [treePosition, setTreePosition] = useState({
    x: 0,
    y: 0,
    offset: 0
  })



  return (
    // tranform is the relative position to the original point [0,0] when initiated.
    <g
      className={`singleTreeGroup-${treeIdx}`}
      ref={singleTreeGroupRef}

    >
      <g className="nodesWrapper">
        {nodes &&
          nodes.map((hierarchyPointNode, i) => {
            const { data } = hierarchyPointNode
            return (
              <NodeWrapper
                nodeData={hierarchyPointNode}
                key={hierarchyPointNode.data.name}
                renderCustomNodeElement={customNode.renderNodeElement}
              />
            )
          })}
      </g>
    </g>
  )
}

export default SingleTree
