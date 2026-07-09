import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '@/hooks/useWeather';
import { Sparkles } from 'lucide-react';
export const AISummary = () => {
    const { current } = useWeather();
    const [displayedText, setDisplayedText] = useState('');
    if (!current.data)
        return null;
    const d = current.data;
    const temp = d.main.temp;
    const weatherId = d.weather[0].id;
    const wind = d.wind.speed;
    // Generate a realistic summary based on parameters
    const generateSummary = () => {
        let summary = "Current conditions indicate ";
        if (weatherId >= 200 && weatherId < 300)
            summary += "active thunderstorms in the area. Best to stay indoors. ";
        else if (weatherId >= 300 && weatherId < 600)
            summary += "rainy weather. Don't forget an umbrella. ";
        else if (weatherId >= 600 && weatherId < 700)
            summary += "snowfall. Bundle up and drive carefully. ";
        else if (weatherId === 800)
            summary += "clear skies and excellent visibility. ";
        else
            summary += "cloudy skies. ";
        if (temp < 0)
            summary += "Temperatures are freezing, dress in heavy layers. ";
        else if (temp >= 0 && temp < 15)
            summary += "It's quite chilly out, a warm jacket is recommended. ";
        else if (temp >= 15 && temp < 25)
            summary += "Temperatures are mild and comfortable for outdoor activities. ";
        else
            summary += "It's warm outside, stay hydrated and use sun protection if skies are clear. ";
        if (wind > 10)
            summary += "Expect strong gusty winds today.";
        else if (wind > 5)
            summary += "A moderate breeze is present.";
        return summary;
    };
    const text = generateSummary();
    useEffect(() => {
        setDisplayedText('');
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + text.charAt(i));
            i++;
            if (i >= text.length)
                clearInterval(interval);
        }, 30); // Typewriter speed
        return () => clearInterval(interval);
    }, [text]);
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 md:p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="flex items-center gap-3 mb-4 text-primary">
        <Sparkles className="w-6 h-6 animate-pulse"/>
        <h3 className="text-xl font-bold text-foreground">AI Weather Insight</h3>
      </div>
      
      <p className="text-lg text-muted-foreground leading-relaxed font-mono min-h-[80px]">
        {displayedText}
        <span className="animate-pulse inline-block w-2 h-5 bg-primary ml-1 align-middle"></span>
      </p>
    </motion.div>);
};
