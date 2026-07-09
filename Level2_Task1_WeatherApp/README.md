# Weather App — Level 2, Task 1

A responsive weather app built with **HTML, CSS, and JavaScript**, featuring a clean card UI, city search, and Celsius/Fahrenheit toggle.

## Features
- Search any city for weather info
- Loading and error states
- Temperature, "feels like," humidity, wind speed, and visibility
- Celsius ⇄ Fahrenheit toggle
- Weather icons that change based on conditions
- Works out of the box with realistic **mock data** (no API key required to demo)
- Ready to switch to **live data** from OpenWeatherMap with one line

## Files
```
Level2_Task1_WeatherApp/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run
Open `index.html` in your browser. Try searching: `Karachi`, `Lahore`, `Islamabad`, `London`, `New York`, or `Tokyo` — these are pre-loaded in the mock database. Any other city will show the "not found" state (until you add a real API key).

## Switching to Live Weather Data
1. Sign up free at [OpenWeatherMap](https://openweathermap.org/api) and grab an API key.
2. Open `script.js` and paste your key into:
   ```js
   const API_KEY = ''; // <-- paste your key here
   ```
3. Save and reload — the app will now fetch real, live weather for any city worldwide.

## How to Submit for Internship
1. Push this folder to GitHub.
2. Screenshot the default view, a search result, and the Fahrenheit toggle.
3. Submit the GitHub link + screenshots via the submission form.
