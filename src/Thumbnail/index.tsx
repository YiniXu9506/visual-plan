import React, { useEffect, useState, useRef, useMemo } from 'react'
import { select } from 'd3'

import {
  AssignInternalProperties,
  generateNodesAndLinks,
  getTreeBound,
} from '../utlis'
import {
  VisualPlanProps,
  TreeNodeDatum,
  RectSize,
  NodeMargin,
  SingleTreeNodesAndLinks,
  SingleTreeBound,
} from '../types'
import { Trees } from '../VisualPlan/Tree/index'

import '../style/thumbnail.less'
import { ThemeContext } from '../context/ThemeContext'

import { DefaultNode } from '../VisualPlan/Tree/DefaultNode'
import { DefaultLink } from '../VisualPlan/Tree/DefaultLink'

const VisualPlanThumbnail = ({
  data,
  theme,
  customNode = DefaultNode,
  customLink = DefaultLink,
  cte,
}: VisualPlanProps) => {
  const gapBetweenTrees = cte!.gap
  const [treeNodeDatum, setTreeNodeDatum] = useState<TreeNodeDatum[]>([])
  const [multiTreesViewport, setMultiTreesViewport] = useState<RectSize>({
    width: 0,
    height: 0,
  })

  const [multiTreesNodesAndLinks, setMultiTreesNodesAndLinks] = useState<
    SingleTreeNodesAndLinks[]
  >([])
  const [initTreesBound, setInitTreesBound] = useState<
    { width: number; height: number; x: number; y: number }[]
  >([])

  const thumbnailContainerGRef = useRef<HTMLDivElement>(null)
  const thumbnailSVGRef = useRef<SVGSVGElement>(null)
  const thumbnaiSVGSelection = select(thumbnailSVGRef.current)

  // Sets the bound of entire tree
  const [multiTreesBound, setMultiTreesBound] = useState({
    width: 0,
    height: 0,
  })

  const margin: NodeMargin = useMemo(
    () => ({
      siblingMargin: customNode.nodeMargin.childrenMargin || 40,
      childrenMargin: customNode.nodeMargin.siblingMargin || 60,
    }),
    [customNode.nodeMargin.childrenMargin, customNode.nodeMargin.siblingMargin]
  )


  const drawMinimap = () => {
    const widthRatio = multiTreesViewport.width / multiTreesBound.width
    const heightRation = multiTreesViewport.height / multiTreesBound.height
    const k =
      Math.min(widthRatio, heightRation) > 0.5
        ? 0.5
        : Math.min(widthRatio, heightRation)

    select(thumbnailContainerGRef.current)
      .attr('width', multiTreesBound.width * k)
      .attr('height', multiTreesBound.height * k)

    thumbnaiSVGSelection
      .attr('width', multiTreesBound.width * k)
      .attr('height', multiTreesBound.height * k)
      .attr(
        'viewBox',
        [0, 0, multiTreesBound.width, multiTreesBound.height].join(' ')
      )
      .attr('preserveAspectRatio', 'xMidYMid meet')
  }

  useEffect(() => {
    const _data = [data.main, ...(data.ctes || [])]
    // Assigns all internal properties to tree node
    const treeNodes = AssignInternalProperties(_data, customNode?.calcNodeSize)
    setTreeNodeDatum(treeNodes)

    let _multiTreesNodesAndLinks: SingleTreeNodesAndLinks[] = []
    let _multiTreesBound = { width: 0, height: 0 }
    let _initTreesBound: SingleTreeBound[] = []

    treeNodes.forEach(treeNode => {
      const treebound = getTreeBound(treeNode, margin)
      _initTreesBound.push(treebound)
      const { nodes, links } = generateNodesAndLinks(treeNode, margin)
      _multiTreesBound = {
        width: _multiTreesBound.width + treebound.width,
        height:
          treebound.height > _multiTreesBound.height
            ? treebound.height
            : _multiTreesBound.height,
      }
      _multiTreesNodesAndLinks.push({ nodes, links })
    })

    setMultiTreesBound({
      width: _multiTreesBound.width + (treeNodes.length - 1) * gapBetweenTrees,
      height: _multiTreesBound.height,
    })
    setInitTreesBound(_initTreesBound)
    setMultiTreesNodesAndLinks(_multiTreesNodesAndLinks)
  }, [data, customNode?.calcNodeSize])

  useEffect(() => {
    if (thumbnailContainerGRef.current) {
      setMultiTreesViewport({
        width: thumbnailContainerGRef.current?.clientWidth,
        height: thumbnailContainerGRef.current?.clientHeight,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiTreesBound])

  useEffect(() => {
    if (thumbnailContainerGRef.current) drawMinimap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbnailContainerGRef.current, multiTreesBound])
  return (
    <ThemeContext.Provider value={{ theme: theme! }}>
      <div
        className={`thumbnailContainer ${theme}`}
        ref={thumbnailContainerGRef}
      >
        <svg ref={thumbnailSVGRef}>
          <g>
            <Trees
              multiTreesNodesAndLinks={multiTreesNodesAndLinks}
              initTreesBound={initTreesBound}
              customLink={customLink}
              customNode={customNode}
              gapBetweenTrees={gapBetweenTrees}
            />
          </g>
        </svg>
      </div>
    </ThemeContext.Provider>
  )
}

VisualPlanThumbnail.defaultProps = {
  theme: 'dark',
  cte: {
    gap: 30,
  },
}

export default VisualPlanThumbnail
