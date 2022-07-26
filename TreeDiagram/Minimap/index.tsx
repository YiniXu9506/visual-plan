import React, { MutableRefObject, Ref, useEffect, useRef } from 'react'
import { select, event } from 'd3'
import { brush as d3Brush, BrushBehavior } from 'd3'
import { zoom as d3Zoom, zoomIdentity, zoomTransform } from 'd3'

import { Trees } from '../MemorizedTrees'
import { rectBound, TreeNodeDatum, nodeMarginType } from '../types'

interface MinimapProps {
  treeNodeDatum: TreeNodeDatum[]
  classNamePrefix: string
  viewport: rectBound
  multiTreesBound: rectBound
  customLinkElement: JSX.Element
  customNodeElement: JSX.Element
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
  adjustPosition: rectBound
  zoomToFitViewportScale: number
  getTreePosition: (idx: number) => any
  nodeMargin?: nodeMarginType
}

const Minimap = ({
  treeNodeDatum,
  classNamePrefix,
  viewport,
  multiTreesBound,
  nodeMargin,
  customLinkElement,
  customNodeElement,
  minimapScale,
  minimapScaleX,
  minimapScaleY,
  multiTreesSVG,
  updateTreeTranslate,
  adjustPosition,
  zoomToFitViewportScale,
  getTreePosition,
  brushRef
}: MinimapProps) => {
  const minimapContainer = {
    width: viewport.width * minimapScale,
    height: viewport.height * minimapScale
  }
  const { width: multiTreesBoundWidth, height: multiTreesBoundHeight } =
    multiTreesBound

  const _brushRef = useRef<SVGGElement>(null)
  const brushSelection = select(_brushRef.current!)
  const minimapContainerRef = useRef(null)
  const minimapMultiTreesSVGSelection = select(`.${classNamePrefix}SVG`)
  const minimapMultiTreesGroupSelection = select(`.${classNamePrefix}Group`)

  const drawMinimap = () => {
    minimapMultiTreesSVGSelection
      .attr('width', minimapContainer.width)
      .attr('height', minimapContainer.height)
      .attr('viewBox', [0, 0, viewport.width, viewport.height].join(' '))
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('position', 'absolute')
      .style('top', 0)
      .style('left', 20)
      .style('border', '1px solid grey')
      .style('background', 'white')

    select('.minimap-rect')
      .attr('width', viewport.width)
      .attr('height', viewport.height)
      .attr('fill', 'white')

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
  const brushBehavior = d3Brush()
    // .extent([
    //   [
    //     minimapScaleX(1)(-viewport.width / 2),
    //     minimapScaleY(1)(-viewport.height / 2),
    //   ],
    //   [
    //     minimapScaleX(1)(multiTreesBoundWidth + viewport.width / 2),
    //     minimapScaleY(1)(multiTreesBoundHeight + viewport.height / 2),
    //   ],
    // ])
    .on('brush', () => onBrush())

  const bindBrushListener = () => {
    brushSelection.call(brushBehavior)

    // init brush seletion
    brushBehavior.move(brushSelection, [
      [0, 0],
      [viewport.width, viewport.height]
    ])
  }

  useEffect(() => {
    if (minimapContainerRef.current && _brushRef.current) {
      drawMinimap()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minimapContainerRef.current, _brushRef.current])

  useEffect(() => {
    bindBrushListener()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiTreesBound])

  useEffect(() => {
    // Removes these elements can avoid re-select brush on minimap
    minimapMultiTreesSVGSelection.selectAll('.handle').remove()
    minimapMultiTreesSVGSelection.selectAll('.overlay').remove()
  })

  useEffect(() => {
    if (!_brushRef.current || !brushRef) {
      return
    }
    ;(brushRef as MutableRefObject<SVGElement>).current = _brushRef.current
  }, [brushRef])

  return (
    <div ref={minimapContainerRef}>
      <svg
        className={`${classNamePrefix}SVG`}
        width={minimapContainer.width}
        height={minimapContainer.height}
      >
        <rect className="minimap-rect"></rect>
        <g className={`${classNamePrefix}GroupWrapper`}>
          <g
            className={`${classNamePrefix}Group`}
            transform={`translate(${adjustPosition.width}, ${adjustPosition.height}) scale(1)`}
          >
            <Trees
              {...{
                treeNodeDatum,
                nodeMargin: nodeMargin!,
                zoomToFitViewportScale,
                customLinkElement,
                customNodeElement,
                getTreePosition
              }}
            />
          </g>
        </g>
        <g ref={_brushRef}></g>
      </svg>
    </div>
  )
}

export default Minimap
