import { useState, useEffect, useCallback } from "react";
import { searchRestaurants as fetchRestaurants, Restaurant, getRandomRestaurant } from "@/services/foursquareApi";
import { useGeolocation } from "./useGeolocation";

export const useRestaurants = () => {
  const { latitude, longitude, loading: locationLoading, error: locationError } = useGeolocation();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async (query?: string) => {
    if (!latitude || !longitude) return;
    
    setLoading(true);
    setError(null);

    try {
      const results = await fetchRestaurants(latitude, longitude, query || undefined);
      setRestaurants(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch restaurants");
      console.error("Error fetching restaurants:", err);
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude]);

  // Initial fetch when location is available
  useEffect(() => {
    if (latitude && longitude && !locationLoading) {
      fetchData();
    }
  }, [latitude, longitude, locationLoading, fetchData]);

  // Search with debounce
  useEffect(() => {
    if (!latitude || !longitude || locationLoading) return;

    const timeoutId = setTimeout(() => {
      fetchData(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, latitude, longitude, locationLoading, fetchData]);

  const selectRandom = useCallback((): Restaurant | null => {
    return getRandomRestaurant(restaurants);
  }, [restaurants]);

  return {
    restaurants,
    loading: loading || locationLoading,
    error: error || locationError,
    searchQuery,
    setSearchQuery,
    selectRandom,
    refetch: () => fetchData(searchQuery),
    userLocation: latitude && longitude ? { lat: latitude, lng: longitude } : null,
  };
};
