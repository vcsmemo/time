import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TimeComparison from "@/components/TimeComparison";
import { Location, defaultLocations } from "@/lib/locations";
import { TimeData, convertTimeToAllLocations, formatTimezoneOffset } from "@/lib/time";
import { Globe, ArrowLeft, Clock, MapPin, CalendarClock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import TimeNavigation from "@/components/TimeNavigation";

export default function CityPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());
  const [useRealTime, setUseRealTime] = useState<boolean>(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [timeData, setTimeData] = useState<Map<string, TimeData>>(new Map<string, TimeData>());
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  
  // Extract the city and country parameters from the URL
  const [, params] = useRoute('/city/:country/:city');
  const country = params?.country?.replace(/-/g, ' ');
  const city = params?.city?.replace(/-/g, ' ');
  
  // Find the location in our database
  const cityLocation = defaultLocations.find(
    loc => loc.name.toLowerCase() === city?.toLowerCase() && 
           loc.country.toLowerCase() === country?.toLowerCase()
  );
  
  // App title and description
  const pageTitle = cityLocation 
    ? `Current Time in ${cityLocation.name}, ${cityLocation.country} - World Clock`
    : `Time in ${city}, ${country} - World Clock`;
    
  const pageDescription = cityLocation 
    ? `Current local time in ${cityLocation.name}, ${cityLocation.country}. Time zone: ${cityLocation.timezone}. Compare ${cityLocation.name} time with other cities worldwide.`
    : `Find the current local time in ${city}, ${country}. Compare with other major cities around the world.`;
  
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
  
  // Initialize with this city and some comparison cities
  useEffect(() => {
    if (!cityLocation) return;
    
    // Use this city + add some major cities for comparison
    const majorCities = defaultLocations.filter(loc => 
      ["America/New_York", "Europe/London", "Asia/Tokyo", "Australia/Sydney"].includes(loc.timezone) &&
      loc.id !== cityLocation.id
    );
    
    // Start with the selected city, then add major cities
    const combinedLocations = [cityLocation, ...majorCities].slice(0, 6);
    
    setLocations(combinedLocations);
    setSelectedLocationId(cityLocation.id);
  }, [cityLocation]);
  
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
  
  // Handle date/time change
  const handleDateTimeChange = (date: Date) => {
    if (useRealTime) {
      setUseRealTime(false);
    }
    setSelectedDateTime(date);
  };
  
  // Handle location selection
  const handleLocationSelect = (locationId: string) => {
    setSelectedLocationId(locationId);
  };
  
  // If city not found, show a message
  if (!cityLocation) {
    return (
      <div className={`flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 ${isDarkMode ? 'dark' : ''}`}>
        <Helmet>
          <title>City Not Found - World Clock</title>
          <meta name="description" content="The requested city could not be found in our database." />
        </Helmet>
        
        <Header 
          onToggleTheme={handleToggleTheme} 
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
          
          <div className="flex flex-col items-center justify-center h-64">
            <h1 className="text-2xl font-bold mb-2">City Not Found</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Sorry, we couldn't find {city}, {country} in our database.
            </p>
            <Link href="/">
              <Button>Return to World Clock</Button>
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  // Get current time data for this city
  const cityTimeData = timeData.get(cityLocation.id);
  const timezoneOffset = formatTimezoneOffset(cityLocation.timezone);
  
  return (
    <div className={`flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 ${isDarkMode ? 'dark' : ''}`}>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`time in ${cityLocation.name}, ${cityLocation.country} time, ${cityLocation.timezone}, local time, current time`} />
        
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
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": pageTitle,
            "description": pageDescription,
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": window.location.origin
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": cityLocation.country,
                  "item": `${window.location.origin}/country/${cityLocation.country.toLowerCase().replace(/ /g, '-')}`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": cityLocation.name,
                  "item": window.location.href
                }
              ]
            }
          })}
        </script>
      </Helmet>
      
      <Header 
        onToggleTheme={handleToggleTheme} 
        isDarkMode={isDarkMode}
        onToggleSettings={() => {}}
      />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <section className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to World Clock
            </Button>
          </Link>
          
          <header className="mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
              <Clock className="h-4 w-4 mr-1.5" />
              City Time Information
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
              Time in {cityLocation.name}, {cityLocation.country}
            </h1>
            <p className="text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              {cityLocation.timezone} ({timezoneOffset})
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Current local time in {cityLocation.name}. Use the time converter below to compare with other cities.
            </p>
          </header>
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left column - Current time and settings */}
          <div className="lg:col-span-4 space-y-6">
            {/* Current Time Display */}
            <article className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-neutral-200 dark:border-neutral-700 p-4 flex items-center">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-lg font-medium">{cityLocation.name} Time Now</h2>
              </div>
              
              <div className="p-4">
                {cityTimeData && (
                  <div className="mb-4">
                    <time 
                      dateTime={cityTimeData.rawDate.toISOString()} 
                      className="text-4xl font-bold text-center block bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text"
                    >
                      {cityTimeData.time}
                    </time>
                    <time 
                      dateTime={cityTimeData.rawDate.toISOString()} 
                      className="text-center text-sm mt-1 text-neutral-500 block"
                    >
                      {cityTimeData.date}
                    </time>
                  </div>
                )}
                
                <div className="flex justify-center">
                  <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                    {cityLocation.timezone.replace('_', ' ')}
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
                    if (value) {
                      setSelectedDateTime(new Date());
                    }
                  }}
                />
              </div>
            </section>
          </div>
          
          {/* Right column - Time comparison */}
          <div className="lg:col-span-8 space-y-6">
            {/* Time Comparison Section */}
            <section aria-labelledby="time-comparison-heading">
              <h2 id="time-comparison-heading" className="text-xl font-semibold mb-4">
                Compare {cityLocation.name} with Major Cities
              </h2>
              <TimeComparison 
                locations={locations}
                timeData={timeData}
                selectedLocationId={selectedLocationId}
              />
            </section>
          </div>
        </div>
        
        {/* SEO-friendly content */}
        <section className="bg-white dark:bg-card rounded-lg shadow-sm p-6 prose prose-sm dark:prose-invert max-w-none">
          <h2 className="flex items-center text-lg font-medium mb-3">
            <Globe className="h-5 w-5 text-primary mr-2" />
            About {cityLocation.name}, {cityLocation.country}
          </h2>
          
          <p>
            {cityLocation.name} is located in {cityLocation.country} and uses the {cityLocation.timezone} time zone, 
            which is {timezoneOffset} from Coordinated Universal Time (UTC).
          </p>
          
          <h3 className="text-base font-medium mt-4">Time Zone Information</h3>
          <ul>
            <li><strong>Time Zone:</strong> {cityLocation.timezone}</li>
            <li><strong>UTC Offset:</strong> {timezoneOffset}</li>
            <li><strong>Country:</strong> {cityLocation.country}</li>
            <li><strong>Coordinates:</strong> Approximately {cityLocation.coordinates.y}° latitude, {cityLocation.coordinates.x}° longitude</li>
          </ul>
          
          <h3 className="text-base font-medium mt-4">When to Call {cityLocation.name}</h3>
          <p>
            When planning calls or meetings with people in {cityLocation.name}, use the time comparison 
            tool above to find suitable times that work across different time zones. Remember to consider 
            local business hours, typically 9:00 AM to 5:00 PM local time.
          </p>
          
          <p className="text-sm text-neutral-500 mt-4">
            Use this tool to convert times between {cityLocation.name} and other locations to plan 
            international calls, meetings, and travel with accurate local time information.
          </p>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}