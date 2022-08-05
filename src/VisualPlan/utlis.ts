import { flextree } from 'd3-flextree'
import { hierarchy } from 'd3'

import { RawNodeDatum, TreeNodeDatum, nodeMarginType, rectSize } from './types'

let incrementId = 0

export const AssignInternalProperties = (
  data: RawNodeDatum[],
  nodeFlexSize: rectSize
): TreeNodeDatum[] => {
  const d = Array.isArray(data) ? data : [data]
  return d.map(n => {
    const nodeDatum = n as TreeNodeDatum
    // assign default properties.
    nodeDatum.__node_attrs = {
      id: '',
      collapsed: false,
      collapsiable: false,
      isNodeDetailVisible: false,
      nodeFlexSize: {
        width: nodeFlexSize.width,
        height: nodeFlexSize.height,
      },
    }
    nodeDatum.__node_attrs.id = `${++incrementId}`

    // If there are children, recursively assign properties to them too.
    if (nodeDatum.children && nodeDatum.children.length > 0) {
      nodeDatum.__node_attrs.collapsiable = true
      nodeDatum.children = AssignInternalProperties(
        nodeDatum.children,
        nodeFlexSize
      )
    }
    return nodeDatum
  })
}

export const generateNodesAndLinks = (
  treeNodeDatum: TreeNodeDatum,
  nodeMargin: nodeMarginType
) => {
  const tree = flextree({
    nodeSize: node => {
      const _nodeSize = node.data.__node_attrs.nodeFlexSize

      return [
        _nodeSize.width + nodeMargin.siblingMargin,
        _nodeSize.height + nodeMargin.childrenMargin,
      ]
    },
  })

  const rootNode = tree(
    hierarchy(treeNodeDatum, d =>
      d.__node_attrs.collapsed ? null : d.children
    )
  )

  const nodes = rootNode.descendants()
  const links = rootNode.links()

  return { nodes, links }
}