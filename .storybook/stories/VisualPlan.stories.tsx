import { useState } from '@storybook/addons'
import React from 'react'

// import { VisualPlan } from '../../dist'
import { VisualPlan, VisualPlanThumbnail } from '../../src'
import { DetailDrawer } from '../../src/DetailDrawer'
import { RawNodeDatum } from '../../src/types'
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

export const DarkTheme = () => (
  <div style={{ position: 'relative', height: 600 }}>
    <VisualPlan data={mockData as any} theme="dark" />
  </div>
)

export const WithDetailDrawer = () => {
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [detailData, setDetailData] = useState<RawNodeDatum | null>(null)

  return (
    <div style={{ position: 'relative', height: 600 }}>
      <VisualPlan
        data={mockData as any}
        onNodeClick={n => {
          setDetailData(n)
          setShowDetailDrawer(true)
        }}
      />
      <DetailDrawer
        data={detailData!}
        visible={showDetailDrawer}
        onClose={() => setShowDetailDrawer(false)}
      />
    </div>
  )
}
