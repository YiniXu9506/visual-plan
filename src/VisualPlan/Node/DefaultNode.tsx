import React, { useContext } from 'react'
import {
  PlusOutlined,
  MinusOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'

import { TreeNodeDatum } from '../types'

import { ThemeContext } from '../context/ThemeContext'

import { HierarchyPointNode } from 'd3'

const collapsableButtonSize = {
  width: 60,
  height: 30,
}

const RenderDefaultNodeElement = (
  hierarchyPointNode: HierarchyPointNode<TreeNodeDatum>,
  handleNodeToggle
) => {
  const nodeDatum = hierarchyPointNode.data
  const { width: nodeWidth, height: nodeHeight } =
    nodeDatum.__node_attrs.nodeFlexSize!

  const { x, y } = hierarchyPointNode
  const nodeTranslate = {
    x: x - nodeWidth / 2,
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
              // onClick={e => handleOnNodeDetailClick(e, nodeDatum)}
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
                onClick={handleNodeToggle}
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

export const DefaultNode = {
  nodeSize: { width: 250, height: 200 },
  nodeMargin: {
    siblingMargin: 40,
    childrenMargin: 60,
  },
  renderNodeElement: RenderDefaultNodeElement,
}
