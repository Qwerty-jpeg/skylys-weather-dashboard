import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useWeatherStore } from '@/store/weather-store';
import { format, parseISO } from 'date-fns';
const getWeatherIcon = (code: number) => {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  return '⛈️';
};
const toF = (c: number) => Math.round((c * 9) / 5 + 32);
export function ForecastStrip() {
  const data = useWeatherStore((s) => s.data);
  const unit = useWeatherStore((s) => s.unit);
  if (!data?.forecast) return null;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-foreground/90">
        <Calendar className="w-5 h-5 text-sky-500" />
        <h3 className="text-2xl font-bold tracking-tight">5-Day Forecast</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {data.forecast.map((day, index) => {
          const max = unit === 'F' ? toF(day.maxTemp) : Math.round(day.maxTemp);
          const min = unit === 'F' ? toF(day.minTemp) : Math.round(day.minTemp);
          const date = parseISO(day.date);
          const isToday = index === 0;
          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`
                flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md
                ${isToday
                  ? 'bg-sky-50/80 border-sky-200 dark:bg-sky-900/40 dark:border-sky-700 shadow-lg shadow-sky-500/10'
                  : 'bg-background/60 border-white/10 hover:bg-background/80 hover:border-sky-200 dark:hover:border-sky-700'
                }
              `}
            >
              <span className={`text-sm font-medium mb-2 ${isToday ? 'text-sky-600 dark:text-sky-300' : 'text-muted-foreground'}`}>
                {isToday ? 'Today' : format(date, 'EEE')}
              </span>
              <span className="text-4xl mb-3 filter drop-shadow-sm transform hover:scale-110 transition-transform duration-300">{getWeatherIcon(day.iconCode)}</span>
              <div className="flex items-center gap-3 w-full justify-center">
                <span className="text-lg font-bold text-foreground">{max}°</span>
                <span className="text-sm text-muted-foreground font-medium">{min}°</span>
              </div>
              <span className="text-xs text-muted-foreground mt-2 text-center line-clamp-1 px-1">
                {day.condition}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}