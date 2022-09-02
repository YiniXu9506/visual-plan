import React, {
  useMemo,
  useRef,
  memo,
} from 'react'

import {
  TreeNodeDatum,
  CustomLink,
  CustomNode,
  RectSize,
  SingleTreeNodesAndLinks,
  SingleTreeBound
} from '../../types'

interface SingleTreeProps {
  datum: SingleTreeNodesAndLinks
  transform?: {
    offsetX?: number
    scale?: number
  }
  customLink: CustomLink
  customNode: CustomNode
  toggleNode?: (nodeId: string) => void
  onNodeClick?: (node: TreeNodeDatum) => void
  onUpdate?: (rect: RectSize) => void
}

const Tree = ({
  datum,
  transform,
  customLink,
  customNode,
  toggleNode,
  onNodeClick,
}: SingleTreeProps) => {
  const singleTreeGroupRef = useRef(null)
  const transformValue = useMemo(() => {
    if (!transform || !singleTreeGroupRef.current) {
      return ''
    }
    console.log('in cal', transform)
    const { offsetX, scale } = transform
    return `translate(${scale * (offsetX)}, 0) scale(${
      scale || 1
    })`
  }, [transform])

  return (
    <g ref={singleTreeGroupRef} transform={transformValue}>
      <g className="linksWrapper">
        {datum.links &&
          datum.links.map((link, i) => {
            return <customLink.renderLinkElement key={i} link={link} />
          })}
      </g>

      <g className="nodesWrapper">
        {datum.nodes &&
          datum.nodes.map((hierarchyPointNode, i) => {
            return (
              <customNode.renderNodeElement
                key={hierarchyPointNode.data.name}
                node={hierarchyPointNode}
                onToggle={node => {
                  toggleNode?.(node.__node_attrs.id)
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
  multiTreesNodesAndLinks: SingleTreeNodesAndLinks[]
  initTreesBound: SingleTreeBound[]
  customLink: CustomLink
  customNode: CustomNode
  gapBetweenTrees: number
  scale?: number
  toggleNode?: (nodeId: string) => void
  onNodeClick?: (node: TreeNodeDatum) => void
}

const Trees = memo(
  ({
    multiTreesNodesAndLinks,
    initTreesBound,
    customLink,
    customNode,
    gapBetweenTrees,
    scale = 1,
    toggleNode,
    onNodeClick,
  }:
  TreesProps) => {
    return (
      <>
        {multiTreesNodesAndLinks.map((datum, idx) => {
          const prevGap = gapBetweenTrees * idx
          let prevWidth = 0
          for (let i = idx; i > 0; i--) {
            prevWidth += initTreesBound[i - 1]?.width || 0
          }

          return (
            <Tree
              key={idx}
              datum={datum}
              transform={{ offsetX: prevWidth - initTreesBound[idx]?.x + prevGap, scale }}
              customLink={customLink}
              customNode={customNode}
              toggleNode={toggleNode}
              onNodeClick={onNodeClick}
            />
          )
        })}
      </>
    )
  }
)

export { Trees }
