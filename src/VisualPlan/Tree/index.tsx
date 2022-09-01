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
  SingleTreeData,
} from '../../types'

interface SingleTreeProps {
  datum: SingleTreeData
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
    console.log('in cal')
    const { x, y } = singleTreeGroupRef.current.getBBox()
    const { offsetX, scale } = transform
    return `translate(${scale * (-x + offsetX)}, ${scale * y}) scale(${
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
  multiTreesData: SingleTreeData[]
  initTreesBound: RectSize[]
  customLink: CustomLink
  customNode: CustomNode
  gapBetweenTrees: number
  scale?: number
  toggleNode?: (nodeId: string) => void
  onNodeClick?: (node: TreeNodeDatum) => void
}

const Trees = memo(
  ({
    multiTreesData,
    customLink,
    customNode,
    initTreesBound,
    gapBetweenTrees,
    scale = 1,
    toggleNode,
    onNodeClick,
  }:
  TreesProps) => {
    return (
      <>
        {multiTreesData.map((datum, idx) => {
          const prevGap = gapBetweenTrees * idx
          let prevWidth = 0
          for (let i = idx; i > 0; i--) {
            prevWidth += initTreesBound[i - 1]?.width || 0
          }

          return (
            <Tree
              key={idx}
              datum={datum}
              transform={{ offsetX: prevWidth + prevGap, scale }}
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
