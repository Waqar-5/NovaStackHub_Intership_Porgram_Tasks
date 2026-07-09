import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, MapPin } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { getCurrentWeather } from '@/services/weatherService';
import { useSettings } from '@/hooks/useSettings';
export const FavoritesPanel = () => {
    const { isFavoritesOpen, setFavoritesOpen, favorites, removeFavorite, setCity } = useWeather();
    const { unit } = useSettings();
    const [favWeather, setFavWeather] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!isFavoritesOpen || favorites.length === 0)
            return;
        const fetchFavs = async () => {
            setLoading(true);
            const data = {};
            for (const fav of favorites) {
                try {
                    const res = await getCurrentWeather(fav.name, unit);
                    data[fav.name] = res;
                }
                catch (e) {
                    console.error(e);
                }
            }
            setFavWeather(data);
            setLoading(false);
        };
        fetchFavs();
    }, [isFavoritesOpen, favorites, unit]);
    return (<AnimatePresence>
      {isFavoritesOpen && (<>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFavoritesOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"/>
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 w-full max-w-md glass-panel bg-background/90 rounded-none rounded-l-3xl z-50 border-l border-white/10 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-foreground">Favorite Cities</h2>
              <button onClick={() => setFavoritesOpen(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-6 h-6 text-muted-foreground"/>
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              {favorites.length === 0 ? (<div className="text-center text-muted-foreground mt-12 flex flex-col items-center">
                  <MapPin className="w-12 h-12 mb-4 opacity-50"/>
                  <p>You haven't saved any cities yet.</p>
                  <p className="text-sm mt-2">Search for a city and click the heart icon to save it here.</p>
                </div>) : (favorites.map((fav) => {
                const weather = favWeather[fav.name];
                return (<motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} key={fav.name} className="glass-panel p-4 rounded-2xl flex items-center justify-between group bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => {
                        setCity(fav.name);
                        setFavoritesOpen(false);
                    }}>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{fav.name}</h3>
                        <p className="text-sm text-muted-foreground">{fav.country}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {weather ? (<div className="text-right">
                            <div className="text-2xl font-bold text-foreground">
                              {Math.round(weather.main.temp)}°
                            </div>
                            <div className="text-xs text-primary capitalize">
                              {weather.weather[0].main}
                            </div>
                          </div>) : loading ? (<div className="w-12 h-12 rounded bg-white/10 animate-pulse"></div>) : null}
                        
                        <button onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(fav.name);
                    }} className="p-2 rounded-full hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </div>
                    </motion.div>);
            }))}
            </div>
          </motion.div>
        </>)}
    </AnimatePresence>);
};
