import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TimeNavigation from "@/components/TimeNavigation";
import LocationList from "@/components/LocationList";
import TimeComparison from "@/components/TimeComparison";
import AddLocationDialog from "@/components/AddLocationDialog";
import { Location, defaultLocations } from "@/lib/locations";
import { TimeData, convertTimeToAllLocations } from "@/lib/time";
import { Clock, CalendarClock } from "lucide-react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [timeData, setTimeData] = useState<Map<string, TimeData>>(new Map<string, TimeData>());
  
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
    <div className={`flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 ${isDarkMode ? 'dark' : ''}`}>
      <Header 
        onToggleTheme={handleToggleTheme} 
        isDarkMode={isDarkMode}
        onToggleSettings={handleToggleSettings}
      />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Two-column layout for main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Current time and settings */}
          <div className="lg:col-span-4 space-y-6">
            {/* Current Time Display */}
            <div className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-neutral-200 dark:border-neutral-700 p-4 flex items-center">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-lg font-medium">Current Time</h2>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <div className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
                    {selectedDateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className="text-center text-sm mt-1 text-neutral-500">
                    {selectedDateTime.toLocaleDateString(undefined, { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                    {Intl.DateTimeFormat().resolvedOptions().timeZone.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Time Navigation Tools */}
            <div className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-neutral-200 dark:border-neutral-700 p-4 flex items-center">
                <CalendarClock className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-lg font-medium">Adjust Time</h2>
              </div>
              <div className="p-4">
                <TimeNavigation 
                  onDateTimeChange={handleDateTimeChange}
                  selectedDateTime={selectedDateTime}
                />
              </div>
            </div>
            
            {/* Location List */}
            <div className="lg:hidden">
              <LocationList 
                locations={locations}
                timeData={timeData}
                selectedLocationId={selectedLocationId}
                onLocationSelect={handleLocationSelect}
                onLocationRemove={handleLocationRemove}
                onAddLocationClick={() => setIsAddLocationOpen(true)}
              />
            </div>
          </div>
          
          {/* Right column - Location list and time comparison */}
          <div className="lg:col-span-8 space-y-6">
            {/* Location List (visible only on desktop) */}
            <div className="hidden lg:block">
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
          </div>
        </div>
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