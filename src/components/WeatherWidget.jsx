import React, { useState, useEffect } from 'react';

export const WeatherWidget = ({ variant = 'minimal' }) => {
  const [weather, setWeather] = useState({ temp: '...', condition: '...', emoji: '☀️' });
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Fetch weather for Mosul (Lat: 36.34, Lon: 43.13) using open-meteo free API
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=36.34&longitude=43.13&current_weather=true');
        const data = await response.json();
        if (data && data.current_weather) {
          const temp = Math.round(data.current_weather.temperature);
          const code = data.current_weather.weathercode;
          
          let condition = 'صافي';
          let emoji = '☀️';

          // Basic WMO Weather interpretation codes
          if (code === 0) { condition = 'صافي'; emoji = '☀️'; }
          else if (code === 1 || code === 2 || code === 3) { condition = 'غائم جزئياً'; emoji = '⛅'; }
          else if (code >= 45 && code <= 48) { condition = 'ضباب'; emoji = '🌫️'; }
          else if (code >= 51 && code <= 67) { condition = 'ممطر'; emoji = '🌧️'; }
          else if (code >= 71 && code <= 77) { condition = 'ثلوج'; emoji = '❄️'; }
          else if (code >= 80 && code <= 82) { condition = 'زخات مطر'; emoji = '🌦️'; }
          else if (code >= 95 && code <= 99) { condition = 'عواصف رعدية'; emoji = '⛈️'; }
          else { condition = 'مشمس'; emoji = '☀️'; }

          setWeather({ temp: `${temp}°`, condition, emoji });
        }
      } catch (err) {
        console.error('Failed to fetch weather:', err);
        setError(true);
        // Fallback
        setWeather({ temp: '38°', condition: 'مشمس', emoji: '☀️' });
      }
    };

    fetchWeather();
    
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (variant === 'minimal') {
    return <span>{weather.emoji} {weather.temp}</span>;
  }

  return <span>الموصل: {weather.temp}C {weather.condition} {weather.emoji}</span>;
};

export default WeatherWidget;
