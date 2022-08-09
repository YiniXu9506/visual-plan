import React, { useEffect, useState, useMemo, useRef, memo } from 'react'
import { HierarchyPointLink, HierarchyPointNode } from 'd3'

import { DefaultNode } from './DefaultNode'
import { DefaultLink } from './DefaultLink'
import { TreeNodeDatum, NodeMargin, CustomLink, CustomNode } from '../../types'
import { generateNodesAndLinks } from '../../utlis'

interface SingleTreeProps {
  datum: TreeNodeDatum
  treeIdx: number
  zoomToFitViewportScale: number
  customLink: CustomLink
  customNode: CustomNode
  toggleNode: (nodeId: string) => void
  onNodeClick?: (node: TreeNodeDatum) => void
  getTreePosition: (number) => any
}

const SingleTree = ({
  datum,
  treeIdx,
  zoomToFitViewportScale,
  customLink = DefaultLink,
  customNode = DefaultNode,
  toggleNode,
  onNodeClick,
  getTreePosition,
}: SingleTreeProps) => {
  const singleTreeGroupRef = useRef(null)
  const [nodes, setNodes] = useState<HierarchyPointNode<TreeNodeDatum>[]>([])
  const [links, setLinks] = useState<HierarchyPointLink<TreeNodeDatum>[]>([])
  const [treePosition, setTreePosition] = useState({
    x: 0,
    y: 0,
    offset: 0,
  })

  const margin: NodeMargin = useMemo(
    () => ({
      siblingMargin: customNode.nodeMargin.childrenMargin || 40,
      childrenMargin: customNode.nodeMargin.siblingMargin || 60,
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
            return <customLink.renderLinkElement key={i} link={link} />
          })}
      </g>

      <g className="nodesWrapper">
        {nodes &&
          nodes.map((hierarchyPointNode, i) => {
            return (
              <customNode.renderNodeElement
                key={hierarchyPointNode.data.name}
                node={hierarchyPointNode}
                onToggle={node => {
                  toggleNode(node.__node_attrs.id)
                }}
                onClick={onNodeClick}
              />
            )
          })}
      </g>
    </g>
  )
}

interface TreesProps {
  treeNodeDatum: TreeNodeDatum[]
  zoomToFitViewportScale: number
  customLink: CustomLink
  customNode: CustomNode
  toggleNode?: (nodeId: string) => void
  onNodeClick?: (node: TreeNodeDatum) => void
  getTreePosition: (treeIdx: number) => any
}

const Trees = memo(
  ({
    treeNodeDatum,
    zoomToFitViewportScale,
    customLink,
    customNode,
    toggleNode,
    onNodeClick,
    getTreePosition,
  }: TreesProps) => (
    <>
      {treeNodeDatum.map((datum, idx) => (
        <SingleTree
          key={datum.name}
          datum={datum}
          treeIdx={idx}
          zoomToFitViewportScale={zoomToFitViewportScale}
          customLink={customLink}
          customNode={customNode}
          toggleNode={toggleNode!}
          onNodeClick={onNodeClick}
          getTreePosition={getTreePosition}
        />
      ))}
    </>
  )
)

export { Trees }
