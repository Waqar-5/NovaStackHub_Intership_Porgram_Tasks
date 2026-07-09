import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '@/hooks/useWeather';
import { useSettings } from '@/hooks/useSettings';
import { format } from 'date-fns';
import { Sunrise, Sunset, Droplets, Wind, Eye, Gauge, Cloud, MapPin, Heart } from 'lucide-react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';
const getWeatherIcon = (code, size = 120) => {
    if (code >= 200 && code < 300)
        return <WiThunderstorm size={size} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-pulse"/>;
    if ((code >= 300 && code < 600) || (code >= 700 && code < 800))
        return <WiRain size={size} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]"/>;
    if (code >= 600 && code < 700)
        return <WiSnow size={size} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"/>;
    if (code === 800)
        return <WiDaySunny size={size} className="text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]"/>;
    if (code > 800)
        return <WiCloudy size={size} className="text-gray-300 drop-shadow-[0_0_15px_rgba(209,213,219,0.5)]"/>;
    return <WiDaySunny size={size} className="text-amber-400"/>;
};
export const Hero = () => {
    const { current, favorites, addFavorite, removeFavorite } = useWeather();
    const { unit, setUnit, animations } = useSettings();
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    if (!current.data)
        return null;
    const data = current.data;
    const isFavorite = favorites.some(f => f.name === data.name);
    const weatherCode = data.weather[0].id;
    const metricStagger = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
    };
    const itemVariant = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
    };
    return (<div className="relative w-full rounded-[2.5rem] p-8 md:p-12 lg:p-16 mb-8 overflow-hidden glass-panel border border-white/10 bg-gradient-to-br from-white/5 to-transparent dark:from-white/5 dark:to-transparent">
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12 relative z-10">
        
        {/* Left Side: Temps & Info */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-accent"/>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{data.name}, {data.sys.country}</h1>
            <button onClick={() => isFavorite ? removeFavorite(data.name) : addFavorite({ name: data.name, country: data.sys.country, lat: data.coord.lat, lon: data.coord.lon })} className={`p-2 rounded-full transition-all ${isFavorite ? 'bg-accent/20 text-accent' : 'bg-white/10 text-muted-foreground hover:text-white'}`}>
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-accent' : ''}`}/>
            </button>
          </motion.div>

          <div className="flex flex-col items-center lg:items-start">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.4 }} className="flex items-start">
              <span className="text-8xl md:text-[9rem] font-bold tracking-tighter text-foreground leading-none">
                {Math.round(data.main.temp)}
              </span>
              <div className="flex flex-col mt-4 ml-2 gap-2">
                <button onClick={() => setUnit('metric')} className={`text-2xl font-semibold transition-colors ${unit === 'metric' ? 'text-primary drop-shadow-[0_0_10px_rgba(79,139,255,0.8)]' : 'text-muted-foreground hover:text-foreground'}`}>
                  °C
                </button>
                <div className="w-full h-px bg-white/20"></div>
                <button onClick={() => setUnit('imperial')} className={`text-2xl font-semibold transition-colors ${unit === 'imperial' ? 'text-primary drop-shadow-[0_0_10px_rgba(79,139,255,0.8)]' : 'text-muted-foreground hover:text-foreground'}`}>
                  °F
                </button>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-4 text-xl text-muted-foreground font-medium">
              Feels like <span className="text-foreground">{Math.round(data.main.feels_like)}°</span>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-2 text-2xl capitalize italic font-serif text-primary">
              {data.weather[0].description}
            </motion.div>
          </div>
        </div>

        {/* Right Side: Icon & Time */}
        <div className="flex flex-col items-center lg:items-end gap-6">
          <motion.div initial={{ scale: 0.5, rotate: -20, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: "spring", duration: 1.5 }} className="relative">
            {/* Glow effect behind icon */}
            <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full"></div>
            <div className="relative z-10">
              {getWeatherIcon(weatherCode, 160)}
            </div>
          </motion.div>
          
          <div className="text-right">
            <div className="text-3xl font-bold font-mono tracking-wider text-foreground">
              {format(time, 'HH:mm:ss')}
            </div>
            <div className="text-muted-foreground font-medium mt-1">
              {format(time, 'EEEE, MMMM d')}
            </div>
          </div>
        </div>

      </div>

      {/* Metric Pills */}
      <motion.div variants={metricStagger} initial="hidden" animate="show" className="mt-12 flex flex-wrap justify-center lg:justify-start gap-3">
        <MetricPill icon={<Wind />} label="Wind" value={`${data.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}`}/>
        <MetricPill icon={<Droplets />} label="Humidity" value={`${data.main.humidity}%`}/>
        <MetricPill icon={<Gauge />} label="Pressure" value={`${data.main.pressure} hPa`}/>
        <MetricPill icon={<Eye />} label="Visibility" value={`${(data.visibility / 1000).toFixed(1)} km`}/>
        <MetricPill icon={<Cloud />} label="Clouds" value={`${data.clouds.all}%`}/>
        <MetricPill icon={<Sunrise />} label="Sunrise" value={format(new Date(data.sys.sunrise * 1000), 'HH:mm')}/>
        <MetricPill icon={<Sunset />} label="Sunset" value={format(new Date(data.sys.sunset * 1000), 'HH:mm')}/>
      </motion.div>
    </div>);
};
const MetricPill = ({ icon, label, value }) => (<motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -5, scale: 1.05 }} className="flex items-center gap-3 px-5 py-3 rounded-2xl glass-panel bg-white/5 border-white/10 cursor-default">
    <div className="text-primary">{icon}</div>
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
      <span className="font-bold text-sm text-foreground">{value}</span>
    </div>
  </motion.div>);
