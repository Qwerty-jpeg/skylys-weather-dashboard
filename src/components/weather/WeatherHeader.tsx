import React, { useState } from 'react';
import { Search, MapPin, History, CloudSun, Trash2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';
const POPULAR_CITIES = [
  'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore'
];
export function WeatherHeader() {
  const [query, setQuery] = useState('');
  const searchCity = useWeatherStore((s) => s.searchCity);
  const recentSearches = useWeatherStore((s) => s.recentSearches);
  const clearHistory = useWeatherStore((s) => s.clearHistory);
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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/30 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo Area */}
        <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 ring-1 ring-white/20">
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
              className="pl-9 pr-4 h-10 bg-white/40 dark:bg-black/20 border-transparent focus:bg-background/80 focus:border-sky-500/50 transition-all duration-300 rounded-xl backdrop-blur-sm shadow-sm"
            />
          </form>
        </div>
        {/* Actions Area */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-white/20 dark:hover:bg-black/20 hover:text-sky-600 transition-colors">
                <MapPin className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-md border-white/10">
              <DropdownMenuLabel>Popular Cities</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {POPULAR_CITIES.map((city) => (
                <DropdownMenuItem key={city} onClick={() => handleQuickSearch(city)} className="cursor-pointer">
                  {city}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "hidden sm:flex hover:bg-white/20 dark:hover:bg-black/20 hover:text-sky-600 transition-colors",
                  recentSearches.length === 0 && "opacity-50 pointer-events-none"
                )}
              >
                <History className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-md border-white/10">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-sm font-semibold">Recent Searches</span>
                {recentSearches.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-muted-foreground hover:text-destructive" 
                    onClick={clearHistory}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              {recentSearches.length === 0 ? (
                <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                  No recent searches
                </div>
              ) : (
                recentSearches.map((city) => (
                  <DropdownMenuItem key={city} onClick={() => handleQuickSearch(city)} className="cursor-pointer">
                    {city}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block" />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleUnit}
            className="font-medium w-10 h-10 rounded-full hover:bg-white/20 dark:hover:bg-black/20 hover:text-sky-600 transition-colors"
          >
            °{unit}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-white/20 dark:hover:bg-black/20 hover:text-sky-600 transition-colors"
          >
            {isDark ? '🌙' : '☀️'}
          </Button>
        </div>
      </div>
    </header>
  );
}