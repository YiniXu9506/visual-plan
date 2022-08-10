

import { VisualPlanThumbnail } from '../../src'
import mockData from './vp_mock.json'

export default {
    title: 'Example/Thumbnail',
    Component: VisualPlanThumbnail,
    argTypes: {
      theme: {
        description: 'Theme of the visual plan',
        defaultValue: 'light',
        options: ['light', 'dark'],
        control: { type: 'radio' },
      },
      cteGap: {
        description: 'The gap between the main tree and the cte trees',
        defaultValue: 100,
        control: { type: 'number' },
      },
    },
  }

export const Thumbnail = ({ cteGap, ...args }) => {
    const minimap = false
    const cte = { gap: cteGap }
    return (
      <div style={{ height: 600 }}>
        <VisualPlanThumbnail
          data={mockData as any}
          minimap={minimap}
          cte={cte}
          {...args}
        />
      </div>
    )
  }