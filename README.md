# Visual Plan

A React component to show a visualization of execution plan.

## Install

```
npm i -S visual-plan
```

## Usage

```tsx
import React from "react"
import ReactDOM from "react-dom"
import VisualPlan from 'visual-plan'
import 'visual-plan/dist/index.css'

const App = () => (
  <div style={{ height: 600 }}>
    <VisualPlan data={binaryPlanData} />
  </div>
)

const app = document.getElementById("app")
ReactDOM.render(<App />, app)
```
