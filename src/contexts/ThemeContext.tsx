import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeType = 'dark' | 'modern' | 'colorful';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themeLabel: string;
}

const themeLabels: Record<ThemeType, string> = {
  dark: 'Dark & Technical',
  modern: 'Modern & Clean',
  colorful: 'Colorful & Playful',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('webgpu-playground-theme');
    return (saved as ThemeType) || 'dark';
  });

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('webgpu-playground-theme', newTheme);
  };

  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove('theme-dark', 'theme-modern', 'theme-colorful');
    // Add current theme class
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeLabel: themeLabels[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
