import { api } from './api-client';
export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    description: string;
    iconCode: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
    feelsLike: number;
    isDay: boolean;
  };
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    condition: string;
    iconCode: number;
  }>;
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  nearby: Array<{
    name: string;
    temp: number;
    condition: string;
    iconCode: number;
    distance: number; // km
  }>;
}
export async function fetchWeather(query: string): Promise<WeatherData> {
  return api<WeatherData>(`/api/weather?q=${encodeURIComponent(query)}`);
}
export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  return api<WeatherData>(`/api/weather?lat=${lat}&lon=${lon}`);
}