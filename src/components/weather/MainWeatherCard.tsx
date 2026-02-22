import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Droplets, Gauge, ThermometerSun, MapPin, ArrowUp, ArrowDown } from 'lucide-react';
import { useWeatherStore } from '@/store/weather-store';
import { cn } from '@/lib/utils';
// Helper to convert C to F
const toF = (c: number) => Math.round((c * 9) / 5 + 32);
// Weather Icon mapping (simplified for demo, would be more extensive in prod)
const getWeatherIcon = (code: number, isDay: boolean) => {
  // WMO Weather interpretation codes (WW)
  // 0: Clear sky
  // 1, 2, 3: Mainly clear, partly cloudy, and overcast
  // 45, 48: Fog and depositing rime fog
  // 51, 53, 55: Drizzle: Light, moderate, and dense intensity
  // 61, 63, 65: Rain: Slight, moderate and heavy intensity
  // 71, 73, 75: Snow fall: Slight, moderate and heavy intensity
  // 95: Thunderstorm: Slight or moderate
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code <= 3) return isDay ? '⛅' : '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '❄️';
  return '⛈️';
};
export function MainWeatherCard() {
  const data = useWeatherStore((s) => s.data);
  const unit = useWeatherStore((s) => s.unit);
  const isLoading = useWeatherStore((s) => s.isLoading);
  if (isLoading) {
    return (
      <div className="w-full h-[400px] rounded-3xl bg-muted/20 animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted/30" />
          <div className="h-4 w-32 bg-muted/30 rounded" />
        </div>
      </div>
    );
  }
  if (!data) return null;
  const { current, location } = data;
  const temp = unit === 'F' ? toF(current.temp) : Math.round(current.temp);
  const feelsLike = unit === 'F' ? toF(current.feelsLike) : Math.round(current.feelsLike);
  const icon = getWeatherIcon(current.iconCode, current.isDay);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl transition-all duration-500",
        current.isDay 
          ? "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 shadow-sky-500/20" 
          : "bg-gradient-to-br from-slate-800 via-slate-900 to-black shadow-slate-900/20"
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Location & Status */}
        <div className="flex flex-col justify-between h-full min-h-[200px]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-5 h-5" />
              <span className="text-lg font-medium tracking-wide">{location.country}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{location.name}</h2>
            <p className="text-xl text-white/90 font-medium mt-2">{current.condition}</p>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium">Live Updates</span>
            </div>
          </div>
        </div>
        {/* Right Column: Temperature & Icon */}
        <div className="flex flex-col items-center lg:items-end justify-center">
          <div className="flex items-center justify-center lg:justify-end w-full">
            <span className="text-8xl lg:text-9xl mr-4 filter drop-shadow-lg animate-float">{icon}</span>
            <div className="flex flex-col items-start">
              <span className="text-7xl lg:text-8xl font-bold tracking-tighter">
                {temp}°
              </span>
            </div>
          </div>
          <p className="text-lg text-white/80 mt-2 font-medium">
            Feels like {feelsLike}°
          </p>
        </div>
      </div>
      {/* Bottom Grid: Details */}
      <div className="relative z-10 mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <DetailItem 
          icon={<Droplets className="w-5 h-5" />}
          label="Humidity"
          value={`${current.humidity}%`}
        />
        <DetailItem 
          icon={<Wind className="w-5 h-5" />}
          label="Wind Speed"
          value={`${current.windSpeed} km/h`}
        />
        <DetailItem 
          icon={<Gauge className="w-5 h-5" />}
          label="Pressure"
          value={`${current.pressure} hPa`}
        />
        <DetailItem 
          icon={<ThermometerSun className="w-5 h-5" />}
          label="UV Index"
          value="Moderate" // Placeholder as OpenMeteo basic doesn't always give UV
        />
      </div>
    </motion.div>
  );
}
function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-colors">
      <div className="text-white/70 mb-2">{icon}</div>
      <span className="text-sm text-white/60 font-medium">{label}</span>
      <span className="text-lg font-bold text-white mt-1">{value}</span>
    </div>
  );
}