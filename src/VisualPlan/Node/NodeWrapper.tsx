import React from 'react'
import { TreeNodeDatum } from '../types'
import { HierarchyPointNode } from 'd3'

interface NodeWrapperProps {
  data: HierarchyPointNode<TreeNodeDatum>
  toggleNode: (nodeId: string) => void
  renderCustomNodeElement: (
    node: HierarchyPointNode<TreeNodeDatum>,
    handleNodeToggle: () => void
  ) => JSX.Element
  // zoomScale?: number
  // onNodeDetailClick?: (node: TreeNodeDatum) => void
}

const NodeWrapper = ({
  data: hierarchyPointNode,
  toggleNode,
  renderCustomNodeElement,
}: NodeWrapperProps) => {
  const handleNodeToggle = () => {
    toggleNode(hierarchyPointNode.data.__node_attrs.id)
  }
  return <>{renderCustomNodeElement(hierarchyPointNode, handleNodeToggle)}</>
}

export default NodeWrapper
