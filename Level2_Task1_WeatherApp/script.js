// ===== Weather App Logic =====
// To use LIVE data: get a free API key from https://openweathermap.org/api
// and paste it below. Without a key, the app uses realistic mock data
// so the UI is fully demonstrable out of the box.

const API_KEY = ''; // <-- paste your OpenWeatherMap API key here
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const weatherContent = document.getElementById('weatherContent');

const locationName = document.getElementById('locationName');
const currentDate = document.getElementById('currentDate');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const feelsLike = document.getElementById('feelsLike');
const visibility = document.getElementById('visibility');

const celsiusBtn = document.getElementById('celsiusBtn');
const fahrenheitBtn = document.getElementById('fahrenheitBtn');

let currentUnit = 'C';
let lastTempC = 32;
let lastFeelsLikeC = 34;

// ===== Mock Data (used when no API key is provided) =====
const mockDatabase = {
  default: { temp: 32, feels: 34, humidity: 45, wind: 12, visibility: 10, desc: 'Clear Sky', icon: '☀️' },
  karachi: { temp: 33, feels: 36, humidity: 60, wind: 18, visibility: 8, desc: 'Partly Cloudy', icon: '⛅' },
  lahore: { temp: 38, feels: 41, humidity: 30, wind: 10, visibility: 9, desc: 'Sunny', icon: '☀️' },
  islamabad: { temp: 29, feels: 30, humidity: 55, wind: 8, visibility: 10, desc: 'Light Rain', icon: '🌦️' },
  london: { temp: 17, feels: 16, humidity: 70, wind: 20, visibility: 7, desc: 'Cloudy', icon: '☁️' },
  newyork: { temp: 24, feels: 25, humidity: 50, wind: 14, visibility: 10, desc: 'Clear Sky', icon: '☀️' },
  tokyo: { temp: 27, feels: 29, humidity: 65, wind: 11, visibility: 9, desc: 'Light Rain', icon: '🌧️' }
};

// ===== Init: show default mock weather on load =====
window.addEventListener('DOMContentLoaded', () => {
  displayDate();
  renderWeather('Sukkur, Pakistan', mockDatabase.default);
});

function displayDate() {
  const now = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  currentDate.textContent = now.toLocaleDateString('en-US', options);
}

// ===== Form Submit =====
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  showLoading();

  if (API_KEY) {
    fetchLiveWeather(city);
  } else {
    // Simulate network delay for realistic UX, then use mock data
    setTimeout(() => fetchMockWeather(city), 600);
  }
});

function showLoading() {
  loadingState.classList.remove('hidden');
  errorState.classList.add('hidden');
  weatherContent.classList.add('hidden');
}

function showError() {
  loadingState.classList.add('hidden');
  errorState.classList.remove('hidden');
  weatherContent.classList.add('hidden');
}

function showWeather() {
  loadingState.classList.add('hidden');
  errorState.classList.add('hidden');
  weatherContent.classList.remove('hidden');
}

// ===== Mock Fetch =====
function fetchMockWeather(city) {
  const key = city.toLowerCase().replace(/\s+/g, '');
  const data = mockDatabase[key];

  if (!data) {
    showError();
    return;
  }

  renderWeather(city, data);
}

// ===== Live API Fetch (used only if API_KEY is set) =====
async function fetchLiveWeather(city) {
  try {
    const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
    if (!response.ok) throw new Error('City not found');

    const data = await response.json();

    const weatherData = {
      temp: Math.round(data.main.temp),
      feels: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed * 3.6), // m/s to km/h
      visibility: (data.visibility / 1000).toFixed(1),
      desc: data.weather[0].description,
      icon: mapIconCode(data.weather[0].icon)
    };

    renderWeather(`${data.name}, ${data.sys.country}`, weatherData);
  } catch (err) {
    showError();
  }
}

function mapIconCode(code) {
  const iconMap = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  };
  return iconMap[code] || '☀️';
}

// ===== Render Weather to UI =====
function renderWeather(location, data) {
  locationName.textContent = location.charAt(0).toUpperCase() + location.slice(1);
  weatherIcon.textContent = data.icon;
  weatherDescription.textContent = data.desc;
  humidity.textContent = `${data.humidity}%`;
  windSpeed.textContent = `${data.wind} km/h`;
  visibility.textContent = `${data.visibility} km`;

  lastTempC = data.temp;
  lastFeelsLikeC = data.feels;

  applyUnit();
  showWeather();
}

// ===== Unit Toggle (Celsius / Fahrenheit) =====
celsiusBtn.addEventListener('click', () => {
  currentUnit = 'C';
  celsiusBtn.classList.add('active');
  fahrenheitBtn.classList.remove('active');
  applyUnit();
});

fahrenheitBtn.addEventListener('click', () => {
  currentUnit = 'F';
  fahrenheitBtn.classList.add('active');
  celsiusBtn.classList.remove('active');
  applyUnit();
});

function applyUnit() {
  if (currentUnit === 'C') {
    temperature.textContent = `${lastTempC}°`;
    feelsLike.textContent = `${lastFeelsLikeC}°`;
  } else {
    temperature.textContent = `${celsiusToFahrenheit(lastTempC)}°`;
    feelsLike.textContent = `${celsiusToFahrenheit(lastFeelsLikeC)}°`;
  }
}

function celsiusToFahrenheit(c) {
  return Math.round((c * 9) / 5 + 32);
}
