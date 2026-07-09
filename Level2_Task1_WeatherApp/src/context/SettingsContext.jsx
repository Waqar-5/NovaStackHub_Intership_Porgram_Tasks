import React, { createContext, useEffect, useState } from 'react';
export const SettingsContext = createContext(undefined);
export const SettingsProvider = ({ children }) => {
    const [unit, setUnit] = useState(() => localStorage.getItem('weather_unit') || 'metric');
    const [theme, setTheme] = useState(() => {
        const t = localStorage.getItem('weather_theme');
        if (t)
            return t;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark'; // Dark default
    });
    const [animations, setAnimations] = useState(() => localStorage.getItem('weather_animations') !== 'false');
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    useEffect(() => {
        localStorage.setItem('weather_unit', unit);
    }, [unit]);
    useEffect(() => {
        localStorage.setItem('weather_theme', theme);
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        }
        else {
            root.classList.remove('dark');
        }
    }, [theme]);
    useEffect(() => {
        localStorage.setItem('weather_animations', animations.toString());
    }, [animations]);
    return (<SettingsContext.Provider value={{ unit, theme, animations, setUnit, setTheme, setAnimations, isSettingsOpen, setSettingsOpen }}>
      {children}
    </SettingsContext.Provider>);
};
