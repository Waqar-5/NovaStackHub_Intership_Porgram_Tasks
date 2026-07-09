import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useWeather } from '@/hooks/useWeather';
import { useSettings } from '@/hooks/useSettings';
export const AnimatedBackground = () => {
    const { current } = useWeather();
    const { animations } = useSettings();
    const containerRef = useRef(null);
    const weatherCode = current.data?.weather?.[0]?.id || 800; // Default to clear
    const isDay = current.data?.weather?.[0]?.icon?.includes('d') ?? true;
    useEffect(() => {
        if (!animations || !containerRef.current)
            return;
        // Slight panning of the background gradient
        const ctx = gsap.context(() => {
            gsap.to(containerRef.current, {
                backgroundPosition: '100% 100%',
                duration: 20,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });
        });
        return () => ctx.revert();
    }, [animations, weatherCode, isDay]);
    const getBackgroundStyle = () => {
        if (weatherCode >= 200 && weatherCode < 300) {
            // Thunderstorm
            return 'bg-gradient-to-br from-slate-900 via-gray-900 to-black';
        }
        if ((weatherCode >= 300 && weatherCode < 600) || (weatherCode >= 700 && weatherCode < 800)) {
            // Rain / Drizzle / Mist
            return 'bg-gradient-to-br from-gray-800 via-slate-700 to-gray-900';
        }
        if (weatherCode >= 600 && weatherCode < 700) {
            // Snow
            return 'bg-gradient-to-br from-slate-300 via-gray-400 to-slate-500 dark:from-slate-800 dark:to-slate-900';
        }
        if (weatherCode > 800) {
            // Clouds
            return isDay
                ? 'bg-gradient-to-br from-blue-200 via-gray-300 to-gray-400 dark:from-slate-700 dark:to-gray-900'
                : 'bg-gradient-to-br from-gray-800 via-slate-800 to-black';
        }
        // Clear
        return isDay
            ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 dark:from-blue-900 dark:to-slate-900'
            : 'bg-gradient-to-br from-slate-900 via-blue-950 to-black';
    };
    return (<div ref={containerRef} className={`fixed inset-0 -z-50 transition-colors duration-1000 ${getBackgroundStyle()} bg-[length:200%_200%]`}>
      {/* Particles/Effects based on weather */}
      {animations && (<>
          {weatherCode >= 200 && weatherCode < 300 && (<div className="absolute inset-0 bg-white/10 animate-lightning pointer-events-none"/>)}
          
          {(weatherCode >= 300 && weatherCode < 600) && (<div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
              {Array.from({ length: 50 }).map((_, i) => (<div key={i} className="absolute w-0.5 h-6 bg-white/40 animate-rain" style={{
                        left: `${Math.random() * 100}vw`,
                        animationDuration: `${0.5 + Math.random() * 0.5}s`,
                        animationDelay: `${Math.random() * 2}s`
                    }}/>))}
            </div>)}

          {weatherCode >= 600 && weatherCode < 700 && (<div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
              {Array.from({ length: 50 }).map((_, i) => (<div key={i} className="absolute w-2 h-2 bg-white rounded-full animate-snow" style={{
                        left: `${Math.random() * 100}vw`,
                        animationDuration: `${3 + Math.random() * 5}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: 0.2 + Math.random() * 0.8
                    }}/>))}
            </div>)}

          {!isDay && weatherCode === 800 && (<div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 100 }).map((_, i) => (<div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{
                        left: `${Math.random() * 100}vw`,
                        top: `${Math.random() * 100}vh`,
                        animationDuration: `${2 + Math.random() * 4}s`,
                        animationDelay: `${Math.random() * 4}s`,
                    }}/>))}
            </div>)}
        </>)}
    </div>);
};
