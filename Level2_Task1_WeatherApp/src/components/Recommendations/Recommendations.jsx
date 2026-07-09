import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '@/hooks/useWeather';
import { Umbrella, Shirt, Car, Coffee, Dumbbell, Sun } from 'lucide-react';
export const Recommendations = () => {
    const { current } = useWeather();
    if (!current.data)
        return null;
    const d = current.data;
    const temp = d.main.temp;
    const weatherId = d.weather[0].id;
    const wind = d.wind.speed;
    const recommendations = [];
    // Clothing
    if (temp < 10) {
        recommendations.push({ icon: <Shirt />, title: "Heavy Jacket", desc: "It's cold out, bundle up." });
    }
    else if (temp < 20) {
        recommendations.push({ icon: <Shirt />, title: "Light Layers", desc: "A sweater should be perfect." });
    }
    else {
        recommendations.push({ icon: <Shirt />, title: "Summer Wear", desc: "T-shirt weather today." });
    }
    // Gear
    if (weatherId >= 200 && weatherId < 600) {
        recommendations.push({ icon: <Umbrella />, title: "Take Umbrella", desc: "High chance of precipitation." });
    }
    else if (weatherId === 800 && temp > 20) {
        recommendations.push({ icon: <Sun />, title: "Sunscreen", desc: "UV levels likely high." });
    }
    // Activity
    if (wind > 10) {
        recommendations.push({ icon: <Car />, title: "Drive Safely", desc: "High crosswinds detected." });
    }
    else if (weatherId >= 800 && temp > 15 && temp < 28) {
        recommendations.push({ icon: <Dumbbell />, title: "Great for Run", desc: "Perfect outdoor conditions." });
    }
    else {
        recommendations.push({ icon: <Coffee />, title: "Stay Cozy", desc: "Good day for indoor tasks." });
    }
    return (<div className="glass-panel p-6">
      <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
        <span className="w-2 h-6 bg-success rounded-full inline-block"></span>
        Smart Suggestions
      </h3>
      
      <div className="flex flex-col gap-4">
        {recommendations.map((rec, i) => (<motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="p-3 rounded-lg bg-primary/20 text-primary shrink-0">
              {rec.icon}
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{rec.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{rec.desc}</p>
            </div>
          </motion.div>))}
      </div>
    </div>);
};
