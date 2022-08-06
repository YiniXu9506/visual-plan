import React from 'react'
import { TreeNodeDatum } from '../types'
import { HierarchyPointLink } from 'd3'

interface LinkWrapperProps {
  data: HierarchyPointLink<TreeNodeDatum>
  renderCustomLinkElement: (node: HierarchyPointLink<TreeNodeDatum>) => JSX.Element
}
 

const LinksWrapper = ({
  data: hierarchyPointLink,
  renderCustomLinkElement
}: LinkWrapperProps) => {
  return <>{renderCustomLinkElement(hierarchyPointLink)}</>
}

export default LinksWrapper
