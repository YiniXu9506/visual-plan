import React from 'react'

import { VisualPlan,VisualPlanThumbnail } from '../../src'
import mockData from './vp_mock.json'

export default {
  title: 'Example/VisualPlan',
  Component: VisualPlan,
}

export const Basic = () => (
  <div style={{ height: 600 }}>
    <VisualPlan data={mockData as any} />
    {/* <VisualPlanThumbnail data={mockData as any} /> */}
  </div>
)
