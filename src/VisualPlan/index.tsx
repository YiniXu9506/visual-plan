import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from 'react'
import { VisualPlanProps, TreeNodeDatum, RectSize, THEME } from './types'

import { DefaultNode } from './Node/DefaultNode'
import { DefaultLink } from './Link/DefaultLink'
import MainChart from './MainChart'
import Minimap from './Minimap'
import { DetailDrawer } from '../DetailDrawer'

import { ThemeContext } from './context/ThemeContext'

import {
  AssignInternalProperties,
  findNodesById,
  expandSpecificNode,
  collapseAllDescententNodes,
} from './utlis'

import {
  select,
  zoom as d3Zoom,
  zoomIdentity,
  event,
  scaleLinear,
  brush as d3Brush,
} from 'd3'

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
   * @returns a continuous linear scale function to calculate the corresponding width in mainChart or minimap
   *
   * minimapScaleX(zoomScale)(widthOnMinimap) will return corresponding widthOnMainChart
   * minimapScaleX(zoomScale).invert(widthOnMainChart) will return corresponding widthOnMinimap
   */
  const minimapScaleX = (zoomScale: number) => {
    return scaleLinear()
      .domain([0, multiTreesBound.width])
      .range([0, multiTreesBound.width * zoomScale])
  }

  // Creates a continuous linear scale to calculate the corresponse height in mainChart or minimap
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
    <ThemeContext.Provider value={{ themeType: theme! }}>
      <div
        ref={treeDiagramContainerRef}
        className={`treeDiagramContainer ${theme}`}
      >
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
        {minimap && multiTreesViewport.height && (
          <Minimap
            treeNodeDatum={treeNodeDatum}
            classNamePrefix="minimapMultiTrees"
            viewport={multiTreesViewport}
            customLink={customLink!}
            customNode={customNode!}
            multiTreesBound={multiTreesBound}
            minimapScale={minimap['scale']}
            minimapScaleX={minimapScaleX}
            minimapScaleY={minimapScaleY}
            multiTreesSVG={multiTreesSVGSelection}
            updateTreeTranslate={handleUpdateTreeTranslate}
            brushBehavior={brushBehavior}
            brushRef={brushRef}
            adjustPosition={adjustPosition}
            zoomToFitViewportScale={zoomToFitViewportScale}
            getTreePosition={getInitSingleTreeBound}
          />
        )}
      </div>
    </ThemeContext.Provider>
  )
}

VisualPlan.defaultProps = {
  customNode: DefaultNode,
  customLink: DefaultLink,
  cte: {
    gap: 100,
  },
  theme: THEME.DARK,
  minimap: { scale: 0.15 },
}

export default VisualPlan
