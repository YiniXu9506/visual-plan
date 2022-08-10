import React, { forwardRef } from 'react'

import {
  TreeNodeDatum,
  RectSize,
  Translate,
  CustomLink,
  CustomNode,
} from '../types'
import { Trees } from './Tree'

interface MainViewProps {
  treeNodeDatum: TreeNodeDatum[]
  translate: Translate
  customLink: CustomLink
  customNode: CustomNode
  viewport: RectSize
  toggleNode: (nodeId: string) => void
  onNodeClick?: (node: TreeNodeDatum) => void
  adjustPosition: RectSize
  zoomToFitViewportScale: number
  gapBetweenTrees: number
  onUpdate?: (translate: RectSize) => void
}

const MainView = forwardRef<SVGSVGElement, MainViewProps>(
  (
    {
      treeNodeDatum,
      translate,
      viewport,
      customLink,
      customNode,
      toggleNode,
      onNodeClick,
      adjustPosition,
      zoomToFitViewportScale,
      gapBetweenTrees,
      onUpdate,
    },
    ref
  ) => {
    return (
      <svg
        className="multiTreesSVG"
        width={viewport.width}
        height={viewport.height}
        ref={ref}
      >
        <g
          className="multiTreesGroupWrapper"
          transform={`translate(${translate.x}, ${translate.y}) scale(${translate.k})`}
        >
          <g
            className="multiTreesGroup"
            transform={`translate(${adjustPosition.width}, ${adjustPosition.height}) scale(1)`}
          >
            <Trees
              treeNodeDatum={treeNodeDatum}
              customLink={customLink}
              customNode={customNode}
              scale={zoomToFitViewportScale}
              gapBetweenTrees={gapBetweenTrees}
              toggleNode={toggleNode}
              onNodeClick={onNodeClick}
              onUpdate={onUpdate}
            />
          </g>
        </g>
      </svg>
    )
  }
)

export default MainView
