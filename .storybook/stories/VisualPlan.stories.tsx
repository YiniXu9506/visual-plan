import React from 'react'

import { VisualPlan } from '../../src'
import '../../src/style/index.less'
import mockData from './vp_mock.json'

export default {
  title: 'Example/VisualPlan',
  Component: VisualPlan,
}

export const Basic = () => (
  <div style={{ height: 600 }}>
    <VisualPlan data={mockData as any} />
  </div>
)
