import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TimeComparison from "@/components/TimeComparison";
import { defaultLocations, Location } from "@/lib/locations";
import { TimeData, convertTimeToAllLocations } from "@/lib/time"; 
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useTheme } from "@/lib/ThemeContext";

export default function TimeComparisonPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());
  const [useRealTime, setUseRealTime] = useState<boolean>(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [timeData, setTimeData] = useState<Map<string, TimeData>>(new Map<string, TimeData>());
  
  // SEO metadata
  const pageTitle = "Time Zone Comparison Tool - World Clock";
  const pageDescription = "Compare time differences across multiple locations worldwide. Useful for international business, travel planning, and global coordination.";
  
  // Real-time updates
  useEffect(() => {
    if (!useRealTime) return;
    
    const timer = setInterval(() => {
      setSelectedDateTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, [useRealTime]);
  
  // Initialize with major cities
  useEffect(() => {
    // Select a good mix of major cities from different regions
    const majorCities = defaultLocations.filter(loc => 
      ["America/New_York", "Europe/London", "Asia/Tokyo", "Asia/Dubai", 
       "Australia/Sydney", "Europe/Paris", "America/Los_Angeles", "Asia/Singapore"]
        .includes(loc.timezone)
    );
    
    // Use New York as the default reference point
    const nyIndex = majorCities.findIndex(loc => loc.timezone === "America/New_York");
    if (nyIndex > 0) {
      // Move New York to the beginning of the array
      const nyCity = majorCities[nyIndex];
      majorCities.splice(nyIndex, 1);
      majorCities.unshift(nyCity);
    }
    
    // Limit to 8 cities to keep the UI clean
    setLocations(majorCities.slice(0, 8));
  }, []);
  
  // Update times based on selected date/time
  useEffect(() => {
    if (locations.length === 0) return;
    
    // Convert the selected time to all location times
    const allTimeData = convertTimeToAllLocations(selectedDateTime, locations);
    setTimeData(allTimeData);
  }, [selectedDateTime, locations]);
  
  // When a location is reordered
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(locations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setLocations(items);
  };
  
  return (
    <div className={`flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 ${isDarkMode ? 'dark' : ''}`}>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="time zones, time comparison, world clock, global time, international time" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:site_name" content="World Time Zones" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      
      <Header 
        onToggleTheme={toggleDarkMode} 
        isDarkMode={isDarkMode}
        onToggleSettings={() => {}}
      />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to World Clock
          </Button>
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
            World Time Comparison
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Compare time zones across major cities worldwide. Select a location to see relative time differences. 
            Drag and drop to reorder locations based on your preference.
          </p>
        </header>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <section aria-labelledby="time-comparison-heading" className="mb-8">
            <TimeComparison 
              locations={locations} 
              timeData={timeData} 
              selectedLocationId={locations.length > 0 ? locations[0].id : null}
            />
          </section>
        </DragDropContext>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">About Time Zones</h2>
          <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6">
            <p className="mb-4">
              Time zones are regions of the globe that observe a uniform standard time for legal, commercial, and social purposes. 
              Time zones tend to follow the boundaries of countries and their subdivisions because it is convenient for areas in close 
              commercial or other communication to keep the same time.
            </p>
            <p className="mb-4">
              Most of the time zones on land are offset from Coordinated Universal Time (UTC) by a whole number of hours (UTC−12:00 to UTC+14:00). 
              A few are offset by 30 or 45 minutes.
            </p>
            <p>
              The table above shows the current time in different major cities around the world, along with their time differences relative 
              to the selected location. This information is particularly useful for international business, travel planning, and coordinating 
              across global teams.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}