import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  memo,
  useLayoutEffect,
} from 'react'
import { HierarchyPointLink, HierarchyPointNode } from 'd3'

import { DefaultNode } from './DefaultNode'
import { DefaultLink } from './DefaultLink'
import {
  TreeNodeDatum,
  NodeMargin,
  CustomLink,
  CustomNode,
  RectSize,
} from '../../types'
import { generateNodesAndLinks } from '../../utlis'

interface SingleTreeProps {
  datum: TreeNodeDatum
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
  customLink = DefaultLink,
  customNode = DefaultNode,
  toggleNode,
  onNodeClick,
  onUpdate,
}: SingleTreeProps) => {
  const singleTreeGroupRef = useRef(null)
  const margin: NodeMargin = useMemo(
    () => ({
      siblingMargin: customNode.nodeMargin.childrenMargin || 40,
      childrenMargin: customNode.nodeMargin.siblingMargin || 60,
    }),
    [customNode.nodeMargin.childrenMargin, customNode.nodeMargin.siblingMargin]
  )
  const { nodes, links } = useMemo<{
    nodes: HierarchyPointNode<TreeNodeDatum>[]
    links: HierarchyPointLink<TreeNodeDatum>[]
  }>(() => {
    if (!datum) {
      return { nodes: [], links: [] }
    }
    return generateNodesAndLinks(datum, margin)
  }, [datum, margin])
  const transformValue = useMemo(() => {
    if (!transform || !singleTreeGroupRef.current) {
      return ''
    }
    const { x, y } = singleTreeGroupRef.current.getBBox()
    const { offsetX, scale } = transform
    return `translate(${scale * (-x + offsetX)}, ${scale * y}) scale(${
      scale || 1
    })`
  }, [transform])

  useLayoutEffect(() => {
    if (!onUpdate) {
      return
    }
    const { width, height } = singleTreeGroupRef.current.getBBox()
    onUpdate({ width, height })
  }, [nodes, links])

  return (
    <g ref={singleTreeGroupRef} transform={transformValue}>
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
  treeNodeDatum: TreeNodeDatum[]
  customLink: CustomLink
  customNode: CustomNode
  gapBetweenTrees: number
  scale?: number
  toggleNode?: (nodeId: string) => void
  onNodeClick?: (node: TreeNodeDatum) => void
  onUpdate?: (rect: RectSize) => void
}

const Trees = memo(
  ({
    treeNodeDatum,
    customLink,
    customNode,
    gapBetweenTrees,
    scale = 1,
    toggleNode,
    onNodeClick,
    onUpdate,
  }: TreesProps) => {
    const [rects, setRects] = useState<RectSize[]>([])
    const onTreeUpdate = (idx: number, rect: RectSize) =>
      setRects(prev => [...prev.slice(0, idx), rect, ...prev.slice(idx + 1)])

    useEffect(() => {
      if (!onUpdate) {
        return
      }
      const treesRect = rects.reduce(
        (prev, { width, height }) => {
          prev.width += width
          prev.height = height > prev.height ? height : prev.height
          return prev
        },
        { width: 0, height: 0 }
      )
      treesRect.width += gapBetweenTrees * (treeNodeDatum.length - 1)
      onUpdate(treesRect)
    }, [rects])

    return (
      <>
        {treeNodeDatum.map((datum, idx) => {
          const prevGap = gapBetweenTrees * idx
          let prevWidth = 0
          for (let i = idx; i > 0; i--) {
            prevWidth += rects[i - 1]?.width || 0
          }
          return (
            <Tree
              key={datum.name}
              datum={datum}
              transform={{ offsetX: prevWidth + prevGap, scale }}
              customLink={customLink}
              customNode={customNode}
              toggleNode={toggleNode}
              onNodeClick={onNodeClick}
              onUpdate={rect => onTreeUpdate(idx, rect)}
            />
          )
        })}
      </>
    )
  }
)

export { Trees }
