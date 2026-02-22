import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
// WMO Weather Code Interpretation
const getWeatherDescription = (code: number): string => {
  const codes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    85: 'Slight snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail'
  };
  return codes[code] || 'Unknown';
};
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/weather', async (c) => {
    const q = c.req.query('q');
    const latParam = c.req.query('lat');
    const lonParam = c.req.query('lon');
    let lat: number, lon: number, name: string, country: string;
    try {
      // 1. Geocoding
      if (q) {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json() as any;
        if (!geoData.results || geoData.results.length === 0) {
          return notFound(c, 'City not found');
        }
        const result = geoData.results[0];
        lat = result.latitude;
        lon = result.longitude;
        name = result.name;
        country = result.country;
      } else if (latParam && lonParam) {
        lat = parseFloat(latParam);
        lon = parseFloat(lonParam);
        // Reverse geocoding is not strictly needed for weather, but nice for display. 
        // For simplicity, we'll just use coordinates or a generic name if not provided.
        // In a real app, we'd call a reverse geocoding API here.
        name = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        country = 'Unknown Location';
      } else {
        return bad(c, 'Missing query parameter q or lat/lon');
      }
      // 2. Fetch Weather Data (Current + Forecast)
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const weatherRes = await fetch(weatherUrl);
      const weatherData = await weatherRes.json() as any;
      if (weatherData.error) {
        return bad(c, 'Weather API Error');
      }
      // 3. Construct Response
      const current = weatherData.current;
      const daily = weatherData.daily;
      // Mocking "Nearby" by slightly shifting coordinates (OpenMeteo doesn't have a "nearby cities" endpoint directly)
      // In a production app, you'd use a proper geospatial query or a different API.
      // Here we generate 3 "nearby" points for visual demonstration.
      const nearby = [
        { name: "North Station", lat: lat + 0.05, lon: lon },
        { name: "South District", lat: lat - 0.05, lon: lon },
        { name: "West End", lat: lat, lon: lon - 0.05 }
      ];
      // We need to fetch weather for these nearby points to be accurate, but to save API calls in this demo
      // we will simulate them based on the main location with slight random variations.
      const nearbyData = nearby.map(place => {
        const variation = (Math.random() - 0.5) * 2; // +/- 1 degree
        return {
          name: place.name,
          temp: current.temperature_2m + variation,
          condition: getWeatherDescription(current.weather_code),
          iconCode: current.weather_code,
          distance: 5 + Math.random() * 5 // Random 5-10km
        };
      });
      const response = {
        current: {
          temp: current.temperature_2m,
          condition: getWeatherDescription(current.weather_code),
          description: getWeatherDescription(current.weather_code),
          iconCode: current.weather_code,
          humidity: current.relative_humidity_2m,
          windSpeed: current.wind_speed_10m,
          pressure: current.surface_pressure,
          feelsLike: current.apparent_temperature,
          isDay: current.is_day === 1
        },
        forecast: daily.time.map((date: string, i: number) => ({
          date,
          maxTemp: daily.temperature_2m_max[i],
          minTemp: daily.temperature_2m_min[i],
          condition: getWeatherDescription(daily.weather_code[i]),
          iconCode: daily.weather_code[i]
        })).slice(0, 5), // 5 days
        location: {
          name,
          country,
          lat,
          lon
        },
        nearby: nearbyData
      };
      return ok(c, response);
    } catch (error) {
      console.error('Weather API Error:', error);
      return bad(c, 'Failed to fetch weather data');
    }
  });
}