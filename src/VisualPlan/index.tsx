import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  select,
  zoom as d3Zoom,
  zoomIdentity,
  scaleLinear,
  brush as d3Brush,
} from 'd3'

import { VisualPlanProps, TreeNodeDatum, RectSize } from '../types'
import { ThemeContext } from '../context/ThemeContext'
import {
  AssignInternalProperties,
  findNodesById,
  expandSpecificNode,
  collapseAllDescententNodes,
} from '../utlis'
import MainView from './MainView'
import Minimap from './Minimap'
import { DefaultNode } from './Tree/DefaultNode'
import { DefaultLink } from './Tree/DefaultLink'

const VisualPlan = ({
  data,
  customNode = DefaultNode,
  customLink = DefaultLink,
  minimap,
  theme,
  onNodeClick,
  cte,
}: VisualPlanProps) => {
  const gapBetweenTrees = cte!.gap
  const [treeNodeDatum, setTreeNodeDatum] = useState<TreeNodeDatum[]>([])
  const [multiTreesViewport, setMultiTreesViewport] = useState<RectSize>({
    width: 0,
    height: 0,
  })

  const [zoomToFitViewportScale, setZoomToFitViewportScale] = useState(0)
  const [adjustPosition, setAdjustPosition] = useState({ width: 0, height: 0 })

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
  const mainViewRef = useRef<SVGSVGElement>(null)
  const mainViewSelection = select(mainViewRef.current)
  const treeDiagramContainerRef = useRef<HTMLDivElement>(null)
  const brushRef = useRef<SVGGElement>(null)
  const brushSelection = select(brushRef.current!)

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

  const onZoom = event => {
    const t = event.transform
    setMultiTreesTranslate(t)

    // Moves brush on minimap when zoom behavior is triggered.
    brushBehavior.move(brushSelection, [
      [minimapScaleX(t.k).invert(-t.x), minimapScaleY(t.k).invert(-t.y)],
      [
        minimapScaleX(t.k).invert(-t.x + multiTreesViewport.width),
        minimapScaleY(t.k).invert(-t.y + multiTreesViewport.height),
      ],
    ])
  }

  // TODO: Limits zoom extent
  const zoomBehavior = d3Zoom()
    // set scale extent according to the whole tree scale
    .scaleExtent([0.5 * zoomToFitViewportScale, 2 / zoomToFitViewportScale])
    .on('zoom', event => onZoom(event))

  // Binds MainView container
  const bindZoomListener = useCallback(() => {
    mainViewSelection.call(zoomBehavior as any)

    mainViewSelection.call(
      d3Zoom().transform as any,
      zoomIdentity
        .translate(multiTreesTranslate.x, multiTreesTranslate.y)
        .scale(multiTreesTranslate.k)
    )
  }, [zoomToFitViewportScale])

  // Limits brush move extent
  const brushBehavior = d3Brush()

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

  /**
   *
   * @param zoomScale
   * @returns a continuous linear scale function to calculate the corresponding width in MainView or minimap
   *
   * minimapScaleX(zoomScale)(widthOnMinimap) will return corresponding widthOnMainView
   * minimapScaleX(zoomScale).invert(widthOnMainView) will return corresponding widthOnMinimap
   */
  const minimapScaleX = (zoomScale: number) => {
    return scaleLinear()
      .domain([0, multiTreesBound.width])
      .range([0, multiTreesBound.width * zoomScale])
  }

  // Creates a continuous linear scale to calculate the corresponse height in MainView or minimap
  const minimapScaleY = (zoomScale: number) => {
    return scaleLinear()
      .domain([0, multiTreesBound.height])
      .range([0, multiTreesBound.height * zoomScale])
  }

  const handleUpdateTreeTranslate = (
    zoomScale: number,
    brushX: number,
    brushY: number
  ) => {
    setMultiTreesTranslate({
      x: minimapScaleX(zoomScale)(-brushX)!,
      y: minimapScaleY(zoomScale)(-brushY)!,
      k: zoomScale,
    })
  }

  useEffect(() => {
    const _data = [data.main, ...(data.ctes || [])]
    // Assigns all internal properties to tree node
    const treeNodes = AssignInternalProperties(_data, customNode?.calcNodeSize)
    setTreeNodeDatum(treeNodes)
  }, [data, customNode?.calcNodeSize])

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
  }, [multiTreesBound, bindZoomListener])

  return (
    <ThemeContext.Provider value={{ theme: theme! }}>
      <div
        ref={treeDiagramContainerRef}
        className={`treeDiagramContainer ${theme}`}
      >
        <MainView
          ref={mainViewRef}
          treeNodeDatum={treeNodeDatum}
          translate={multiTreesTranslate}
          viewport={multiTreesViewport}
          customLink={customLink!}
          customNode={customNode!}
          toggleNode={handleNodeToggle}
          adjustPosition={adjustPosition}
          zoomToFitViewportScale={zoomToFitViewportScale}
          gapBetweenTrees={gapBetweenTrees}
          onNodeClick={onNodeClick}
          onUpdate={rect => setMultiTreesBound(rect)}
        />
        {minimap && multiTreesViewport.height && (
          <Minimap
            treeNodeDatum={treeNodeDatum}
            viewport={multiTreesViewport}
            customLink={customLink!}
            customNode={customNode!}
            multiTreesBound={multiTreesBound}
            minimapScale={minimap['scale']}
            minimapScaleX={minimapScaleX}
            minimapScaleY={minimapScaleY}
            multiTreesSVG={mainViewSelection}
            updateTreeTranslate={handleUpdateTreeTranslate}
            brushBehavior={brushBehavior}
            brushRef={brushRef}
            adjustPosition={adjustPosition}
            zoomToFitViewportScale={zoomToFitViewportScale}
            gapBetweenTrees={gapBetweenTrees}
          />
        )}
      </div>
    </ThemeContext.Provider>
  )
}

VisualPlan.defaultProps = {
  cte: {
    gap: 100,
  },
  theme: 'light',
  minimap: { scale: 0.15 },
}

export default VisualPlan
