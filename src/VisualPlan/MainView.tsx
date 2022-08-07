import React from 'react'

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
  classNamePrefix: string
  translate: Translate
  customLink: CustomLink
  customNode: CustomNode
  viewport: RectSize
  toggleNode: (nodeId: string) => void
  // onNodeDetailClick: (node: TreeNodeDatum) => void
  getTreePosition: (treeIdx: number) => any
  adjustPosition: RectSize
  zoomToFitViewportScale: number
}

const MainView = ({
  treeNodeDatum,
  classNamePrefix,
  translate,
  viewport,
  customLink,
  customNode,
  toggleNode,
  // onNodeDetailClick,
  adjustPosition,
  zoomToFitViewportScale,
  getTreePosition,
}: MainViewProps) => {
  return (
    <svg
      className={`${classNamePrefix}SVG`}
      width={viewport.width}
      height={viewport.height}
    >
      <g
        className={`${classNamePrefix}GroupWrapper`}
        transform={`translate(${translate.x}, ${translate.y}) scale(${translate.k})`}
      >
        <g
          className={`${classNamePrefix}Group`}
          transform={`translate(${adjustPosition.width}, ${adjustPosition.height}) scale(1)`}
        >
          <Trees
            {...{
              treeNodeDatum,
              zoomToFitViewportScale,
              customLink,
              customNode,
              toggleNode,
              // onNodeDetailClick,
              getTreePosition,
            }}
          />
        </g>
      </g>
    </svg>
  )
}

export default MainView
