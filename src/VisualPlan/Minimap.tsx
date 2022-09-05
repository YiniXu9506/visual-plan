import React, { MutableRefObject, Ref, useEffect, useRef } from 'react'
import {
  select,
  event,
  brush as d3Brush,
  BrushBehavior,
  zoom as d3Zoom,
  zoomIdentity,
  zoomTransform,
} from 'd3'

import { Trees } from './Tree'
import {
  RectSize,
  NodeMargin,
  CustomLink,
  CustomNode,
  SingleTreeNodesAndLinks,
  SingleTreeBound,
} from '../types'

interface MinimapProps {
  multiTreesNodesAndLinks: SingleTreeNodesAndLinks[]
  initTreesBound: SingleTreeBound[]
  viewport: RectSize
  multiTreesBound: RectSize
  customLink: CustomLink
  customNode: CustomNode
  minimapScale: number
  minimapScaleX?: any
  minimapScaleY?: any
  multiTreesSVG?: any
  updateTreeTranslate?: (
    zoomScale: number,
    brushX: number,
    brushY: number
  ) => void
  brushBehavior?: BrushBehavior<any>
  brushRef?: Ref<SVGGElement>
  adjustPosition: RectSize
  zoomToFitViewportScale: number
  nodeMargin?: NodeMargin
  gapBetweenTrees: number
}

const Minimap = ({
  multiTreesNodesAndLinks,
  initTreesBound,
  viewport,
  multiTreesBound,
  customLink,
  customNode,
  minimapScale,
  minimapScaleX,
  minimapScaleY,
  multiTreesSVG,
  updateTreeTranslate,
  adjustPosition,
  zoomToFitViewportScale,
  gapBetweenTrees,
  brushRef,
}: MinimapProps) => {
  const minimapContainer = {
    width: viewport.width * minimapScale,
    height: viewport.height * minimapScale,
  }

  const { width: multiTreesBoundWidth, height: multiTreesBoundHeight } =
    multiTreesBound

  const _brushRef = useRef<SVGGElement>(null)
  const brushSelection = select(_brushRef.current!)
  const minimapContainerRef = useRef(null)
  const minimapSVGRef = useRef<SVGSVGElement>(null)
  const minimapSVGSelection = select(minimapSVGRef.current)
  const minimapTreesRef = useRef<SVGGElement>(null)
  const minimapMultiTreesGroupSelection = select(minimapTreesRef.current)
  const minimapRef = useRef<SVGRectElement>(null)

  const drawMinimap = () => {
    minimapSVGSelection
      .attr('width', minimapContainer.width)
      .attr('height', minimapContainer.height)
      .attr('viewBox', [0, 0, viewport.width, viewport.height].join(' '))
      .attr('preserveAspectRatio', 'xMidYMid meet')

    select(minimapRef.current)
      .attr('width', viewport.width)
      .attr('height', viewport.height)

    minimapMultiTreesGroupSelection
      .attr('width', multiTreesBoundWidth)
      .attr('height', multiTreesBoundHeight)
  }

  const onBrush = () => {
    if (event.sourceEvent && event.sourceEvent.type === 'zoom') return null
    if (Array.isArray(event.selection)) {
      const [[brushX, brushY]] = event.selection

      const zoomScale = zoomTransform(multiTreesSVG.node() as any)

      // Sets initial offset, so that first pan and zoom does not jump back to default [0,0] coords.
      // @ts-ignore
      multiTreesSVG.call(
        d3Zoom().transform as any,
        zoomIdentity
          .translate(
            minimapScaleX!(zoomScale.k)(-brushX)!,
            minimapScaleY!(zoomScale.k)(-brushY)!
          )
          .scale(zoomScale.k)
      )

      // Handles tree translate update when brush moves
      updateTreeTranslate!(zoomScale.k, brushX, brushY)
    }
  }

  // TODO: Limits brush move extent
  const brushBehavior = d3Brush().on('brush', () => onBrush())

  const bindBrushListener = () => {
    brushSelection.call(brushBehavior)

    // init brush seletion
    brushBehavior.move(brushSelection, [
      [0, 0],
      [viewport.width, viewport.height],
    ])
  }

  useEffect(() => {
    if (minimapContainerRef.current && _brushRef.current) {
      drawMinimap()
      bindBrushListener()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minimapContainerRef.current, _brushRef.current])

  useEffect(() => {
    // Removes these elements can avoid re-select brush on minimap
    minimapSVGSelection.selectAll('.handle').remove()
    minimapSVGSelection.selectAll('.overlay').remove()
  })

  useEffect(() => {
    if (!_brushRef.current || !brushRef) {
      return
    }
    ;(brushRef as MutableRefObject<SVGGElement>).current = _brushRef.current
  }, [brushRef])

  return (
    <div ref={minimapContainerRef} className={`minimapContainer`}>
      <svg
        ref={minimapSVGRef}
        className="minimapMultiTreesSVG"
        width={minimapContainer.width}
        height={minimapContainer.height}
      >
        <rect className="minimap-rect" ref={minimapRef}></rect>
        <g className="minimapMultiTreesGroupWrapper" ref={minimapTreesRef}>
          <g
            className="minimapMultiTreesGroup"
            transform={`translate(${adjustPosition.width}, ${adjustPosition.height}) scale(1)`}
          >
            <Trees
              multiTreesNodesAndLinks={multiTreesNodesAndLinks}
              initTreesBound={initTreesBound}
              customLink={customLink}
              customNode={customNode}
              scale={zoomToFitViewportScale}
              gapBetweenTrees={gapBetweenTrees}
            />
          </g>
        </g>
        <g ref={_brushRef} className="minimap-brush"></g>
      </svg>
    </div>
  )
}

export default Minimap
