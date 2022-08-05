import React from 'react'

import { VisualPlan } from '../../src/VisualPlan'
import Tree from '../../src/TreeDiagram'
import mockData from './vp_mock.json'

export default {
  title: 'Example/VisualPlan',
  Component: Tree,
}

export const Basic = () => (
  <Tree data={mockData as any} viewport={{ height: 500, width: 1000 }} />
)
