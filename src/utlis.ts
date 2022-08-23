import { flextree } from 'd3-flextree'
import { hierarchy } from 'd3'

import { RawNodeDatum, TreeNodeDatum, NodeMargin, RectSize } from './types'

let incrementId = 0

export const AssignInternalProperties = (
  data: RawNodeDatum[],
  calcNodeFlexSize: (datum: TreeNodeDatum) => RectSize
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
      nodeFlexSize: calcNodeFlexSize(nodeDatum),
    }
    nodeDatum.__node_attrs.id = `${++incrementId}`

    // If there are children, recursively assign properties to them too.
    if (nodeDatum.children && nodeDatum.children.length > 0) {
      nodeDatum.__node_attrs.collapsiable = true
      nodeDatum.children = AssignInternalProperties(
        nodeDatum.children,
        calcNodeFlexSize
      )
    }
    return nodeDatum
  })
}

export const generateNodesAndLinks = (
  treeNodeDatum: TreeNodeDatum,
  nodeMargin: NodeMargin
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

export const findNodesById = (
  nodeId: string,
  nodeSet: TreeNodeDatum[],
  hits: TreeNodeDatum[]
) => {
  if (hits.length > 0) {
    return hits
  }
  hits = hits.concat(nodeSet.filter(node => node.__node_attrs.id === nodeId))

  nodeSet.forEach(node => {
    if (node.children && node.children.length > 0) {
      hits = findNodesById(nodeId, node.children, hits)
    }
  })
  return hits
}

export const expandSpecificNode = (nodeDatum: TreeNodeDatum) => {
  nodeDatum.__node_attrs.collapsed = false
}

export const collapseAllDescententNodes = (nodeDatum: TreeNodeDatum) => {
  nodeDatum.__node_attrs.collapsed = true
  if (nodeDatum.children && nodeDatum.children.length > 0) {
    nodeDatum.children.forEach(child => {
      collapseAllDescententNodes(child)
    })
  }
}

export type DecimalCount = number | null | undefined

export function toFixed(value, decimals?: DecimalCount): string {
  if (value === null) {
    return ''
  }
  if (
    value === Number.NEGATIVE_INFINITY ||
    value === Number.POSITIVE_INFINITY
  ) {
    return value.toLocaleString()
  }

  const factor = decimals ? Math.pow(10, Math.max(0, decimals)) : 1
  const formatted = String(Math.round(value * factor) / factor)

  if (formatted.indexOf('e') !== -1 || value === 0) {
    return formatted
  }

  if (decimals != null) {
    const decimalPos = formatted.indexOf('.')
    const precision = decimalPos === -1 ? 0 : formatted.length - decimalPos - 1
    if (precision < decimals) {
      return (
        (precision ? formatted : formatted + '.') +
        String(factor).substr(1, decimals - precision)
      )
    }
  }

  return formatted
}

export function scaledUnits(factor: number, extArray: string[]) {
  return (size, decimals?: DecimalCount, scaledDecimals?: DecimalCount) => {
    if (size === null) {
      return ''
    }
    if (
      size === Number.NEGATIVE_INFINITY ||
      size === Number.POSITIVE_INFINITY ||
      isNaN(size)
    ) {
      return size.toLocaleString()
    }

    let steps = 0
    const limit = extArray.length

    while (Math.abs(size) >= factor) {
      steps++
      size /= factor

      if (steps >= limit) {
        return 'NA'
      }
    }

    if (steps > 0 && scaledDecimals !== null && scaledDecimals !== undefined) {
      decimals = scaledDecimals
    }

    return toFixed(size, decimals) + extArray[steps]
  }
}

export function decimalSIPrefix(unit: string, offset = 0) {
  let prefixes = ['n', 'µ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
  prefixes = prefixes.slice(3 + (offset || 0))
  const units = prefixes.map(p => {
    return ' ' + p + unit
  })
  return scaledUnits(1000, units)
}

export function getTableName(node: RawNodeDatum): string {
  let tableName = ''
  if (!node?.accessObjects?.length) return ''

  const scanObject = node.accessObjects.find(obj =>
    Object.keys(obj).includes('scanObject')
  )

  if (scanObject) {
    tableName = scanObject['scanObject']['table']
  }

  return tableName
}
