import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TimeNavigation from "@/components/TimeNavigation";
import LocationList from "@/components/LocationList";
import TimeComparison from "@/components/TimeComparison";
import AddLocationDialog from "@/components/AddLocationDialog";
import { Location, defaultLocations } from "@/lib/locations";
import { TimeData, convertTimeToAllLocations } from "@/lib/time";
import { Clock, CalendarClock, Globe } from "lucide-react";
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());
  const [useRealTime, setUseRealTime] = useState<boolean>(true); // 控制是否使用实时更新
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [timeData, setTimeData] = useState<Map<string, TimeData>>(new Map<string, TimeData>());
  
  // App title and description
  const appTitle = "World Clock - Global Time Zone Converter";
  const appDescription = "Compare time across multiple global cities with our intuitive world clock and time zone converter. Find local times, schedule meetings, and plan international calls easily.";
  
  // Initialize with default locations
  useEffect(() => {
    // Start with a few default locations
    const initialLocations = defaultLocations.slice(0, 5);
    setLocations(initialLocations);
    
    // Set New York as the default selected location
    setSelectedLocationId(initialLocations[1].id);
  }, []);
  
  // 实时更新时间：每秒更新一次当前时间
  useEffect(() => {
    if (!useRealTime) return;
    
    // 设置定时器，实时更新时间
    const timer = setInterval(() => {
      setSelectedDateTime(new Date());
    }, 1000);
    
    // 清理函数
    return () => {
      clearInterval(timer);
    };
  }, [useRealTime]);
  
  // Update times based on selected date/time
  useEffect(() => {
    if (locations.length === 0) return;
    
    // Convert the selected time to all location times
    const allTimeData = convertTimeToAllLocations(selectedDateTime, locations);
    setTimeData(allTimeData);
  }, [selectedDateTime, locations]);
  
  // Update document title when selected location or time data changes
  useEffect(() => {
    if (!selectedLocationId || !timeData.size) return;
    
    // Update document title with current selected location
    const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
    if (selectedLocation) {
      const locationTime = timeData.get(selectedLocationId);
      if (locationTime) {
        document.title = `${locationTime.time} - ${selectedLocation.name} | World Clock`;
      }
    }
  }, [selectedLocationId, timeData, locations]);
  
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
    // If user manually adjusts time, turn off live updates
    if (useRealTime) {
      setUseRealTime(false);
    }
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
  
  // Handle drag and drop reordering of locations
  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    
    // If dropped outside of droppable area or no movement
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Create new array of locations with reordered items
    const reorderedLocations = Array.from(locations);
    // Remove the dragged item
    const [movedLocation] = reorderedLocations.splice(source.index, 1);
    // Insert the item at the new position
    reorderedLocations.splice(destination.index, 0, movedLocation);
    
    // Update the locations state
    setLocations(reorderedLocations);
  };
  
  // Get existing location IDs for filtering
  const existingLocationIds = new Set(locations.map(loc => loc.id));
  
  // Get selected location data for SEO
  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
  const selectedLocationTime = selectedLocation && timeData.get(selectedLocationId || '');
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={`flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 ${isDarkMode ? 'dark' : ''}`}>
        {/* SEO Meta Tags */}
        <Helmet>
          <title>{appTitle}</title>
          <meta name="description" content={appDescription} />
          <meta name="keywords" content="world clock, time zones, time converter, global time, international time, time difference calculator" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={appTitle} />
          <meta property="og:description" content={appDescription} />
          <meta property="og:site_name" content="World Time Zones" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={appTitle} />
          <meta name="twitter:description" content={appDescription} />
          
          {/* Canonical URL */}
          <link rel="canonical" href={window.location.href} />
          
          {/* Schema.org structured data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": appTitle,
              "description": appDescription,
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })}
          </script>
        </Helmet>
        
        <Header 
          onToggleTheme={handleToggleTheme} 
          isDarkMode={isDarkMode}
          onToggleSettings={handleToggleSettings}
        />
        
        <main className="flex-grow container mx-auto px-4 py-6">
          <section className="mb-6">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
                World Time Zone Converter
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Compare local times across multiple cities and time zones. Perfect for scheduling international meetings, calls, and travel planning.
              </p>
            </header>
          </section>
          
          {/* Two-column layout for main content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column - Current time and settings */}
            <div className="lg:col-span-4 space-y-6">
              {/* Current Time Display */}
              <article className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-neutral-200 dark:border-neutral-700 p-4 flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  <h2 className="text-lg font-medium">Current Time</h2>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <time 
                      dateTime={selectedDateTime.toISOString()} 
                      className="text-4xl font-bold text-center block bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text"
                    >
                      {selectedDateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </time>
                    <time 
                      dateTime={selectedDateTime.toISOString()} 
                      className="text-center text-sm mt-1 text-neutral-500 block"
                    >
                      {selectedDateTime.toLocaleDateString(undefined, { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </time>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                      {Intl.DateTimeFormat().resolvedOptions().timeZone.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </article>
              
              {/* Time Navigation Tools */}
              <section className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-neutral-200 dark:border-neutral-700 p-4 flex items-center">
                  <CalendarClock className="h-5 w-5 text-primary mr-2" />
                  <h2 className="text-lg font-medium">Adjust Time</h2>
                </div>
                <div className="p-4">
                  <TimeNavigation 
                    onDateTimeChange={handleDateTimeChange}
                    selectedDateTime={selectedDateTime}
                    useRealTime={useRealTime}
                    onToggleRealTime={(value) => {
                      setUseRealTime(value);
                      // If user turns off live updates, stay at current time
                      // If user turns on live updates, reset to current time
                      if (value) {
                        setSelectedDateTime(new Date());
                      }
                    }}
                  />
                </div>
              </section>
              
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
              <section aria-labelledby="time-comparison-heading">
                <h2 id="time-comparison-heading" className="sr-only">Time Comparison Table</h2>
                <TimeComparison 
                  locations={locations}
                  timeData={timeData}
                  selectedLocationId={selectedLocationId}
                />
              </section>
              
              {/* SEO-friendly content */}
              <section className="bg-white dark:bg-card rounded-lg shadow-sm p-6 prose prose-sm dark:prose-invert max-w-none">
                <h2 className="flex items-center text-lg font-medium mb-3">
                  <Globe className="h-5 w-5 text-primary mr-2" />
                  About World Time Zones
                </h2>
                
                <p>
                  World time zones are standardized time offsets used across the globe to coordinate time. 
                  There are 24 main time zones, each approximately 15 degrees of longitude apart, 
                  with local variations due to country boundaries and daylight saving adjustments.
                </p>
                
                {selectedLocation && selectedLocationTime && (
                  <div className="mt-4">
                    <h3 className="text-base font-medium">Currently Viewing: {selectedLocation.name}</h3>
                    <p>
                      {selectedLocation.name} is located in {selectedLocation.country} and uses the 
                      {' '}{selectedLocation.timezone} time zone. The current local time 
                      is {selectedLocationTime.time} on {selectedLocationTime.date}.
                    </p>
                  </div>
                )}
                
                <h3 className="text-base font-medium mt-4">Time Zone Basics</h3>
                <ul>
                  <li>Each time zone is typically based on 15° longitude intervals</li>
                  <li>Coordinated Universal Time (UTC) is the primary time standard</li>
                  <li>Some countries span multiple time zones</li>
                  <li>Daylight Saving Time adds temporary offsets in many regions</li>
                  <li>Time zones can be written as UTC offsets (e.g., UTC+8, UTC-5)</li>
                </ul>
                
                <p className="text-sm text-neutral-500 mt-4">
                  This tool helps you convert times between different time zones and plan 
                  international calls, meetings, and travel with accurate local time information.
                </p>
              </section>
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
    </DragDropContext>
  );
}