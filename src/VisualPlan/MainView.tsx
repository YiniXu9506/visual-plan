import React, { forwardRef } from 'react'

import {
  TreeNodeDatum,
  RectSize,
  Translate,
  CustomLink,
  CustomNode,
  SingleTreeData
} from '../types'
import { Trees } from './Tree'

interface MainViewProps {
  multiTreesData: SingleTreeData[]
  translate: Translate
  customLink: CustomLink
  customNode: CustomNode
  initTreesBound: RectSize[]
  viewport: RectSize
  toggleNode: (nodeId: string) => void
  onNodeClick?: (node: TreeNodeDatum) => void
  adjustPosition: RectSize
  zoomToFitViewportScale: number
  gapBetweenTrees: number
}

const MainView = forwardRef<SVGSVGElement, MainViewProps>(
  (
    {
      multiTreesData,
      translate,
      viewport,
      customLink,
      customNode,
      initTreesBound,
      toggleNode,
      onNodeClick,
      adjustPosition,
      zoomToFitViewportScale,
      gapBetweenTrees,
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
              // treeNodeDatum={treeNodeDatum}
              multiTreesData={multiTreesData}
              initTreesBound={initTreesBound}
              customLink={customLink}
              customNode={customNode}
              scale={zoomToFitViewportScale}
              gapBetweenTrees={gapBetweenTrees}
              toggleNode={toggleNode}
              onNodeClick={onNodeClick}
            />
          </g>
        </g>
      </svg>
    )
  }
)

export default MainView
