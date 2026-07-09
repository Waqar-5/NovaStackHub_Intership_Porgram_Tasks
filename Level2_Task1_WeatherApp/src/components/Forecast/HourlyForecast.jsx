import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '@/hooks/useWeather';
import { format } from 'date-fns';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';
const getMiniIcon = (code, isDay = true) => {
    if (code >= 200 && code < 300)
        return <WiThunderstorm size={40} className="text-yellow-400"/>;
    if (code >= 300 && code < 600)
        return <WiRain size={40} className="text-blue-400"/>;
    if (code >= 600 && code < 700)
        return <WiSnow size={40} className="text-white"/>;
    if (code === 800)
        return isDay ? <WiDaySunny size={40} className="text-amber-400"/> : <WiCloudy size={40} className="text-gray-400"/>;
    return <WiCloudy size={40} className="text-gray-300"/>;
};
export const HourlyForecast = () => {
    const { forecast } = useWeather();
    if (!forecast.data)
        return null;
    // Take next 24 hours (8 periods of 3h)
    const hourlyData = forecast.data.list.slice(0, 8);
    return (<div className="w-full">
      <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
        <span className="w-2 h-6 bg-accent rounded-full inline-block"></span>
        Next 24 Hours
      </h3>
      
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 hide-scrollbar snap-x">
        {hourlyData.map((item, i) => {
            const date = new Date(item.dt * 1000);
            const isDay = item.sys.pod === 'd';
            return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={item.dt} className="min-w-[100px] flex flex-col items-center p-4 glass-panel bg-white/5 hover:bg-white/10 transition-colors snap-center group cursor-pointer">
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors mb-2">
                {format(date, 'HH:mm')}
              </span>
              <div className="my-2 drop-shadow-lg transform group-hover:scale-125 transition-transform duration-300">
                {getMiniIcon(item.weather[0].id, isDay)}
              </div>
              <span className="text-xl font-bold text-foreground mt-2">
                {Math.round(item.main.temp)}°
              </span>
              {item.pop > 0 && (<span className="text-xs text-blue-400 font-medium mt-1">
                  {Math.round(item.pop * 100)}% rain
                </span>)}
            </motion.div>);
        })}
      </div>
    </div>);
};
