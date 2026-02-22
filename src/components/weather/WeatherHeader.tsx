import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, History, CloudSun, Trash2, Loader2, Heart, Share2, Star } from 'lucide-react';
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
import { searchCities, SearchResult } from '@/lib/weather-api';
import { useDebounce } from 'react-use';
import { toast } from 'sonner';
const POPULAR_CITIES = [
  'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore'
];
export function WeatherHeader() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchCity = useWeatherStore((s) => s.searchCity);
  const searchByCoords = useWeatherStore((s) => s.searchByCoords);
  const recentSearches = useWeatherStore((s) => s.recentSearches);
  const clearHistory = useWeatherStore((s) => s.clearHistory);
  const unit = useWeatherStore((s) => s.unit);
  const toggleUnit = useWeatherStore((s) => s.toggleUnit);
  const favorites = useWeatherStore((s) => s.favorites);
  const toggleFavorite = useWeatherStore((s) => s.toggleFavorite);
  const currentData = useWeatherStore((s) => s.data);
  const { isDark, toggleTheme } = useTheme();
  // Debounce search
  useDebounce(
    () => {
      if (query.length > 2) {
        setIsSearching(true);
        searchCities(query)
          .then((results) => {
            setSuggestions(results);
            setShowSuggestions(true);
          })
          .catch((err) => {
            console.error('Search failed', err);
            setSuggestions([]);
          })
          .finally(() => {
            setIsSearching(false);
          });
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },
    300,
    [query]
  );
  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchCity(query.trim());
      setShowSuggestions(false);
      setQuery('');
    }
  };
  const handleSuggestionClick = (city: SearchResult) => {
    searchByCoords(city.lat, city.lon);
    setQuery('');
    setShowSuggestions(false);
  };
  const handleQuickSearch = (city: string) => {
    searchCity(city);
  };
  const handleShare = async () => {
    if (!currentData?.location?.name) {
      toast.error("No city selected to share");
      return;
    }
    const shareData = {
      title: `Skylys Weather - ${currentData.location.name}`,
      text: `Check out the weather in ${currentData.location.name}: ${Math.round(currentData.current.temp)}° ${currentData.current.condition}`,
      url: window.location.href,
    };
    // Use Web Share API if available (mobile/supported browsers)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback to clipboard copy
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(`Link copied for ${currentData.location.name}!`);
      } catch (err) {
        console.error('Clipboard error:', err);
        toast.error("Failed to copy link");
      }
    }
  };
  const isCurrentFavorite = currentData?.location?.name
    ? favorites.includes(currentData.location.name)
    : false;
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
        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-sky-500 transition-colors">
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </div>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (query.length > 2 && suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              placeholder="Search city..."
              className="pl-9 pr-4 h-10 bg-white/40 dark:bg-black/20 border-transparent focus:bg-background/80 focus:border-sky-500/50 transition-all duration-300 rounded-xl backdrop-blur-sm shadow-sm"
            />
          </form>
          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="py-1">
                {suggestions.map((city, index) => (
                  <button
                    key={`${city.lat}-${city.lon}-${index}`}
                    onClick={() => handleSuggestionClick(city)}
                    className="w-full text-left px-4 py-2.5 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors flex items-center gap-3 group"
                  >
                    <div className="h-8 w-8 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{city.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {[city.admin1, city.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Actions Area */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Favorites Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-white/20 dark:hover:bg-black/20 hover:text-sky-600 transition-colors">
                <Star className={cn("h-5 w-5", favorites.length > 0 ? "fill-yellow-400 text-yellow-400" : "")} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-md border-white/10">
              <DropdownMenuLabel>Favorite Cities</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {favorites.length === 0 ? (
                <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                  No favorites yet
                </div>
              ) : (
                favorites.map((city) => (
                  <DropdownMenuItem key={city} onClick={() => handleQuickSearch(city)} className="cursor-pointer">
                    {city}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Popular Cities Dropdown */}
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
          {/* Recent Searches Dropdown */}
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
          {/* Share Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="rounded-full hover:bg-white/20 dark:hover:bg-black/20 hover:text-sky-600 transition-colors"
            title="Share Link"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          {/* Like/Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => currentData?.location?.name && toggleFavorite(currentData.location.name)}
            className={cn(
              "rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors",
              isCurrentFavorite ? "text-red-500 hover:text-red-600" : "hover:text-red-500"
            )}
            title={isCurrentFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={cn("h-5 w-5", isCurrentFavorite ? "fill-current" : "")} />
          </Button>
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