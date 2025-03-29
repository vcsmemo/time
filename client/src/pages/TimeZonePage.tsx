import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TimeComparison from "@/components/TimeComparison";
import { Location, defaultLocations, allTimezones } from "@/lib/locations";
import { TimeData, convertTimeToAllLocations, formatTimezoneOffset } from "@/lib/time";
import { Globe, ArrowLeft, Clock, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function TimeZonePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());
  const [locations, setLocations] = useState<Location[]>([]);
  const [timeData, setTimeData] = useState<Map<string, TimeData>>(new Map<string, TimeData>());
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  
  // Extract the timezone parameter from the URL
  const [, params] = useRoute('/timezone/:timezone');
  const timezone = params?.timezone;
  
  // Decode the timezone from URL format to actual timezone (e.g., "UTC+8" from "utc-plus-8")
  const getTimezoneFromParam = (param: string): string => {
    // Convert from URL format to display format
    if (param.startsWith('utc-plus-')) {
      const offset = param.replace('utc-plus-', '');
      return `UTC+${offset}`;
    } else if (param.startsWith('utc-minus-')) {
      const offset = param.replace('utc-minus-', '');
      return `UTC-${offset}`;
    }
    // Handle special cases or return as is for named timezones
    return param.replace(/-/g, '/').replace(/_/g, ' ');
  };
  
  const decodedTimezone = timezone ? getTimezoneFromParam(timezone) : '';
  
  // App title and description
  const timezoneOffset = decodedTimezone ? formatTimezoneOffset(decodedTimezone) : '';
  const pageTitle = `${decodedTimezone} Time Zone (${timezoneOffset}) - World Clock`;
  const pageDescription = `Current time in ${decodedTimezone} time zone. Compare ${decodedTimezone} with other time zones around the world. Plan meetings and calls across time zones.`;
  
  // Initialize with locations in this timezone
  useEffect(() => {
    if (!decodedTimezone) return;
    
    // Find locations in this timezone
    const locationsInTimezone = defaultLocations.filter(
      loc => loc.timezone === decodedTimezone
    );
    
    if (locationsInTimezone.length > 0) {
      // Use locations from this timezone + add some major cities for comparison
      const majorCities = defaultLocations.filter(loc => 
        ["America/New_York", "Europe/London", "Asia/Tokyo", "Australia/Sydney"].includes(loc.timezone)
      );
      
      // Combine and remove duplicates
      const combinedLocations = [...locationsInTimezone, ...majorCities]
        .filter((loc, index, self) => 
          index === self.findIndex((l) => l.id === loc.id)
        );
      
      setLocations(combinedLocations.slice(0, 6)); // Limit to 6 locations
      setSelectedLocationId(locationsInTimezone[0].id);
    } else {
      // If no locations found for this timezone, use default major cities
      setLocations(defaultLocations.slice(0, 5));
      setSelectedLocationId(defaultLocations[0].id);
    }
  }, [decodedTimezone]);
  
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
  
  // Handle location selection
  const handleLocationSelect = (locationId: string) => {
    setSelectedLocationId(locationId);
  };
  
  // List of countries that use this timezone
  const countriesInTimezone = Array.from(new Set(
    defaultLocations
      .filter(loc => loc.timezone === decodedTimezone)
      .map(loc => loc.country)
  ));
  
  // Main cities in this timezone
  const citiesInTimezone = defaultLocations
    .filter(loc => loc.timezone === decodedTimezone)
    .slice(0, 6);
  
  return (
    <div className={`flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 ${isDarkMode ? 'dark' : ''}`}>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${decodedTimezone}, time zone, world clock, time converter, ${countriesInTimezone.join(', ')}`} />
        
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
                  "name": "Time Zones",
                  "item": `${window.location.origin}/timezones`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": decodedTimezone,
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
              Time Zone Information
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
              {decodedTimezone} Time Zone
            </h1>
            <p className="text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              {timezoneOffset} from UTC
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Current local time in the {decodedTimezone} time zone. 
              {countriesInTimezone.length > 0 && ` Used in ${countriesInTimezone.join(', ')}.`}
            </p>
          </header>
        </section>
        
        {/* Current Time Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {citiesInTimezone.map(city => {
            const cityTime = timeData.get(city.id);
            return (
              <article key={city.id} className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-neutral-200 dark:border-neutral-700 p-4 flex items-center">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  <h2 className="text-lg font-medium">{city.name}, {city.country}</h2>
                </div>
                
                <div className="p-4">
                  {cityTime && (
                    <>
                      <time 
                        dateTime={cityTime.rawDate.toISOString()} 
                        className="text-3xl font-bold text-center block bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text"
                      >
                        {cityTime.time}
                      </time>
                      <time 
                        dateTime={cityTime.rawDate.toISOString()} 
                        className="text-center text-sm mt-1 text-neutral-500 block"
                      >
                        {cityTime.date}
                      </time>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        
        {/* Time Comparison Section */}
        <section aria-labelledby="time-comparison-heading" className="mb-8">
          <h2 id="time-comparison-heading" className="text-xl font-semibold mb-4">
            Time Comparison with Major Cities
          </h2>
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
            About {decodedTimezone} Time Zone
          </h2>
          
          <p>
            The {decodedTimezone} time zone is {timezoneOffset} from Coordinated Universal Time (UTC).
            {countriesInTimezone.length > 0 && ` This time zone is used in ${countriesInTimezone.join(', ')}.`}
          </p>
          
          <h3 className="text-base font-medium mt-4">Cities in {decodedTimezone}</h3>
          <p>
            Major cities in the {decodedTimezone} time zone include:
            {citiesInTimezone.map(city => city.name).join(', ')}{citiesInTimezone.length === 0 && ' No major cities found in our database for this timezone.'}
          </p>
          
          <h3 className="text-base font-medium mt-4">Time Zone Facts</h3>
          <ul>
            <li>Standard time offset from UTC: {timezoneOffset}</li>
            <li>{countriesInTimezone.length} {countriesInTimezone.length === 1 ? 'country uses' : 'countries use'} this time zone</li>
            <li>Approximate longitude: {decodedTimezone.includes('UTC+') ? `${Number(decodedTimezone.replace('UTC+', '')) * 15}°E` : decodedTimezone.includes('UTC-') ? `${Number(decodedTimezone.replace('UTC-', '')) * 15}°W` : 'Varies'}</li>
          </ul>
          
          <p className="text-sm text-neutral-500 mt-4">
            Use this tool to convert times between {decodedTimezone} and other time zones and plan 
            international calls, meetings, and travel with accurate local time information.
          </p>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}