import { useQuery } from '@tanstack/react-query';
import { getCurrentWeather, getForecast, getAirQuality } from '../services/weatherService';
import { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import { useSettings } from './useSettings';
export const useWeather = () => {
    const context = useContext(WeatherContext);
    if (!context)
        throw new Error('useWeather must be used within WeatherProvider');
    const { city } = context;
    const { unit } = useSettings();
    const currentQuery = useQuery({
        queryKey: ['weather', city, unit],
        queryFn: () => getCurrentWeather(city, unit),
        retry: 1,
        refetchOnWindowFocus: false,
    });
    const forecastQuery = useQuery({
        queryKey: ['forecast', city, unit],
        queryFn: () => getForecast(city, unit),
        enabled: !!currentQuery.data,
        refetchOnWindowFocus: false,
    });
    const airQualityQuery = useQuery({
        queryKey: ['airQuality', currentQuery.data?.coord?.lat, currentQuery.data?.coord?.lon],
        queryFn: () => getAirQuality(currentQuery.data.coord.lat, currentQuery.data.coord.lon),
        enabled: !!currentQuery.data?.coord,
        refetchOnWindowFocus: false,
    });
    return {
        ...context,
        current: currentQuery,
        forecast: forecastQuery,
        airQuality: airQualityQuery,
    };
};
