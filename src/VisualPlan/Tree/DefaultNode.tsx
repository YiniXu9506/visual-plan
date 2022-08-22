import React, { useContext, useEffect, useState } from 'react'
import {
  PlusOutlined,
  MinusOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'

import { CustomNode, NodeProps } from '../../types'
import { ThemeContext } from '../../context/ThemeContext'

const collapsableButtonSize = {
  width: 60,
  height: 30,
}


const RenderDefaultNodeElement: React.FC<NodeProps> = ({
  node,
  onToggle,
  onClick,
}) => {
  const nodeDatum = node.data
  const [nodeSize, setNodeSize] = useState({ width: 250, height: 200 })
  const [tableName, setTableName] = useState(null)

  // const { width: nodeSize.width, height: nodeSize.height } =
  //   nodeDatum.__node_attrs.nodeFlexSize!

  const { x, y } = node
  const nodeTranslate = {
    x: x - nodeSize.width / 2,
    y: y,
    k: 1,
  }

  // const handleOnNodeDetailClick = (e, node) => {
  //   onNodeDetailClick(node)
  // }

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

  const getTableName = () => {
    let tableName = null
    if (nodeDatum.accessObjects.length === 0) return null

    const scanObject = nodeDatum.accessObjects.find(obj =>
      Object.keys(obj).includes('scanObject')
    )

    if (scanObject) {
      tableName = scanObject['scanObject']['table']
    }

    return tableName
  }

  useEffect(() => {
    setTableName(getTableName())
  }, [nodeDatum])

  return (
    <React.Fragment>
      <g
        className={theme}
        transform={`translate(${nodeTranslate.x}, ${nodeTranslate.y}) scale(${nodeTranslate.k})`}
      >
        <rect
          width={nodeSize.width}
          height={nodeSize.height}
          x={0}
          y={0}
          fill="none"
        ></rect>
        <foreignObject
          className="nodeForeginObject"
          width={nodeSize.width}
          height={nodeSize.height}
          x={0}
          y={0}
        >
          <div style={{ width: nodeSize.width, height: nodeSize.height }}>
            <div
              className="nodeCard"
              style={{
                width: nodeSize.width,
                height: nodeSize.height - collapsableButtonSize.height,
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
                  Estimate Rows: <span>{nodeDatum.estRows}</span>
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
                  marginLeft: (nodeSize.width - 60) / 2,
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
  nodeSize: {width: 250, height: 200},
  nodeMargin: {
    siblingMargin: 40,
    childrenMargin: 60,
  },
  renderNodeElement: RenderDefaultNodeElement,
}
