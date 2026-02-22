import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeatherStore } from '@/store/weather-store';
// Helper to determine gradient based on weather code and time of day
const getBackgroundGradient = (code: number, isDay: boolean): string => {
  // Default to a nice blue if no data
  if (code === undefined) return 'bg-gradient-to-br from-sky-400 to-blue-600';
  // Night time overrides
  if (!isDay) {
    if (code <= 3) return 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'; // Clear/Cloudy Night
    if (code <= 67) return 'bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900'; // Rainy Night
    return 'bg-gradient-to-br from-gray-900 via-slate-800 to-black'; // Stormy/Snowy Night
  }
  // Day time
  // 0: Clear sky
  if (code === 0) return 'bg-gradient-to-br from-sky-400 via-blue-400 to-blue-600';
  // 1-3: Cloudy
  if (code <= 3) return 'bg-gradient-to-br from-sky-300 via-slate-300 to-slate-400';
  // 45, 48: Fog
  if (code <= 48) return 'bg-gradient-to-br from-slate-300 via-gray-300 to-slate-400';
  // 51-67: Rain/Drizzle
  if (code <= 67) return 'bg-gradient-to-br from-slate-400 via-gray-400 to-slate-500';
  // 71-77: Snow
  if (code <= 77) return 'bg-gradient-to-br from-sky-100 via-blue-100 to-slate-200';
  // 80-82: Rain showers
  if (code <= 82) return 'bg-gradient-to-br from-slate-400 via-blue-400 to-slate-500';
  // 85-86: Snow showers
  if (code <= 86) return 'bg-gradient-to-br from-slate-200 via-gray-200 to-slate-300';
  // 95+: Thunderstorm
  return 'bg-gradient-to-br from-slate-600 via-gray-700 to-slate-800';
};
export function WeatherBackground() {
  const data = useWeatherStore((s) => s.data);
  const [gradient, setGradient] = useState('bg-gradient-to-br from-sky-400 to-blue-600');
  useEffect(() => {
    if (data?.current) {
      const newGradient = getBackgroundGradient(data.current.iconCode, data.current.isDay);
      setGradient(newGradient);
    }
  }, [data]);
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={gradient}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className={`absolute inset-0 ${gradient}`}
        />
      </AnimatePresence>
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white/20 blur-[100px] animate-float" style={{ animationDuration: '15s' }} />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-white/10 blur-[80px] animate-float" style={{ animationDuration: '20s', animationDelay: '2s' }} />
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-black/10 blur-[100px] animate-float" style={{ animationDuration: '18s', animationDelay: '5s' }} />
      </div>
    </div>
  );
}