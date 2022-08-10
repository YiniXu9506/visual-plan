import React, { useEffect, useState, useRef } from 'react'
import { select } from 'd3'

import { AssignInternalProperties } from '../utlis'
import { VisualPlanProps, TreeNodeDatum, RectSize } from '../types'
import { Trees } from '../VisualPlan/Tree/index'

import '../style/thumbnail.less'
import { ThemeContext } from '../context/ThemeContext'

const VisualPlanThumbnail = ({
  data,
  theme,
  customNode,
  customLink,
  cte,
}: VisualPlanProps) => {
  const gapBetweenTrees = cte!.gap
  const [treeNodeDatum, setTreeNodeDatum] = useState<TreeNodeDatum[]>([])
  const [multiTreesViewport, setMultiTreesViewport] = useState<RectSize>({
    width: 0,
    height: 0,
  })

  const thumbnailContainerGRef = useRef<HTMLDivElement>(null)
  const thumbnailSVGRef = useRef<SVGSVGElement>(null)
  const thumbnaiSVGSelection = select(thumbnailSVGRef.current)

  // Sets the bound of entire tree
  const [multiTreesBound, setMultiTreesBound] = useState({
    width: 0,
    height: 0,
  })

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
    const treeNodes = AssignInternalProperties(_data, customNode?.nodeSize)
    setTreeNodeDatum(treeNodes)
  }, [data, customNode?.nodeSize])

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
              treeNodeDatum={treeNodeDatum}
              customLink={customLink}
              customNode={customNode}
              gapBetweenTrees={gapBetweenTrees}
              onUpdate={rect => setMultiTreesBound(rect)}
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
