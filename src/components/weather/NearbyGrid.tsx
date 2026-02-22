import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeatherStore } from '@/store/weather-store';
import { cn } from '@/lib/utils';
const getWeatherIcon = (code: number) => {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  return '⛈️';
};
const toF = (c: number) => Math.round((c * 9) / 5 + 32);
export function NearbyGrid() {
  const data = useWeatherStore((s) => s.data);
  const unit = useWeatherStore((s) => s.unit);
  const searchCity = useWeatherStore((s) => s.searchCity);
  if (!data?.nearby || data.nearby.length === 0) return null;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-foreground/90">
        <h3 className="text-2xl font-bold tracking-tight">Nearby Places</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.nearby.map((place, index) => {
          const temp = unit === 'F' ? toF(place.temp) : Math.round(place.temp);
          return (
            <motion.div
              key={place.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-background/60 backdrop-blur-md border border-white/10 p-6 hover:shadow-lg hover:bg-background/80 hover:border-sky-200 dark:hover:border-sky-700 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-lg font-bold group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{place.name}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{Math.round(place.distance)} km away</span>
                  </div>
                </div>
                <span className="text-4xl filter drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">{getWeatherIcon(place.iconCode)}</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold tracking-tighter text-foreground">{temp}°</span>
                  <span className="text-sm text-muted-foreground font-medium">{place.condition}</span>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 bg-sky-100 text-sky-900 hover:bg-sky-200 dark:bg-sky-900 dark:text-sky-100 dark:hover:bg-sky-800"
                  onClick={() => searchCity(place.name)}
                >
                  View <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}