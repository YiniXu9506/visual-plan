import React from 'react'

import { VisualPlan } from '../../src/VisualPlan'
import mockData from './vp_mock.json'

export default {
  title: 'Example/VisualPlan',
  Component: VisualPlan,
}

export const Basic = () => (
  <VisualPlan data={mockData as any} viewport={{ height: 500, width: 1000 }} />
)
