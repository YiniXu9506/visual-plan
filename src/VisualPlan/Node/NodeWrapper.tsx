import React from 'react'
import { TreeNodeDatum } from '../types'
import { HierarchyPointNode } from 'd3'

interface NodeWrapperProps {
  nodeData: HierarchyPointNode<TreeNodeDatum>
  renderCustomNodeElement: (node: HierarchyPointNode<TreeNodeDatum>) => JSX.Element
  zoomScale?: number
  onNodeExpandBtnToggle?: (nodeId: string) => void
  onNodeDetailClick?: (node: TreeNodeDatum) => void
}

const NodeWrapper = ({
  nodeData,
  renderCustomNodeElement
}: NodeWrapperProps) => {
  // const renderNode = () => {
  //   const nodeProps = {
  //     hierarchyPointNode: hierarchyPointNode,
  //     onNodeExpandBtnToggle: onNodeExpandBtnToggle,
  //     onNodeDetailClick: onNodeDetailClick
  //   }

  //   return renderCustomNodeElement(nodeProps)
  // }

  return <>{renderCustomNodeElement(nodeData)}</>
}

export default NodeWrapper
