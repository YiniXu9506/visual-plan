import React from 'react'

import { VisualPlan, VisualPlanThumbnail } from '../../src'
import mockData from './vp_mock.json'

export default {
  title: 'Example/VisualPlan',
  Component: VisualPlan,
}

export const Basic = () => (
  <div style={{ height: 300 }}>
    <VisualPlan data={mockData as any} />
  </div>
)

export const DarkTheme = () => (
  <div style={{ position: 'relative', height: 300 }}>
    <VisualPlan data={mockData as any} theme="dark" />
  </div>
)
