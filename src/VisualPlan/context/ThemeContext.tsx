// State management for theme with Context API
// Theme provider for the application
// keeps track of the current theme selected by user

import React, { createContext, useState } from "react"
import { THEME } from "../types"


export const ThemeContext = createContext({
	themeType: THEME.DARK,
	setThemeType: (theme: THEME) => {}
})