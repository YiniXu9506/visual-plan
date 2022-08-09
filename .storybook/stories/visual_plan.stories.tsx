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
  argTypes: {
    theme: {
      description: 'Theme of the visual plan',
      defaultValue: 'light',
      options: ['light', 'dark'],
      control: { type: 'radio' },
    },
    minimap: {
      description: 'Whether to show the minimap',
      defaultValue: true,
      control: { type: 'boolean' },
    },
    minimapScale: {
      description: 'The scale of the minimap',
      defaultValue: 0.15,
      control: { type: 'number', if: { arg: 'minimap' } },
    },
    // cteGap: {
    //   description: 'The gap between the main tree and the cte trees',
    //   defaultValue: 100,
    //   control: { type: 'number' },
    // },
  },
}

export const Basic = ({ minimapScale, minimap: _minimap, ...args }) => {
  const minimap = _minimap ? { scale: minimapScale } : false
  return (
    <div style={{ height: 600 }}>
      <VisualPlan data={mockData as any} minimap={minimap} {...args} />
    </div>
  )
}

export const WithDetailDrawer = ({
  minimapScale,
  minimap: _minimap,
  ...args
}) => {
  const minimap = _minimap ? { scale: minimapScale } : false
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
        minimap={minimap}
        {...args}
      />
      <DetailDrawer
        data={detailData!}
        visible={showDetailDrawer}
        onClose={() => setShowDetailDrawer(false)}
      />
    </div>
  )
}
