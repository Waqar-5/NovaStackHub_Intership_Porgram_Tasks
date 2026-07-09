import { useState, useEffect } from 'react';
import { searchCities } from '../services/weatherService';
export const useSearch = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('weather_recent') || '[]');
        }
        catch {
            return [];
        }
    });
    useEffect(() => {
        localStorage.setItem('weather_recent', JSON.stringify(history));
    }, [history]);
    const addToHistory = (cityData) => {
        setHistory(prev => {
            const newHist = [cityData, ...prev.filter(c => c.name !== cityData.name)].slice(0, 10);
            return newHist;
        });
    };
    const clearHistory = () => setHistory([]);
    useEffect(() => {
        if (query.trim().length < 2) {
            setSuggestions([]);
            return;
        }
        const delay = setTimeout(async () => {
            setLoading(true);
            try {
                const results = await searchCities(query);
                setSuggestions(results);
            }
            catch (e) {
                setSuggestions([]);
            }
            setLoading(false);
        }, 300);
        return () => clearTimeout(delay);
    }, [query]);
    return { query, setQuery, suggestions, loading, history, addToHistory, clearHistory };
};
