import React, { createContext, useState, useEffect } from 'react';
export const WeatherContext = createContext(undefined);
export const WeatherProvider = ({ children }) => {
    const [city, setCity] = useState('London');
    const [favorites, setFavorites] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('weather_favorites') || '[]');
        }
        catch {
            return [];
        }
    });
    const [isFavoritesOpen, setFavoritesOpen] = useState(false);
    useEffect(() => {
        localStorage.setItem('weather_favorites', JSON.stringify(favorites));
    }, [favorites]);
    const addFavorite = (c) => setFavorites(prev => {
        if (prev.find(f => f.name === c.name))
            return prev;
        return [...prev, c];
    });
    const removeFavorite = (cName) => setFavorites(prev => prev.filter(f => f.name !== cName));
    return (<WeatherContext.Provider value={{ city, setCity, favorites, addFavorite, removeFavorite, isFavoritesOpen, setFavoritesOpen }}>
      {children}
    </WeatherContext.Provider>);
};
