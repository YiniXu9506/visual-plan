import { useState } from '@storybook/addons'
import React from 'react'

import { VisualPlan } from '../../src'
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
    cteGap: {
      description: 'The gap between the main tree and the cte trees',
      defaultValue: 100,
      control: { type: 'number' },
    },
  },
}

export const Basic = ({ minimapScale, minimap: _minimap, cteGap, ...args }) => {
  const minimap = _minimap ? { scale: minimapScale } : false
  const cte = { gap: cteGap }
  return (
    <div style={{ height: 600 }}>
      <VisualPlan
        data={mockData as any}
        minimap={minimap}
        cte={cte}
        {...args}
      />
    </div>
  )
}