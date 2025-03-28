import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TimeNavigation from "@/components/TimeNavigation";
import WorldMap from "@/components/WorldMap";
import TimeZoneGlobe from "@/components/TimeZoneGlobe";
import LocationList from "@/components/LocationList";
import TimeComparison from "@/components/TimeComparison";
import AddLocationDialog from "@/components/AddLocationDialog";
import { Location, defaultLocations } from "@/lib/locations";
import { TimeData, getCurrentTimeData, getTimeData, convertTimeToAllLocations } from "@/lib/time";
import { Globe, Map as MapIcon } from "lucide-react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [timeData, setTimeData] = useState<Map<string, TimeData>>(new Map<string, TimeData>());
  const [view, setView] = useState<'globe' | 'map'>('globe'); // For toggle between globe and map
  
  // Initialize with default locations
  useEffect(() => {
    // Start with a few default locations
    const initialLocations = defaultLocations.slice(0, 5);
    setLocations(initialLocations);
    
    // Set New York as the default selected location
    setSelectedLocationId(initialLocations[1].id);
  }, []);
  
  // Update times based on selected date/time
  useEffect(() => {
    if (locations.length === 0) return;
    
    // Convert the selected time to all location times
    const allTimeData = convertTimeToAllLocations(selectedDateTime, locations);
    setTimeData(allTimeData);
  }, [selectedDateTime, locations]);
  
  // Toggle dark mode
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Toggle settings panel
  const handleToggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };
  
  // Handle date/time change
  const handleDateTimeChange = (date: Date) => {
    setSelectedDateTime(date);
  };
  
  // Handle location selection
  const handleLocationSelect = (locationId: string) => {
    setSelectedLocationId(locationId);
  };
  
  // Handle location removal
  const handleLocationRemove = (locationId: string) => {
    // Don't remove if it's the last location
    if (locations.length <= 1) return;
    
    // If removing the selected location, select another one
    if (selectedLocationId === locationId) {
      const otherLocation = locations.find(loc => loc.id !== locationId);
      if (otherLocation) {
        setSelectedLocationId(otherLocation.id);
      }
    }
    
    setLocations(locations.filter(location => location.id !== locationId));
  };
  
  // Handle adding a location
  const handleAddLocation = (location: Location) => {
    // Check if location already exists
    if (locations.some(loc => loc.id === location.id)) return;
    
    setLocations([...locations, location]);
  };
  
  // Get existing location IDs for filtering
  const existingLocationIds = new Set(locations.map(loc => loc.id));
  
  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Header 
        onToggleTheme={handleToggleTheme} 
        isDarkMode={isDarkMode}
        onToggleSettings={handleToggleSettings}
      />
      
      <main className="flex-grow container mx-auto p-4">
        {/* Current Time Display */}
        <div className="mb-6 p-4 bg-white dark:bg-card rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">Current Time</h2>
            <div className="time-display text-3xl font-medium" id="current-time">
              {selectedDateTime.toLocaleTimeString()}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full text-sm">
              {selectedDateTime.toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </span>
          </div>
        </div>

        {/* Time Navigation Tools */}
        <TimeNavigation 
          onDateTimeChange={handleDateTimeChange}
          selectedDateTime={selectedDateTime}
        />

        {/* Main Content Area with Map and Times */}
        <div className="main-container flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-4">
            {/* Tabs for Map and Globe */}
            <div className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button 
                  className={`flex-1 py-3 px-4 text-center font-medium flex items-center justify-center gap-2 ${
                    view === 'globe' 
                      ? 'border-b-2 border-primary text-primary' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                  onClick={() => setView('globe')}
                >
                  <Globe size={18} />
                  <span>3D Time Zone Globe</span>
                </button>
                <button 
                  className={`flex-1 py-3 px-4 text-center font-medium flex items-center justify-center gap-2 ${
                    view === 'map' 
                      ? 'border-b-2 border-primary text-primary' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                  onClick={() => setView('map')}
                >
                  <MapIcon size={18} />
                  <span>2D World Map</span>
                </button>
              </div>
              
              {/* The Globe View */}
              {view === 'globe' && (
                <div className="h-[500px]">
                  <TimeZoneGlobe 
                    locations={locations}
                    selectedLocationId={selectedLocationId}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
              )}
              
              {/* 2D Map View */}
              {view === 'map' && (
                <div className="p-4 h-[500px]">
                  <WorldMap 
                    locations={locations}
                    selectedLocationId={selectedLocationId}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
              )}
            </div>
          </div>
          
          <LocationList 
            locations={locations}
            timeData={timeData}
            selectedLocationId={selectedLocationId}
            onLocationSelect={handleLocationSelect}
            onLocationRemove={handleLocationRemove}
            onAddLocationClick={() => setIsAddLocationOpen(true)}
          />
        </div>
        
        {/* Time Comparison Section */}
        <TimeComparison 
          locations={locations}
          timeData={timeData}
          selectedLocationId={selectedLocationId}
        />
      </main>
      
      <Footer />
      
      {/* Add Location Dialog */}
      <AddLocationDialog 
        isOpen={isAddLocationOpen}
        onClose={() => setIsAddLocationOpen(false)}
        onAddLocation={handleAddLocation}
        existingLocationIds={existingLocationIds}
      />
    </div>
  );
}
