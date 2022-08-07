// State management for theme with Context API
// Theme provider for the application
// keeps track of the current theme selected by user

import React, { createContext } from 'react'

export const ThemeContext = createContext({
  theme: 'light',
})
