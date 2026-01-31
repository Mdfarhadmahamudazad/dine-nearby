import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

// Default to Bangkok, Thailand
const DEFAULT_LOCATION = {
  latitude: 13.7563,
  longitude: 100.5018,
};

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        ...DEFAULT_LOCATION,
        error: "Geolocation is not supported. Using default location.",
        loading: false,
      });
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      let errorMessage = "Unable to get location. Using default location.";
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location permission denied. Using default location.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location unavailable. Using default location.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out. Using default location.";
          break;
      }

      setState({
        ...DEFAULT_LOCATION,
        error: errorMessage,
        loading: false,
      });
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    });
  }, []);

  return state;
};
