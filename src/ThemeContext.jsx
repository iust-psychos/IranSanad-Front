import { createContext, useContext } from "react";

export const ThemeContext = createContext({ isDarkMode: false });

export const useTheme = () => useContext(ThemeContext);
