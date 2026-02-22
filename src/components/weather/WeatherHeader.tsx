import React, { useState } from 'react';
import { Search, MapPin, History, CloudSun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWeatherStore } from '@/store/weather-store';
import { useTheme } from '@/hooks/use-theme';
const POPULAR_CITIES = [
  'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore'
];
export function WeatherHeader() {
  const [query, setQuery] = useState('');
  const searchCity = useWeatherStore((s) => s.searchCity);
  const recentSearches = useWeatherStore((s) => s.recentSearches);
  const unit = useWeatherStore((s) => s.unit);
  const toggleUnit = useWeatherStore((s) => s.toggleUnit);
  const { isDark, toggleTheme } = useTheme();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchCity(query.trim());
      setQuery('');
    }
  };
  const handleQuickSearch = (city: string) => {
    searchCity(city);
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo Area */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <CloudSun className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400">
            Skylys
          </span>
        </div>
        {/* Search Area */}
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-sky-500 transition-colors" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city..."
              className="pl-9 pr-4 h-10 bg-muted/50 border-transparent focus:bg-background focus:border-sky-500/50 transition-all duration-300 rounded-xl"
            />
          </form>
        </div>
        {/* Actions Area */}
        <div className="flex items-center gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-sky-50 dark:hover:bg-sky-950/30 hover:text-sky-600">
                <MapPin className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Popular Cities</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {POPULAR_CITIES.map((city) => (
                <DropdownMenuItem key={city} onClick={() => handleQuickSearch(city)} className="cursor-pointer">
                  {city}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {recentSearches.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-sky-50 dark:hover:bg-sky-950/30 hover:text-sky-600">
                  <History className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Recent Searches</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {recentSearches.map((city) => (
                  <DropdownMenuItem key={city} onClick={() => handleQuickSearch(city)} className="cursor-pointer">
                    {city}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <div className="h-6 w-px bg-border mx-1 hidden sm:block" />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleUnit}
            className="font-medium w-10 h-10 rounded-full hover:bg-sky-50 dark:hover:bg-sky-950/30 hover:text-sky-600"
          >
            °{unit}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-sky-50 dark:hover:bg-sky-950/30 hover:text-sky-600"
          >
            {isDark ? '🌙' : '☀️'}
          </Button>
        </div>
      </div>
    </header>
  );
}