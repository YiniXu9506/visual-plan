import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  PlusOutlined,
  MinusOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'

import { CustomNode, NodeProps, RectSize, TreeNodeDatum } from '../../types'
import { ThemeContext } from '../../context/ThemeContext'
import { getTableName, toFixed } from '../../utlis'

const collapsableButtonSize = {
  width: 60,
  height: 30,
}

const _calcNodeSize = (datum: TreeNodeDatum): RectSize => {
  let nodeSize = { width: 280, height: 200 }
  const tableName = getTableName(datum)
  if (tableName) {
    nodeSize = { width: 280, height: 230 }
  }

  return nodeSize
}

const RenderDefaultNodeElement: React.FC<NodeProps> = ({
  node,
  onToggle,
  onClick,
}) => {
  const nodeDatum = node.data
  const tableName = useMemo(() => getTableName(nodeDatum), [nodeDatum])

  const { width: nodeWidth, height: nodeHeight } =
    nodeDatum.__node_attrs.nodeFlexSize!

  const { x, y } = node
  const nodeTranslate = {
    x: x - nodeWidth / 2,
    y: y,
    k: 1,
  }

  const headColor = (runAt: string): string => {
    switch (runAt) {
      case 'tidb':
        return '#FFF5EB'
      case 'tikv':
        return '#DEEDF0'
      case 'tiflash':
        return '#FFDAFE'
      default:
        return ''
    }
  }

  const { theme } = useContext(ThemeContext)

  return (
    <React.Fragment>
      <g
        className={theme}
        transform={`translate(${nodeTranslate.x}, ${nodeTranslate.y}) scale(${nodeTranslate.k})`}
      >
        <rect
          width={nodeWidth}
          height={nodeHeight}
          x={0}
          y={0}
          fill="none"
        ></rect>
        <foreignObject
          className="nodeForeginObject"
          width={nodeWidth}
          height={nodeHeight}
          x={0}
          y={0}
        >
          <div style={{ width: nodeWidth, height: nodeHeight }}>
            <div
              className="nodeCard"
              style={{
                width: nodeWidth,
                height: nodeHeight - collapsableButtonSize.height,
                position: 'initial',
              }}
              onClick={() => onClick?.(nodeDatum)}
            >
              <div
                className="card-header"
                style={{ backgroundColor: headColor(nodeDatum.storeType) }}
              >
                <div className="title">{nodeDatum.name}</div>
                <div className="extra">
                  {nodeDatum.diagnosis?.length > 0 && (
                    <>
                      <ExclamationCircleFilled
                        style={{ color: '#fa7070', paddingRight: 5 }}
                      />
                      {nodeDatum.diagnosis?.length}
                    </>
                  )}
                </div>
              </div>
              <div className="card-body">
                <p className="content">
                  Duration: <span>{nodeDatum.duration}</span>
                </p>
                <p className="content">
                  Actual Rows: <span>{nodeDatum.actRows}</span>
                </p>
                <p className="content">
                  Estimate Rows: <span>{toFixed(nodeDatum.estRows, 0)}</span>
                </p>
                <p className="content">
                  Run at: <span>{nodeDatum.storeType}</span>
                </p>
                {tableName && (
                  <p className="content">
                    Table: <span>{tableName}</span>
                  </p>
                )}
              </div>
            </div>
            {nodeDatum.__node_attrs.collapsiable && (
              <button
                className="vp-btn"
                style={{
                  width: collapsableButtonSize.width,
                  height: collapsableButtonSize.height,
                  marginLeft: (nodeWidth - 60) / 2,
                  position: 'initial',
                }}
                onClick={() => onToggle(nodeDatum)}
              >
                {nodeDatum.__node_attrs.collapsed ? (
                  <PlusOutlined />
                ) : (
                  <MinusOutlined />
                )}
              </button>
            )}
          </div>
        </foreignObject>
      </g>
    </React.Fragment>
  )
}

export const DefaultNode: CustomNode = {
  calcNodeSize: (datum: TreeNodeDatum) => _calcNodeSize(datum),
  nodeMargin: {
    siblingMargin: 40,
    childrenMargin: 60,
  },
  renderNodeElement: RenderDefaultNodeElement,
}
