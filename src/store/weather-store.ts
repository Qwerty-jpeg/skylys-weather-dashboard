import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeatherData, fetchWeather, fetchWeatherByCoords } from '@/lib/weather-api';
interface WeatherState {
  data: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  unit: 'C' | 'F';
  recentSearches: string[];
  // Actions
  searchCity: (query: string) => Promise<void>;
  searchByCoords: (lat: number, lon: number) => Promise<void>;
  toggleUnit: () => void;
  clearError: () => void;
  addToHistory: (city: string) => void;
  clearHistory: () => void;
}
export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      data: null,
      isLoading: false,
      error: null,
      unit: 'C',
      recentSearches: [],
      searchCity: async (query: string) => {
        set({ isLoading: true, error: null });
        try {
          const data = await fetchWeather(query);
          set((state) => {
            // Filter out duplicates and keep only top 5
            const newHistory = [
              data.location.name, 
              ...state.recentSearches.filter(s => s !== data.location.name)
            ].slice(0, 5);
            return { data, isLoading: false, recentSearches: newHistory };
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to fetch weather data',
            isLoading: false
          });
        }
      },
      searchByCoords: async (lat: number, lon: number) => {
        set({ isLoading: true, error: null });
        try {
          const data = await fetchWeatherByCoords(lat, lon);
          set((state) => {
             const newHistory = [
               data.location.name, 
               ...state.recentSearches.filter(s => s !== data.location.name)
             ].slice(0, 5);
             return { data, isLoading: false, recentSearches: newHistory };
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to fetch weather data',
            isLoading: false
          });
        }
      },
      toggleUnit: () => set((state) => ({ unit: state.unit === 'C' ? 'F' : 'C' })),
      clearError: () => set({ error: null }),
      addToHistory: (city: string) => set((state) => ({
        recentSearches: [city, ...state.recentSearches.filter(s => s !== city)].slice(0, 5)
      })),
      clearHistory: () => set({ recentSearches: [] }),
    }),
    {
      name: 'skylys-weather-storage',
      partialize: (state) => ({ unit: state.unit, recentSearches: state.recentSearches }),
    }
  )
);