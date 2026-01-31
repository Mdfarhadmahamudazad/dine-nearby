import { useState, useMemo } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import RestaurantCard from "@/components/RestaurantCard";
import MapView from "@/components/MapView";
import RandomButton from "@/components/RandomButton";
import RestaurantDetail from "@/components/RestaurantDetail";
import {
  mockRestaurants,
  searchRestaurants,
  getRandomRestaurant,
  filterByDistance,
  Restaurant,
} from "@/data/mockRestaurants";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);

  // Filter restaurants within 3km and by search query
  const filteredRestaurants = useMemo(() => {
    let results = filterByDistance(mockRestaurants, 3);
    if (searchQuery) {
      results = searchRestaurants(results, searchQuery);
    }
    return results;
  }, [searchQuery]);

  const handleRandomSelect = () => {
    setIsRandomizing(true);
    
    // Animate through random selections
    let count = 0;
    const interval = setInterval(() => {
      const random = getRandomRestaurant(filteredRestaurants);
      setSelectedRestaurant(random);
      count++;
      
      if (count >= 8) {
        clearInterval(interval);
        setIsRandomizing(false);
        setShowDetail(true);
      }
    }, 150);
  };

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetail(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 lg:py-10">
        {/* Hero Section */}
        <section className="mb-8 text-center lg:mb-12">
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Find Your Next{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Favorite Restaurant
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Discover amazing places to eat within 3km of your location. Search by name, cuisine, or let us surprise you!
          </p>
        </section>
        
        {/* Search & Random */}
        <section className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:mb-12">
          <div className="w-full max-w-xl">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <RandomButton onClick={handleRandomSelect} isAnimating={isRandomizing} />
        </section>
        
        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredRestaurants.length}</span> restaurants found
          </p>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Map Section */}
          <section className="order-2 lg:order-1">
            <h2 className="mb-4 text-lg font-bold text-foreground">Map View</h2>
            <MapView
              restaurants={filteredRestaurants}
              selectedRestaurant={selectedRestaurant}
              onSelectRestaurant={handleSelectRestaurant}
            />
          </section>
          
          {/* Restaurant List */}
          <section className="order-1 lg:order-2">
            <h2 className="mb-4 text-lg font-bold text-foreground">Nearby Restaurants</h2>
            
            {filteredRestaurants.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-secondary/50 text-center">
                <p className="text-lg font-semibold text-foreground">No restaurants found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {filteredRestaurants.map((restaurant, index) => (
                  <div
                    key={restaurant.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <RestaurantCard
                      restaurant={restaurant}
                      isSelected={selectedRestaurant?.id === restaurant.id}
                      onClick={() => handleSelectRestaurant(restaurant)}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      
      {/* Restaurant Detail Modal */}
      {showDetail && selectedRestaurant && (
        <RestaurantDetail
          restaurant={selectedRestaurant}
          onClose={() => {
            setShowDetail(false);
          }}
        />
      )}
      
      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>FoodFinder © 2026 • Built for restaurant discovery</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
