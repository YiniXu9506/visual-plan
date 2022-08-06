import React, { useEffect, useState, useMemo, useRef } from 'react'
import { HierarchyPointLink, HierarchyPointNode } from 'd3'

import NodeWrapper from '../Node/NodeWrapper'
import LinkWrapper from '../Link/LinkWrapper'
import { TreeNodeDatum, NodeMargin, NodeProps, LinkProps } from '../types'
import { generateNodesAndLinks } from '../utlis'

interface SingleTreeProps {
  datum: TreeNodeDatum
  treeIdx: number
  zoomToFitViewportScale: number
  customLink: LinkProps
  customNode: NodeProps
  toggleNode: (nodeId: string) => void
  // onNodeDetailClick?: (node: TreeNodeDatum) => void
  getTreePosition: (number) => any
}

const SingleTree = ({
  datum,
  treeIdx,
  zoomToFitViewportScale,
  customLink,
  customNode,
  toggleNode,
  // onNodeDetailClick,
  getTreePosition
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

  const margin: NodeMargin = useMemo(
    () => ({
      siblingMargin: customNode.nodeMargin.childrenMargin || 40,
      childrenMargin: customNode.nodeMargin.siblingMargin || 60
    }),
    [customNode.nodeMargin.childrenMargin, customNode.nodeMargin.siblingMargin]
  )

  useEffect(() => {
    if (!datum) {
      return
    }
    const { nodes, links } = generateNodesAndLinks(datum, margin)
    setNodes(nodes)
    setLinks(links)
  }, [datum, margin])

  useEffect(() => {
    if (!nodes.length || inited.current) {
      return
    }

    inited.current = true
    const position = getTreePosition(treeIdx)
    setTreePosition(position)
  }, [nodes, getTreePosition, treeIdx])

  return (
    // tranform is the relative position to the original point [0,0] when initiated.
    <g
      className={`singleTreeGroup-${treeIdx}`}
      ref={singleTreeGroupRef}
      transform={`translate(${
        zoomToFitViewportScale * (-treePosition.x + treePosition.offset)
      }, ${
        zoomToFitViewportScale * treePosition.y
      }) scale(${zoomToFitViewportScale})`}
    >
      <g className="linksWrapper">
        {links &&
          links.map((link, i) => {
            return (
              <LinkWrapper
                key={i}
                data={link}
                renderCustomLinkElement={customLink.renderLinkElement}
              />
            )
          })}
      </g>

      <g className="nodesWrapper">
        {nodes &&
          nodes.map((hierarchyPointNode, i) => {
            return (
              <NodeWrapper
                data={hierarchyPointNode}
                key={hierarchyPointNode.data.name}
                renderCustomNodeElement={customNode.renderNodeElement}
                toggleNode={toggleNode}
                // onNodeDetailClick={onNodeDetailClick}
              />
            )
          })}
      </g>
    </g>
  )
}

export default SingleTree
