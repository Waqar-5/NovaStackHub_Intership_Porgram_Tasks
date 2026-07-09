import React, { useState, useEffect, useRef } from 'react';
import { Search, History, Star, X, MapPin } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { useWeather } from '@/hooks/useWeather';
import { motion, AnimatePresence } from 'framer-motion';
export const SearchBar = () => {
    const { query, setQuery, suggestions, loading, history, clearHistory, addToHistory } = useSearch();
    const { setCity, favorites } = useWeather();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleSelect = (cityData) => {
        setCity(cityData.name);
        addToHistory(cityData);
        setQuery('');
        setIsOpen(false);
    };
    return (<div className="relative w-full max-w-md z-50" ref={wrapperRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-muted-foreground"/>
        <input type="text" value={query} onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
        }} onFocus={() => setIsOpen(true)} placeholder="Search city..." className="w-full h-12 pl-12 pr-10 rounded-full glass-panel bg-white/10 dark:bg-black/10 border-white/20 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all"/>
        {query && (<button onClick={() => setQuery('')} className="absolute right-4 p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-4 h-4 text-muted-foreground"/>
          </button>)}
      </div>

      <AnimatePresence>
        {isOpen && (query.length >= 2 || history.length > 0 || favorites.length > 0) && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 mt-2 p-2 glass-panel bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-h-[60vh] overflow-y-auto hide-scrollbar">
            {loading && query.length >= 2 && (<div className="p-4 text-center text-sm text-muted-foreground animate-pulse">Searching...</div>)}

            {!loading && suggestions.length > 0 && (<div className="mb-4">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suggestions</div>
                {suggestions.map((s, i) => (<button key={i} onClick={() => handleSelect(s)} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center gap-3 transition-colors group">
                    <MapPin className="w-4 h-4 text-primary group-hover:scale-110 transition-transform"/>
                    <div>
                      <div className="font-medium text-foreground">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.state ? `${s.state}, ` : ''}{s.country}</div>
                    </div>
                  </button>))}
              </div>)}

            {!loading && query.length === 0 && favorites.length > 0 && (<div className="mb-4">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Favorites</div>
                {favorites.map((f, i) => (<button key={i} onClick={() => handleSelect(f)} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center gap-3 transition-colors group">
                    <Star className="w-4 h-4 text-accent fill-accent"/>
                    <span className="font-medium text-foreground">{f.name}</span>
                  </button>))}
              </div>)}

            {!loading && query.length === 0 && history.length > 0 && (<div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent</span>
                  <button onClick={clearHistory} className="text-xs text-primary hover:underline">Clear</button>
                </div>
                {history.map((h, i) => (<button key={i} onClick={() => handleSelect(h)} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center gap-3 transition-colors">
                    <History className="w-4 h-4 text-muted-foreground"/>
                    <span className="font-medium text-foreground">{h.name}</span>
                  </button>))}
              </div>)}
            
            {!loading && query.length >= 2 && suggestions.length === 0 && (<div className="p-4 text-center text-sm text-muted-foreground">No cities found for "{query}"</div>)}
          </motion.div>)}
      </AnimatePresence>
    </div>);
};
