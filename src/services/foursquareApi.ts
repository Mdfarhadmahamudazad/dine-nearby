const FOURSQUARE_API_KEY = "215NERK2CGW2TQUKETAUFH3UXKYCN22NDOTJYVCIMVXLKFEQ";
const BASE_URL = "https://api.foursquare.com/v2/venues";

/* =======================
   Interfaces
======================= */

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
  distance: number;
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
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

/* =======================
   Helpers
======================= */

const getPhotoUrl = (
  photo: FoursquarePhoto,
  size: string = "400x300"
): string => {
  return `${photo.prefix}${size}${photo.suffix}`;
};

const mapToRestaurant = (place: FoursquarePlace): Restaurant => {
  const primaryCategory = place.categories?.[0];
  const photo = place.photos?.[0];
  const rating = place.rating ? Math.min(Math.max(place.rating / 2, 0), 5) : 3.5;

  return {
    id: place.fsq_id,
    name: place.name,
    cuisine:
      primaryCategory?.short_name ||
      primaryCategory?.name ||
      "Restaurant",
    rating: rating,
    reviewCount: place.stats?.total_ratings || 0,
    distance: Math.round((place.distance / 1000) * 10) / 10,
    priceLevel: place.price ?? 2,
    address:
      place.location?.formatted_address ||
      place.location?.address ||
      "Address unavailable",
    image: photo
      ? getPhotoUrl(photo)
      : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    isOpen: place.hours?.open_now ?? true,
    coordinates: {
      lat: place.geocodes.main.latitude,
      lng: place.geocodes.main.longitude,
    },
  };
};

/* =======================
   API Functions
======================= */

export const searchRestaurants = async (
  lat: number,
  lng: number,
  query?: string,
  radius: number = 3000
): Promise<Restaurant[]> => {
  try {
    // Foursquare API v2 uses v=YYYYMMDD for versioning
    const params = new URLSearchParams({
      ll: `${lat},${lng}`,
      radius: radius.toString(),
      categories: "13065", // Restaurant category
      limit: "20",
      v: "20240101", // Required API version parameter
    });

    if (query && query.trim()) {
      params.append("query", query.trim());
    }

    // Add fields parameter if needed (note: Foursquare v2 might handle fields differently)
    const fields = [
      'fsq_id', 'name', 'categories', 'distance', 
      'geocodes', 'location', 'photos', 'rating', 
      'stats', 'price', 'hours'
    ];
    params.append('fields', fields.join(','));

    const response = await fetch(
      `${BASE_URL}/search?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${FOURSQUARE_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Foursquare API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      // Return empty array instead of throwing for better UX
      console.warn("Foursquare API failed, returning empty results");
      return [];
    }

    const data = await response.json();
    
    // Check if response has the expected structure
    if (!data.response || !Array.isArray(data.response.venues)) {
      console.error("Unexpected API response structure:", data);
      return [];
    }
    
    // Map Foursquare v2 response structure
    const places: FoursquarePlace[] = data.response.venues.map((venue: any) => ({
      fsq_id: venue.id || venue.fsq_id,
      name: venue.name,
      categories: venue.categories || [],
      distance: venue.location?.distance || 0,
      geocodes: {
        main: {
          latitude: venue.location?.lat || lat,
          longitude: venue.location?.lng || lng
        }
      },
      location: {
        address: venue.location?.address || '',
        country: venue.location?.country || '',
        formatted_address: venue.location?.formattedAddress?.[0] || venue.location?.address || 'Address unavailable',
        ...venue.location
      },
      photos: venue.photos?.groups?.[0]?.items || [],
      rating: venue.rating,
      stats: {
        total_photos: venue.photos?.count || 0,
        total_ratings: venue.ratingSignals || 0,
        total_tips: venue.tips?.count || 0
      },
      price: venue.price?.tier || 2,
      hours: {
        open_now: venue.hours?.isOpen || true
      }
    }));
    
    return places.map(mapToRestaurant);
  } catch (error) {
    console.error("Error searching restaurants:", error);
    return [];
  }
};

export const getRandomRestaurant = (
  restaurants: Restaurant[]
): Restaurant | null => {
  if (!restaurants || !restaurants.length) return null;
  return restaurants[Math.floor(Math.random() * restaurants.length)];
};

// Optional: Add a function to get restaurant details by ID
export const getRestaurantDetails = async (
  restaurantId: string
): Promise<Restaurant | null> => {
  try {
    const params = new URLSearchParams({
      fields: 'fsq_id,name,categories,geocodes,location,photos,rating,stats,price,hours',
      v: '20240101'
    });

    const response = await fetch(
      `${BASE_URL}/${restaurantId}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${FOURSQUARE_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch restaurant details");
      return null;
    }

    const data = await response.json();
    const place = data.response.venue;
    
    const mappedPlace: FoursquarePlace = {
      fsq_id: place.id,
      name: place.name,
      categories: place.categories || [],
      distance: 0,
      geocodes: {
        main: {
          latitude: place.location?.lat || 0,
          longitude: place.location?.lng || 0
        }
      },
      location: {
        address: place.location?.address || '',
        country: place.location?.country || '',
        formatted_address: place.location?.formattedAddress?.[0] || 'Address unavailable',
        ...place.location
      },
      photos: place.photos?.groups?.[0]?.items || [],
      rating: place.rating,
      stats: {
        total_photos: place.photos?.count || 0,
        total_ratings: place.ratingSignals || 0,
        total_tips: place.tips?.count || 0
      },
      price: place.price?.tier || 2,
      hours: {
        open_now: place.hours?.isOpen || true
      }
    };

    return mapToRestaurant(mappedPlace);
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    return null;
  }
};