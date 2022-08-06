import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  TreeNodeDatum,
  ThemeType,
  NodeType,
  LinkType,
  BinaryPlan,
  NodeProps,
  LinkProps,
  RectSize,
} from './types'

import { DefaultNode } from './Node/DefaultNode'
import { DefaultLink } from './Link/DefaultLink'
import MainChart from './MainChart'

import {
  AssignInternalProperties,
  findNodesById,
  expandSpecificNode,
  collapseAllDescententNodes,
} from './utlis'

import { select, zoom as d3Zoom, zoomIdentity, event } from 'd3'

interface VisualPlanProps {
  // node raw data
  data: BinaryPlan

  // custom Node/Link render
  customNode?: NodeProps
  customLink?: LinkProps

  // properties used to calculate tree layout and transform
  getContainer?: HTMLElement
  cte?: {
    gap: number
  }

  // theme, default light mode
  theme?: ThemeType

  // minimap
  minimap?:
    | {
        scale?: number
      }
    | boolean

  // tree behavior
  onNodeClick?: (node: NodeType) => void
}

interface TreeBoundType {
  [k: string]: {
    x: number
    y: number
    width: number
    height: number
  }
}

const VisualPlan = ({
  data,
  customNode,
  customLink,
  getContainer,
  onNodeClick,
  cte,
}: VisualPlanProps) => {
  const gapBetweenTrees = cte!.gap
  const [treeNodeDatum, setTreeNodeDatum] = useState<TreeNodeDatum[]>([])
  const [multiTreesViewport, setMultiTreesViewport] = useState<RectSize>({
    // width: getContainer!.getBoundingClientRect().width,
    // height: getContainer!.getBoundingClientRect().height,
    width: 500,
    height: 500,
  })

  const [zoomToFitViewportScale, setZoomToFitViewportScale] = useState(0)
  const [adjustPosition, setAdjustPosition] = useState({ width: 0, height: 0 })
  const singleTreeBoundsMap = useRef<TreeBoundType>({})

  // Sets the bound of entire tree
  const [multiTreesBound, setMultiTreesBound] = useState({
    width: 0,
    height: 0,
  })

  // Inits tree translate, the default position is on the top-middle of canvas
  const [multiTreesTranslate, setMultiTreesTranslate] = useState({
    x: 0,
    y: 0,
    k: 1,
  })

  // A SVG container for main chart
  const multiTreesSVGSelection = select('.multiTreesSVG')
  const treeDiagramContainerRef = useRef<HTMLDivElement>(null)

  const getZoomToFitViewPortScale = () => {
    const widthRatio = multiTreesViewport.width / multiTreesBound.width
    const heightRation = multiTreesViewport.height / multiTreesBound.height
    const k = Math.min(widthRatio, heightRation)
    setZoomToFitViewportScale(k > 1 ? 1 : k)

    setAdjustPosition({
      width:
        k > 1
          ? (multiTreesViewport.width - multiTreesBound.width) / 2
          : (multiTreesViewport.width - multiTreesBound.width * k) / 2,
      height:
        k > 1
          ? (multiTreesViewport.height - multiTreesBound.height) / 2
          : (multiTreesViewport.height - multiTreesBound.height * k) / 2,
    })
  }

  // Updates multiTrees bound and returns single tree position, which contains root point and offset to original point [0,0].
  const getInitSingleTreeBound = useCallback(
    treeIdx => {
      let offset = 0
      let multiTreesBound: RectSize = { width: 0, height: 0 }
      const singleTreeGroupNode = select(
        `.singleTreeGroup-${treeIdx}`
      ).node() as SVGGraphicsElement

      const { x, y, width, height } = singleTreeGroupNode.getBBox()

      singleTreeBoundsMap.current[`singleTreeGroup-${treeIdx}`] = {
        x: x,
        y: y,
        width: width,
        height: height,
      }

      for (let i = treeIdx; i > 0; i--) {
        offset =
          offset +
          singleTreeBoundsMap.current[`singleTreeGroup-${i - 1}`].width +
          gapBetweenTrees

        multiTreesBound.width =
          multiTreesBound.width +
          singleTreeBoundsMap.current[`singleTreeGroup-${i - 1}`].width +
          gapBetweenTrees

        multiTreesBound.height =
          singleTreeBoundsMap.current[`singleTreeGroup-${i - 1}`].height >
          multiTreesBound.height
            ? singleTreeBoundsMap.current[`singleTreeGroup-${i - 1}`].height
            : multiTreesBound.height
      }

      setMultiTreesBound({
        width: multiTreesBound.width + width,
        height:
          multiTreesBound.height > height ? multiTreesBound.height : height,
      })

      return { x, y, offset }
    },
    [singleTreeBoundsMap, gapBetweenTrees]
  )

  const onZoom = () => {
    const t = event.transform
    setMultiTreesTranslate(t)

    // Moves brush on minimap when zoom behavior is triggered.
    // brushBehavior.move(brushSelection, [
    //   [minimapScaleX(t.k).invert(-t.x), minimapScaleY(t.k).invert(-t.y)],
    //   [
    //     minimapScaleX(t.k).invert(-t.x + multiTreesViewport.width),
    //     minimapScaleY(t.k).invert(-t.y + multiTreesViewport.height),
    //   ],
    // ])
  }

  // TODO: Limits zoom extent
  const zoomBehavior = d3Zoom()
    .scaleExtent([0.2, 5])
    .on('zoom', () => onZoom())

  // Binds MainChart container
  const bindZoomListener = () => {
    multiTreesSVGSelection.call(zoomBehavior as any)

    multiTreesSVGSelection.call(
      d3Zoom().transform as any,
      zoomIdentity
        .translate(multiTreesTranslate.x, multiTreesTranslate.y)
        .scale(multiTreesTranslate.k)
    )
  }

  const handleNodeToggle = useCallback(
    (nodeId: string) => {
      const data = treeNodeDatum.map(datum => ({ ...datum }))

      // @ts-ignore
      const matches = findNodesById(nodeId, data, [])

      const targetNodeDatum = matches[0]

      if (targetNodeDatum.__node_attrs.collapsed) {
        expandSpecificNode(targetNodeDatum)
      } else {
        collapseAllDescententNodes(targetNodeDatum)
      }

      setTreeNodeDatum(data)
    },
    [treeNodeDatum]
  )

  useEffect(() => {
    const _data = [data.main, ...(data.ctes || [])]
    // Assigns all internal properties to tree node
    const treeNodes = AssignInternalProperties(_data, customNode!.nodeSize)
    setTreeNodeDatum(treeNodes)
  }, [data, customNode!.nodeSize])

  useEffect(() => {
    if (treeDiagramContainerRef.current) {
      setMultiTreesViewport({
        width: treeDiagramContainerRef.current?.clientWidth,
        height: treeDiagramContainerRef.current?.clientHeight,
      })
      getZoomToFitViewPortScale()
      bindZoomListener()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiTreesBound])

  return (
    <div ref={treeDiagramContainerRef}>
      <MainChart
        treeNodeDatum={treeNodeDatum}
        classNamePrefix="multiTrees"
        translate={multiTreesTranslate}
        viewport={multiTreesViewport}
        customLink={customLink!}
        customNode={customNode!}
        toggleNode={handleNodeToggle}
        getTreePosition={getInitSingleTreeBound}
        adjustPosition={adjustPosition}
        zoomToFitViewportScale={zoomToFitViewportScale}
      />
    </div>
  )
}

VisualPlan.defaultProps = {
  customNode: DefaultNode,
  customLink: DefaultLink,
  getContainer: document.body,
  cte: {
    gap: 100,
  },
  theme: 'light',
  minimap: false,
}

export default VisualPlan
