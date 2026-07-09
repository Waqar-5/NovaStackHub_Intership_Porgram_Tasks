import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '@/hooks/useWeather';
import { useSettings } from '@/hooks/useSettings';
import { Thermometer, Droplets, Wind, Compass, Eye, Gauge, CloudRain } from 'lucide-react';
export const WeatherDetails = () => {
    const { current, airQuality } = useWeather();
    const { unit } = useSettings();
    if (!current.data)
        return null;
    const data = current.data;
    const aqi = airQuality.data?.list?.[0]?.main?.aqi;
    const getAqiColor = (val) => {
        switch (val) {
            case 1: return 'bg-success text-white shadow-[0_0_10px_rgba(74,222,128,0.5)]'; // Good
            case 2: return 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.5)]'; // Fair
            case 3: return 'bg-warning text-white shadow-[0_0_10px_rgba(253,186,116,0.5)]'; // Moderate
            case 4: return 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'; // Poor
            case 5: return 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]'; // Very Poor
            default: return 'bg-gray-500 text-white';
        }
    };
    const getAqiLabel = (val) => {
        switch (val) {
            case 1: return 'Good';
            case 2: return 'Fair';
            case 3: return 'Moderate';
            case 4: return 'Poor';
            case 5: return 'Very Poor';
            default: return 'Unknown';
        }
    };
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };
    const details = [
        { icon: <Thermometer />, label: "High / Low", value: `${Math.round(data.main.temp_max)}° / ${Math.round(data.main.temp_min)}°` },
        { icon: <Compass />, label: "Wind Direction", value: `${data.wind.deg}°` },
        { icon: <Droplets />, label: "Humidity", value: `${data.main.humidity}%` },
        { icon: <Gauge />, label: "Pressure", value: `${data.main.pressure} hPa` },
        { icon: <Eye />, label: "Visibility", value: `${(data.visibility / 1000).toFixed(1)} km` },
        { icon: <CloudRain />, label: "Rain (1h)", value: data.rain ? `${data.rain['1h']} mm` : '0 mm' },
    ];
    return (<motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* AQI Special Card */}
      {aqi && (<motion.div variants={item} className="col-span-2 sm:col-span-2 glass-panel p-6 flex items-center justify-between group hover:bg-white/10 transition-colors">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Wind className="w-5 h-5 text-primary"/>
              <span className="font-medium uppercase tracking-wider text-xs">Air Quality Index</span>
            </div>
            <div className="text-3xl font-bold text-foreground">
              {getAqiLabel(aqi)}
            </div>
          </div>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${getAqiColor(aqi)}`}>
            {aqi}
          </div>
        </motion.div>)}

      {details.map((d, i) => (<motion.div key={i} variants={item} className="glass-panel p-5 group hover:bg-white/10 transition-colors relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
            {React.cloneElement(d.icon, { size: 100 })}
          </div>
          <div className="flex items-center gap-3 text-muted-foreground mb-3 relative z-10">
            <span className="text-primary">{React.cloneElement(d.icon, { className: "w-5 h-5" })}</span>
            <span className="font-medium uppercase tracking-wider text-xs">{d.label}</span>
          </div>
          <div className="text-2xl font-bold text-foreground relative z-10">
            {d.value}
          </div>
        </motion.div>))}
    </motion.div>);
};
