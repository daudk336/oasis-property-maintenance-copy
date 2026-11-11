import { useState, useEffect } from "react";

// Gold Coast / Logan / South Brisbane region
const LAT = -27.86;
const LON = 153.25;

let cache = null;

// Returns { "yyyy-MM-dd": { code, tmax, tmin, rain } } for the next 14 days
export default function useWeather() {
  const [forecast, setForecast] = useState(cache);

  useEffect(() => {
    if (cache) return;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Australia%2FBrisbane&forecast_days=14`
    )
      .then((r) => r.json())
      .then((data) => {
        const map = {};
        data.daily.time.forEach((day, i) => {
          map[day] = {
            code: data.daily.weather_code[i],
            tmax: Math.round(data.daily.temperature_2m_max[i]),
            tmin: Math.round(data.daily.temperature_2m_min[i]),
            rain: data.daily.precipitation_probability_max[i],
          };
        });
        cache = map;
        setForecast(map);
      })
      .catch(() => setForecast({}));
  }, []);

  return forecast;
}