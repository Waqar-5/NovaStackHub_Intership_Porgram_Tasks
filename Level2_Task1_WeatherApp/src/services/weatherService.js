import axios from 'axios';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';
export const weatherApi = axios.create({
    params: { appid: API_KEY },
});
export const getCurrentWeather = async (city, units = 'metric') => {
    const { data } = await weatherApi.get(`${BASE_URL}/weather`, { params: { q: city, units } });
    return data;
};
export const getForecast = async (city, units = 'metric') => {
    const { data } = await weatherApi.get(`${BASE_URL}/forecast`, { params: { q: city, units } });
    return data;
};
export const getAirQuality = async (lat, lon) => {
    const { data } = await weatherApi.get(`${BASE_URL}/air_pollution`, { params: { lat, lon } });
    return data;
};
export const searchCities = async (query) => {
    const { data } = await weatherApi.get(`${GEO_URL}/direct`, { params: { q: query, limit: 5 } });
    return data;
};
export const reverseGeo = async (lat, lon) => {
    const { data } = await weatherApi.get(`${GEO_URL}/reverse`, { params: { lat, lon, limit: 1 } });
    return data;
};
