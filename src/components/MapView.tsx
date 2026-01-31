import { MapPin, Navigation } from "lucide-react";
import { Restaurant } from "@/services/foursquareApi";
import { cn } from "@/lib/utils";

interface MapViewProps {
  restaurants: Restaurant[];
  selectedRestaurant?: Restaurant | null;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  userLocation?: { lat: number; lng: number } | null;
}

const MapView = ({ restaurants, selectedRestaurant, onSelectRestaurant, userLocation }: MapViewProps) => {
  // Calculate marker positions based on actual coordinates
  const getMarkerPosition = (restaurant: Restaurant) => {
    if (!userLocation || restaurants.length === 0) {
      return { left: "50%", top: "50%" };
    }

    // Calculate bounds
    const lats = restaurants.map(r => r.coordinates.lat);
    const lngs = restaurants.map(r => r.coordinates.lng);
    
    const minLat = Math.min(...lats, userLocation.lat);
    const maxLat = Math.max(...lats, userLocation.lat);
    const minLng = Math.min(...lngs, userLocation.lng);
    const maxLng = Math.max(...lngs, userLocation.lng);

    const latRange = maxLat - minLat || 0.01;
    const lngRange = maxLng - minLng || 0.01;

    // Add padding
    const padding = 0.15;
    const left = padding + ((restaurant.coordinates.lng - minLng) / lngRange) * (1 - 2 * padding);
    const top = padding + ((maxLat - restaurant.coordinates.lat) / latRange) * (1 - 2 * padding);

    return {
      left: `${left * 100}%`,
      top: `${top * 100}%`,
    };
  };

  const getUserPosition = () => {
    if (!userLocation || restaurants.length === 0) {
      return { left: "50%", top: "50%" };
    }

    const lats = restaurants.map(r => r.coordinates.lat);
    const lngs = restaurants.map(r => r.coordinates.lng);
    
    const minLat = Math.min(...lats, userLocation.lat);
    const maxLat = Math.max(...lats, userLocation.lat);
    const minLng = Math.min(...lngs, userLocation.lng);
    const maxLng = Math.max(...lngs, userLocation.lng);

    const latRange = maxLat - minLat || 0.01;
    const lngRange = maxLng - minLng || 0.01;

    const padding = 0.15;
    const left = padding + ((userLocation.lng - minLng) / lngRange) * (1 - 2 * padding);
    const top = padding + ((maxLat - userLocation.lat) / latRange) * (1 - 2 * padding);

    return {
      left: `${left * 100}%`,
      top: `${top * 100}%`,
    };
  };

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-secondary/50 shadow-card lg:h-[500px]">
      {/* Map Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Mock Streets */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-0 h-full w-[2px] bg-muted-foreground/20" />
        <div className="absolute left-1/2 top-0 h-full w-[2px] bg-muted-foreground/20" />
        <div className="absolute left-3/4 top-0 h-full w-[2px] bg-muted-foreground/20" />
        <div className="absolute left-0 top-1/3 h-[2px] w-full bg-muted-foreground/20" />
        <div className="absolute left-0 top-2/3 h-[2px] w-full bg-muted-foreground/20" />
      </div>
      
      {/* User Location */}
      {userLocation && (
        <div 
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
          style={getUserPosition()}
        >
          <div className="relative">
            <div className="h-4 w-4 rounded-full bg-blue-500 shadow-lg">
              <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/50" />
            </div>
            <div className="absolute -inset-8 rounded-full border-2 border-dashed border-blue-300/50" />
          </div>
        </div>
      )}
      
      {/* Restaurant Markers */}
      {restaurants.map((restaurant) => {
        const position = getMarkerPosition(restaurant);
        const isSelected = selectedRestaurant?.id === restaurant.id;
        
        return (
          <button
            key={restaurant.id}
            onClick={() => onSelectRestaurant(restaurant)}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-full transition-all duration-200 hover:z-20 hover:scale-110",
              isSelected && "z-10 scale-125"
            )}
            style={position}
          >
            <div className="relative">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full shadow-lg transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-primary hover:bg-primary hover:text-primary-foreground"
                )}
              >
                <MapPin className="h-4 w-4" />
              </div>
              {isSelected && (
                <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-xs font-medium text-background shadow-lg">
                  {restaurant.name}
                </div>
              )}
            </div>
          </button>
        );
      })}
      
      {/* Empty State */}
      {restaurants.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground">No restaurants to display</p>
        </div>
      )}
      
      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-card transition-all hover:shadow-card-hover">
          <Navigation className="h-5 w-5 text-primary" />
        </button>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 rounded-xl bg-card/90 p-3 shadow-card backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-3 w-3 rounded-full bg-blue-500" />
          <span>Your Location</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span>Restaurant</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
