import React, { useEffect } from 'react';
import { WeatherHeader } from '@/components/weather/WeatherHeader';
import { MainWeatherCard } from '@/components/weather/MainWeatherCard';
import { NearbyGrid } from '@/components/weather/NearbyGrid';
import { ForecastStrip } from '@/components/weather/ForecastStrip';
import { WeatherBackground } from '@/components/weather/WeatherBackground';
import { useWeatherStore } from '@/store/weather-store';
import { Toaster } from '@/components/ui/sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
export function HomePage() {
  const searchCity = useWeatherStore((s) => s.searchCity);
  const error = useWeatherStore((s) => s.error);
  const data = useWeatherStore((s) => s.data);
  // Initial load
  useEffect(() => {
    if (!data) {
      searchCity('London');
    }
  }, [searchCity, data]);
  return (
    <div className="min-h-screen font-sans selection:bg-sky-100 selection:text-sky-900 dark:selection:bg-sky-900 dark:selection:text-sky-100 relative">
      {/* Dynamic Background */}
      <WeatherBackground />
      {/* Main Content Wrapper - Transparent to show background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <WeatherHeader />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-12 w-full">
          {error && (
            <Alert variant="destructive" className="animate-fade-in bg-background/80 backdrop-blur-md border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <section>
            <MainWeatherCard />
          </section>
          <section className="animate-slide-up">
            <ForecastStrip />
          </section>
          <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <NearbyGrid />
          </section>
        </main>
        <footer className="border-t border-white/10 py-8 mt-12 bg-background/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Built with ❤️ by Aurelia | Your AI Co-founder</p>
            <p className="mt-2 text-xs opacity-70">Weather data provided by OpenMeteo</p>
          </div>
        </footer>
      </div>
      <Toaster richColors closeButton position="top-center" />
    </div>
  );
}