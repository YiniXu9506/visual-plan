import { useState } from '@storybook/addons'
import React from 'react'

import { VisualPlan, VisualPlanThumbnail } from '../../src'
import { DetailDrawer } from '../../src/DetailDrawer'
import { RawNodeDatum } from '../../src/VisualPlan/types'
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

export const WithDetailDrawer = () => {
  const [detailData, setDetailData] = useState<RawNodeDatum | null>(null)

  return (
    <div style={{ position: 'relative', height: 300 }}>
      <VisualPlan data={mockData as any} onNodeClick={n => console.log(n)} />
      <DetailDrawer data={detailData!} visible={!!detailData} />
    </div>
  )
}
