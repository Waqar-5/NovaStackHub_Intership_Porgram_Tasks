import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '@/hooks/useWeather';
import { format } from 'date-fns';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';
const getMiniIcon = (code) => {
    if (code >= 200 && code < 300)
        return <WiThunderstorm size={32} className="text-yellow-400"/>;
    if (code >= 300 && code < 600)
        return <WiRain size={32} className="text-blue-400"/>;
    if (code >= 600 && code < 700)
        return <WiSnow size={32} className="text-white"/>;
    if (code === 800)
        return <WiDaySunny size={32} className="text-amber-400"/>;
    return <WiCloudy size={32} className="text-gray-300"/>;
};
export const DailyForecast = () => {
    const { forecast } = useWeather();
    if (!forecast.data)
        return null;
    // Group forecast by day
    const dailyData = {};
    forecast.data.list.forEach((item) => {
        const date = format(new Date(item.dt * 1000), 'yyyy-MM-dd');
        if (!dailyData[date]) {
            dailyData[date] = {
                dt: item.dt,
                temps: [],
                weather: item.weather[0], // roughly take the first one
                pop: 0
            };
        }
        dailyData[date].temps.push(item.main.temp);
        dailyData[date].pop = Math.max(dailyData[date].pop, item.pop);
    });
    const days = Object.values(dailyData).slice(0, 5); // 5 day forecast
    return (<div className="glass-panel p-6">
      <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
        <span className="w-2 h-6 bg-primary rounded-full inline-block"></span>
        5-Day Forecast
      </h3>
      
      <div className="flex flex-col gap-4">
        {days.map((day, i) => {
            const date = new Date(day.dt * 1000);
            const minTemp = Math.round(Math.min(...day.temps));
            const maxTemp = Math.round(Math.max(...day.temps));
            const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            return (<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={day.dt} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
              <div className="w-24 font-medium text-foreground">
                {isToday ? 'Today' : format(date, 'EEEE')}
              </div>
              
              <div className="flex items-center gap-4 flex-1 justify-center">
                <div className="drop-shadow-md transform group-hover:scale-110 transition-transform">
                  {getMiniIcon(day.weather.id)}
                </div>
                {day.pop > 0.2 && (<span className="text-xs text-blue-400 font-medium w-12 text-center">
                    {Math.round(day.pop * 100)}%
                  </span>)}
              </div>
              
              <div className="w-32 flex items-center justify-end gap-3 text-right">
                <span className="text-muted-foreground font-medium">{minTemp}°</span>
                <div className="w-12 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-amber-400 opacity-70"></div>
                <span className="font-bold text-foreground">{maxTemp}°</span>
              </div>
            </motion.div>);
        })}
      </div>
    </div>);
};
