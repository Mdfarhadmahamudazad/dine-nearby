import { X, Star, MapPin, Clock, ExternalLink } from "lucide-react";
import { Restaurant } from "@/services/foursquareApi";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onClose: () => void;
}

const RestaurantDetail = ({ restaurant, onClose }: RestaurantDetailProps) => {
  const [imageError, setImageError] = useState(false);
  const priceDisplay = "$".repeat(restaurant.priceLevel || 2);
  const fallbackImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.coordinates.lat},${restaurant.coordinates.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg animate-scale-in sm:mx-4">
        <div className="overflow-hidden rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl">
          {/* Image */}
          <div className="relative aspect-video">
            <img
              src={imageError ? fallbackImage : restaurant.image}
              alt={restaurant.name}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:bg-background"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Status */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${
                  restaurant.isOpen
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                <Clock className="h-4 w-4" />
                {restaurant.isOpen ? "Open Now" : "Closed"}
              </span>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {restaurant.name}
                </h2>
                <p className="mt-1 text-muted-foreground">
                  {restaurant.cuisine} • {priceDisplay}
                </p>
              </div>
              {restaurant.rating > 0 && (
                <div className="flex items-center gap-1 rounded-xl bg-secondary px-3 py-2">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="text-lg font-bold">{restaurant.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <span className="line-clamp-2">{restaurant.address} • {restaurant.distance} km away</span>
              </div>
            </div>
            
            {restaurant.reviewCount > 0 && (
              <div className="mt-4 rounded-xl bg-secondary/50 p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{restaurant.reviewCount}</span> reviews from happy customers
                </p>
              </div>
            )}
            
            {/* Actions */}
            <div className="mt-6">
              <Button variant="hero" className="w-full gap-2" onClick={handleGetDirections}>
                <ExternalLink className="h-4 w-4" />
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
