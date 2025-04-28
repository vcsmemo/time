import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TimeNavigation from "@/components/TimeNavigation";
import LocationList from "@/components/LocationList";
import TimeComparison from "@/components/TimeComparison";
import AddLocationDialog from "@/components/AddLocationDialog";
import { Location, defaultLocations, getLocationByClientTimezone } from "@/lib/locations";
import { TimeData, convertTimeToAllLocations } from "@/lib/time";
import { timezoneToUrlFormat } from "@/lib/utils";
import { Clock, CalendarClock, Globe, Flag, BookOpen, MapPin, Layers, ArrowRight, Zap, Clock3, BarChart3, Cpu } from "lucide-react";
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useTheme } from "@/lib/ThemeContext";

export default function Home() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());
  const [useRealTime, setUseRealTime] = useState<boolean>(true); // 控制是否使用实时更新
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [timeData, setTimeData] = useState<Map<string, TimeData>>(new Map<string, TimeData>());
  
  // App title and description
  const appTitle = "World Clock & Time Zone Converter | Plan International Meetings";
  const appDescription = "Compare time across multiple global cities with our intuitive world clock and time zone converter. Find local times, schedule international meetings, and calculate time differences worldwide.";
  const appKeywords = "world clock, time zones, time zone converter, international meeting planner, global time, international time, time difference calculator, world time, multi timezone, schedule meetings across time zones";
  
  // Initialize with default locations
  useEffect(() => {
    // Start with a few default locations
    const initialLocations = defaultLocations.slice(0, 5);
    
    // Get user's location based on their timezone
    const userLocation = getLocationByClientTimezone();
    
    // If we found a location based on user's timezone that's not in the initial set,
    // add it to the list (replacing the last item to keep 5 total)
    if (userLocation && !initialLocations.some(loc => loc.id === userLocation.id)) {
      const locationsWithUserLocation = [...initialLocations.slice(0, 4), userLocation];
      setLocations(locationsWithUserLocation);
      
      // Set user's location as the selected one
      setSelectedLocationId(userLocation.id);
    } else {
      setLocations(initialLocations);
      
      // If user location is in the set, select it, otherwise use default (New York)
      if (userLocation && initialLocations.some(loc => loc.id === userLocation.id)) {
        setSelectedLocationId(userLocation.id);
      } else {
        setSelectedLocationId(initialLocations[1].id); // Default to New York
      }
    }
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
        document.title = `WorldClockNow | Global Time Zone Converter`;
      }
    }
  }, [selectedLocationId, timeData, locations]);
  
  // Toggle dark mode
  const handleToggleTheme = () => {
    toggleDarkMode();
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
      <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* SEO Meta Tags */}
        <Helmet>
          <title>{appTitle}</title>
          <meta name="description" content={appDescription} />
          <meta name="keywords" content={appKeywords} />
          
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
              <div className="inline-flex items-center justify-center mb-3 bg-primary/10 rounded-full px-4 py-1">
                <Cpu className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-primary">High-Precision Time Zone Calculator</span>
              </div>
              <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-primary via-violet-600 to-primary/60 text-transparent bg-clip-text tracking-tight">
                Global Time Zone Converter
              </h1>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-1">
                    <Zap className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Real-time Sync</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-1">
                    <Layers className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Multi-zone Compare</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-1">
                    <BarChart3 className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Meeting Planner</span>
                </div>
              </div>
              <div className="flex justify-center mb-2">
                <div className="h-1 w-16 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full"></div>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-sm">
                Efficient cross-time zone collaboration tool - Perfect for international meeting scheduling, remote team coordination, and global business planning
              </p>
            </header>
          </section>
          
          {/* Two-column layout for main content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column - Current time and settings */}
            <div className="lg:col-span-4 space-y-6">
              {/* Current Time Display - 科技感设计 */}
              <article className="bg-white/80 dark:bg-gray-900/90 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm border border-gray-100 dark:border-gray-800">
                <div className="border-b border-gray-200/70 dark:border-gray-800/70 p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-primary/10 rounded-md p-1 mr-2">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/90">Current Time</h2>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-mono text-gray-600 dark:text-gray-300 flex items-center">
                    <Clock3 className="h-3 w-3 mr-1 text-primary" />
                    <span>{useRealTime ? "Live" : "Manual"}</span>
                  </div>
                </div>
                
                <div className="p-5 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 z-0"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-12 -mb-12 z-0"></div>
                  
                  <div className="relative z-10 mb-5">
                    <div className="flex justify-center items-center mb-1">
                      <time 
                        dateTime={selectedDateTime.toISOString()} 
                        className="text-5xl font-bold text-center font-mono bg-gradient-to-r from-primary via-violet-600 to-primary/70 text-transparent bg-clip-text"
                      >
                        {selectedDateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </time>
                      <div className="ml-2 flex flex-col">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{selectedDateTime.toLocaleTimeString([], {second: '2-digit'})}</span>
                        <span className="text-xs font-medium text-primary/70">sec</span>
                      </div>
                    </div>
                    <time 
                      dateTime={selectedDateTime.toISOString()} 
                      className="text-center text-sm mt-1 text-gray-500 dark:text-gray-400 block font-medium"
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
                    <div className="bg-gradient-to-r from-primary/30 to-violet-500/30 text-primary px-4 py-2 rounded-lg text-sm font-medium border border-primary/20 shadow-sm flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-primary" />
                      {Intl.DateTimeFormat().resolvedOptions().timeZone.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </article>
              
              {/* Time Navigation Tools - 科技感设计 */}
              <section className="bg-white/80 dark:bg-gray-900/90 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm border border-gray-100 dark:border-gray-800">
                <div className="border-b border-gray-200/70 dark:border-gray-800/70 p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-primary/10 rounded-md p-1 mr-2">
                      <CalendarClock className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/90">Adjust Time</h2>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${useRealTime ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{useRealTime ? "Auto Sync" : "Manual Mode"}</span>
                  </div>
                </div>
                <div className="p-4 relative">
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mb-10 z-0"></div>
                  <div className="relative z-10">
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
              
              {/* 精简版工具导航 */}
              <section className="bg-white/80 dark:bg-gray-900/90 rounded-xl shadow-lg backdrop-blur-sm border border-gray-100 dark:border-gray-800">
                <div className="p-4">
                  {selectedLocation && selectedLocationTime && (
                    <div className="mb-6 bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-lg border border-primary/10">
                      <div className="flex items-center mb-2">
                        <div className="bg-primary/20 p-1.5 rounded-md">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="ml-2 text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                          {selectedLocation.name}, {selectedLocation.country}
                        </h3>
                        <div className="ml-auto bg-primary/5 px-2 py-1 rounded text-xs font-mono text-primary">
                          {selectedLocation.timezone}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                        Local time: <span className="font-semibold text-gray-800 dark:text-gray-100">{selectedLocationTime.time}</span> · {selectedLocationTime.date}
                      </div>
                      <Link href={`/city/${selectedLocation.country.toLowerCase().replace(/\s/g, '-')}/${selectedLocation.name.toLowerCase().replace(/\s/g, '-')}`} 
                            className="mt-3 inline-flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                        More details <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  )}
                  
                  {/* 快捷功能卡片 */}
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/meeting-planner" className="group">
                      <div className="flex flex-col h-full p-4 rounded-lg bg-gradient-to-br from-primary/5 to-violet-500/5 border border-primary/10 hover:border-primary/30 transition-all hover:shadow-md">
                        <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                          <CalendarClock className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">Meeting Planner</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Schedule cross-timezone meetings with calendar invites</p>
                      </div>
                    </Link>
                    
                    <Link href="/time-comparison" className="group">
                      <div className="flex flex-col h-full p-4 rounded-lg bg-gradient-to-br from-primary/5 to-violet-500/5 border border-primary/10 hover:border-primary/30 transition-all hover:shadow-md">
                        <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                          <BarChart3 className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">Time Comparison</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Visual comparison of time differences across regions</p>
                      </div>
                    </Link>
                    
                    <Link href="/countries" className="group">
                      <div className="flex flex-col h-full p-4 rounded-lg bg-gradient-to-br from-primary/5 to-violet-500/5 border border-primary/10 hover:border-primary/30 transition-all hover:shadow-md">
                        <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                          <Flag className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">Countries</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Browse cities and time zones by country</p>
                      </div>
                    </Link>
                    
                    <Link href="/timezones" className="group">
                      <div className="flex flex-col h-full p-4 rounded-lg bg-gradient-to-br from-primary/5 to-violet-500/5 border border-primary/10 hover:border-primary/30 transition-all hover:shadow-md">
                        <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">Time Zones</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Explore all global time zones and UTC offsets</p>
                      </div>
                    </Link>
                  </div>
                  
                  {/* 底部信息 */}
                  <div className="mt-6 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-1 rounded">
                        <Clock3 className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">Real-time global time zone converter</span>
                    </div>
                    
                    <Link href="/about" className="text-xs text-primary hover:text-primary/80 transition-colors">
                      About
                    </Link>
                  </div>
                </div>
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