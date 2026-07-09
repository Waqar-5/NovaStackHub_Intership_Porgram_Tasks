import React from 'react';
import { useWeather } from '@/hooks/useWeather';
import { AnimatedBackground } from '@/components/Background/AnimatedBackground';
import { LoadingScreen } from '@/components/Loader/LoadingScreen';
import { Navbar } from '@/components/Navbar/Navbar';
import { Hero } from '@/components/Hero/Hero';
import { WeatherDetails } from '@/components/Details/WeatherDetails';
import { HourlyForecast } from '@/components/Forecast/HourlyForecast';
import { DailyForecast } from '@/components/Forecast/DailyForecast';
import { WeatherCharts } from '@/components/Charts/WeatherCharts';
import { WeatherMap } from '@/components/Map/WeatherMap';
import { AISummary } from '@/components/AISummary/AISummary';
import { Recommendations } from '@/components/Recommendations/Recommendations';
import { SettingsPanel } from '@/components/Settings/SettingsPanel';
import { FavoritesPanel } from '@/components/Favorites/FavoritesPanel';
import { AnimatePresence } from 'framer-motion';
export default function Home() {
    const { current, forecast, airQuality } = useWeather();
    const isLoading = current.isLoading || forecast.isLoading || airQuality.isLoading;
    const error = current.error || forecast.error || airQuality.error;
    return (<div className="min-h-[100dvh] relative text-foreground overflow-x-hidden">
      <AnimatedBackground />
      
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <Navbar />
      
      {!isLoading && !error && current.data && (<main className="container mx-auto px-4 py-24 md:py-32 space-y-8 max-w-7xl">
          <Hero />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <AISummary />
              <HourlyForecast />
              <WeatherDetails />
            </div>
            <div className="space-y-8">
              <DailyForecast />
              <Recommendations />
            </div>
          </div>
          
          <WeatherCharts />
          <WeatherMap />
        </main>)}

      {!isLoading && error && (<div className="pt-32 px-4 flex justify-center">
          <div className="glass-panel p-8 text-center max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Oops!</h2>
            <p className="text-muted-foreground mb-6">We couldn't fetch the weather data. Please try searching for another city or check your connection.</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:scale-95 transition-transform">
              Retry
            </button>
          </div>
        </div>)}

      <SettingsPanel />
      <FavoritesPanel />
    </div>);
}
