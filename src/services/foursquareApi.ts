const FOURSQUARE_API_KEY = "fsq3AzKTkYmLZqTt9PPsWBHdr3JFTEv2l8Z24ZZgghZXn2Y=";
const BASE_URL = "https://api.foursquare.com/v3/places";

export interface FoursquarePhoto {
  id: string;
  prefix: string;
  suffix: string;
  width: number;
  height: number;
}

export interface FoursquareCategory {
  id: number;
  name: string;
  short_name: string;
  plural_name: string;
  icon: {
    prefix: string;
    suffix: string;
  };
}

export interface FoursquareLocation {
  address?: string;
  address_extended?: string;
  country: string;
  cross_street?: string;
  formatted_address: string;
  locality?: string;
  postcode?: string;
  region?: string;
}

export interface FoursquarePlace {
  fsq_id: string;
  name: string;
  categories: FoursquareCategory[];
  chains: { id: string; name: string }[];
  closed_bucket: string;
  distance: number;
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
  link: string;
  location: FoursquareLocation;
  photos?: FoursquarePhoto[];
  rating?: number;
  stats?: {
    total_photos: number;
    total_ratings: number;
    total_tips: number;
  };
  price?: number;
  hours?: {
    open_now: boolean;
  };
}

export interface SearchResponse {
  results: FoursquarePlace[];
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  distance: number;
  priceLevel: number;
  address: string;
  image: string;
  isOpen: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const getPhotoUrl = (photo: FoursquarePhoto, size: string = "400x300"): string => {
  return `${photo.prefix}${size}${photo.suffix}`;
};

const mapToRestaurant = (place: FoursquarePlace): Restaurant => {
  const primaryCategory = place.categories[0];
  const photo = place.photos?.[0];
  
  return {
    id: place.fsq_id,
    name: place.name,
    cuisine: primaryCategory?.short_name || primaryCategory?.name || "Restaurant",
    rating: place.rating ? place.rating / 2 : 4.0, // Foursquare uses 1-10, we use 1-5
    reviewCount: place.stats?.total_ratings || 0,
    distance: Math.round((place.distance / 1000) * 10) / 10, // Convert meters to km
    priceLevel: place.price || 2,
    address: place.location.formatted_address || place.location.address || "Address unavailable",
    image: photo 
      ? getPhotoUrl(photo) 
      : `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80`,
    isOpen: place.hours?.open_now ?? true,
    coordinates: {
      lat: place.geocodes.main.latitude,
      lng: place.geocodes.main.longitude,
    },
  };
};

export const searchRestaurants = async (
  lat: number,
  lng: number,
  query?: string,
  radius: number = 3000 // 3km in meters
): Promise<Restaurant[]> => {
  const params = new URLSearchParams({
    ll: `${lat},${lng}`,
    radius: radius.toString(),
    categories: "13065", // Food & Dining category
    limit: "20",
    fields: "fsq_id,name,categories,distance,geocodes,location,photos,rating,stats,price,hours,closed_bucket",
  });

  if (query) {
    params.append("query", query);
  }

  const response = await fetch(`${BASE_URL}/search?${params}`, {
    headers: {
      Authorization: FOURSQUARE_API_KEY,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Foursquare API error: ${response.status}`);
  }

  const data: SearchResponse = await response.json();
  return data.results.map(mapToRestaurant);
};

export const getRandomRestaurant = (restaurants: Restaurant[]): Restaurant | null => {
  if (restaurants.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * restaurants.length);
  return restaurants[randomIndex];
};
