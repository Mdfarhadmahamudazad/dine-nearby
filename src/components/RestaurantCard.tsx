import { MapPin, Star, Clock } from "lucide-react";
import { Restaurant } from "@/services/foursquareApi";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface RestaurantCardProps {
  restaurant: Restaurant;
  isSelected?: boolean;
  onClick?: () => void;
}

const RestaurantCard = ({ restaurant, isSelected, onClick }: RestaurantCardProps) => {
  const [imageError, setImageError] = useState(false);
  const priceDisplay = "$".repeat(restaurant.priceLevel || 2);
  
  const fallbackImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageError ? fallbackImage : restaurant.image}
          alt={restaurant.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute left-3 top-3">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
              restaurant.isOpen
                ? "bg-green-500/90 text-white"
                : "bg-red-500/90 text-white"
            )}
          >
            <Clock className="h-3 w-3" />
            {restaurant.isOpen ? "Open" : "Closed"}
          </span>
        </div>
        
        {/* Rating Badge */}
        {restaurant.rating > 0 && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-bold backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              {restaurant.rating.toFixed(1)}
            </span>
          </div>
        )}
        
        {/* Cuisine Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
            {restaurant.cuisine}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <span className="shrink-0 text-sm font-semibold text-muted-foreground">
            {priceDisplay}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{restaurant.distance} km</span>
          </div>
          {restaurant.reviewCount > 0 && (
            <>
              <span>•</span>
              <span>{restaurant.reviewCount} reviews</span>
            </>
          )}
        </div>
        
        <p className="mt-2 text-sm text-muted-foreground truncate">
          {restaurant.address}
        </p>
      </div>
    </div>
  );
};

export default RestaurantCard;
