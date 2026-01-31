export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  distance: number; // in km
  priceLevel: number; // 1-4
  address: string;
  image: string;
  isOpen: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "The Golden Spoon",
    cuisine: "Italian",
    rating: 4.7,
    reviewCount: 342,
    distance: 0.8,
    priceLevel: 3,
    address: "123 Main Street",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    isOpen: true,
    coordinates: { lat: 13.7563, lng: 100.5018 },
  },
  {
    id: "2",
    name: "Sakura Sushi",
    cuisine: "Japanese",
    rating: 4.5,
    reviewCount: 218,
    distance: 1.2,
    priceLevel: 2,
    address: "456 Oak Avenue",
    image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800&q=80",
    isOpen: true,
    coordinates: { lat: 13.7580, lng: 100.5050 },
  },
  {
    id: "3",
    name: "Spice Garden",
    cuisine: "Thai",
    rating: 4.8,
    reviewCount: 456,
    distance: 0.5,
    priceLevel: 2,
    address: "789 Elm Road",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    isOpen: true,
    coordinates: { lat: 13.7545, lng: 100.4990 },
  },
  {
    id: "4",
    name: "Le Petit Bistro",
    cuisine: "French",
    rating: 4.6,
    reviewCount: 189,
    distance: 2.1,
    priceLevel: 4,
    address: "321 Park Lane",
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80",
    isOpen: false,
    coordinates: { lat: 13.7600, lng: 100.5100 },
  },
  {
    id: "5",
    name: "Taco Fiesta",
    cuisine: "Mexican",
    rating: 4.3,
    reviewCount: 267,
    distance: 1.8,
    priceLevel: 1,
    address: "567 River Street",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    isOpen: true,
    coordinates: { lat: 13.7520, lng: 100.4970 },
  },
  {
    id: "6",
    name: "Dragon Palace",
    cuisine: "Chinese",
    rating: 4.4,
    reviewCount: 312,
    distance: 2.5,
    priceLevel: 2,
    address: "890 Temple Road",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
    isOpen: true,
    coordinates: { lat: 13.7610, lng: 100.5080 },
  },
  {
    id: "7",
    name: "Burger & Beyond",
    cuisine: "American",
    rating: 4.2,
    reviewCount: 534,
    distance: 0.9,
    priceLevel: 2,
    address: "234 High Street",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80",
    isOpen: true,
    coordinates: { lat: 13.7555, lng: 100.5030 },
  },
  {
    id: "8",
    name: "Curry House",
    cuisine: "Indian",
    rating: 4.6,
    reviewCount: 278,
    distance: 1.5,
    priceLevel: 2,
    address: "678 Spice Lane",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
    isOpen: true,
    coordinates: { lat: 13.7530, lng: 100.5060 },
  },
];

export const getRandomRestaurant = (restaurants: Restaurant[]): Restaurant => {
  const randomIndex = Math.floor(Math.random() * restaurants.length);
  return restaurants[randomIndex];
};

export const searchRestaurants = (restaurants: Restaurant[], query: string): Restaurant[] => {
  const lowerQuery = query.toLowerCase();
  return restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(lowerQuery) ||
      r.cuisine.toLowerCase().includes(lowerQuery)
  );
};

export const filterByDistance = (restaurants: Restaurant[], maxDistance: number): Restaurant[] => {
  return restaurants.filter((r) => r.distance <= maxDistance);
};
