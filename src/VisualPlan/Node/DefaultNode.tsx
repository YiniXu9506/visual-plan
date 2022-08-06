import React from 'react'
import Card from 'antd/es/card'
import 'antd/lib/card/style/index.css'
import {
  PlusOutlined,
  MinusOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
// import { toFixed } from '@baurine/grafana-value-formats'

import styles from './DefaultNode.module.less'

import { RectSize, TreeNodeDatum } from '../types'

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

  return (
    <React.Fragment>
      <g
        className="node"
        transform={`translate(${nodeTranslate.x}, ${nodeTranslate.y}) scale(${nodeTranslate.k})`}
      >
        <rect
          className="node-rect"
          width={nodeWidth}
          height={nodeHeight}
          x={0}
          y={0}
          fill="none"
        ></rect>
        <foreignObject
          className={styles.NodeForeginObject}
          width={nodeWidth}
          height={nodeHeight}
          x={0}
          y={0}
        >
          <div
            className="node-foreign-object-div"
            style={{ width: nodeWidth, height: nodeHeight }}
          >
            <Card
              size="small"
              title={nodeDatum.name}
              extra={
                nodeDatum.diagnosis?.length > 0 && (
                  <>
                    <ExclamationCircleFilled
                      style={{ color: '#fa7070', paddingRight: 5 }}
                    />
                    {nodeDatum.diagnosis?.length}
                  </>
                )
              }
              className={styles.nodeCard}
              style={{
                width: nodeWidth,
                height: nodeHeight - collapsableButtonSize.height,
                position: 'initial',
              }}
              // onClick={e => handleOnNodeDetailClick(e, nodeDatum)}
              headStyle={{ backgroundColor: headColor(nodeDatum.storeType) }}
            >
              <div className={styles.cardContentP}>
                Duration: <span>{nodeDatum.duration}</span>
              </div>
              <div className={styles.cardContentP}>
                Actual Rows: <span>{nodeDatum.actRows}</span>
              </div>
              <div className={styles.cardContentP}>
                {/* Estimate Rows: <span>{toFixed(nodeDatum.estRows)}</span> */}
                Estimate Rows: <span>{nodeDatum.estRows}</span>
              </div>
              <div className={styles.cardContentP}>
                Run at: <span>{nodeDatum.storeType}</span>
              </div>
            </Card>
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
  nodeSize: { width: 250, height: 180 },
  nodeMargin: {
    siblingMargin: 40,
    childrenMargin: 60,
  },
  renderNodeElement: RenderDefaultNodeElement,
}
