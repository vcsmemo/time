import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Location, defaultLocations } from "@/lib/locations";
import { TimeData, convertTimeToAllLocations } from "@/lib/time";
import { Globe, ArrowLeft, Flag, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

// Convert city name to URL format
function cityToUrlFormat(city: string): string {
  return city.toLowerCase().replace(/\s/g, '-');
}

export default function CountryPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());
  const [locations, setLocations] = useState<Location[]>([]);
  const [timeData, setTimeData] = useState<Map<string, TimeData>>(new Map<string, TimeData>());
  
  // Extract country parameter from the URL
  const [, params] = useRoute('/country/:country');
  const countryParam = params?.country?.replace(/-/g, ' ');
  
  // Find all locations in this country
  const countryLocations = defaultLocations.filter(
    loc => loc.country.toLowerCase() === countryParam?.toLowerCase()
  );
  
  // Get unique time zones for this country
  const countryTimeZones = Array.from(new Set(countryLocations.map(loc => loc.timezone)));
  
  // App title and description
  const pageTitle = countryLocations.length > 0 
    ? `Time in ${countryLocations[0].country} - Cities and Time Zones - World Clock`
    : `Country Not Found - World Clock`;
    
  const pageDescription = countryLocations.length > 0
    ? `Current local time in all major cities in ${countryLocations[0].country}. ${countryLocations[0].country} uses ${countryTimeZones.length} time zone${countryTimeZones.length !== 1 ? 's' : ''}.`
    : `Country information not found. Browse all countries and their time zones.`;
  
  // Set locations for this country
  useEffect(() => {
    if (countryLocations.length > 0) {
      setLocations(countryLocations);
    }
  }, [countryParam]);
  
  // Update times based on selected date/time
  useEffect(() => {
    if (locations.length === 0) return;
    
    // Use real-time
    const timer = setInterval(() => {
      const now = new Date();
      setSelectedDateTime(now);
      
      // Convert the selected time to all location times
      const allTimeData = convertTimeToAllLocations(now, locations);
      setTimeData(allTimeData);
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, [locations]);
  
  // Toggle dark mode
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // If country not found, show a message
  if (countryLocations.length === 0) {
    return (
      <div className={`flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 ${isDarkMode ? 'dark' : ''}`}>
        <Helmet>
          <title>Country Not Found - World Clock</title>
          <meta name="description" content="The requested country could not be found in our database." />
        </Helmet>
        
        <Header 
          onToggleTheme={handleToggleTheme} 
          isDarkMode={isDarkMode}
          onToggleSettings={() => {}}
        />
        
        <main className="flex-grow container mx-auto px-4 py-6">
          <Link href="/countries">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Countries
            </Button>
          </Link>
          
          <div className="flex flex-col items-center justify-center h-64">
            <h1 className="text-2xl font-bold mb-2">Country Not Found</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Sorry, we couldn't find {countryParam} in our database.
            </p>
            <Link href="/countries">
              <Button>Browse All Countries</Button>
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  // Group cities by time zone for this country
  const citiesByTimeZone: Record<string, Location[]> = {};
  
  countryTimeZones.forEach(timezone => {
    citiesByTimeZone[timezone] = countryLocations.filter(loc => loc.timezone === timezone);
  });
  
  const countryName = countryLocations[0].country;
  
  return (
    <div className={`flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 ${isDarkMode ? 'dark' : ''}`}>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${countryName}, time in ${countryName}, ${countryName} time zones, local time, current time, cities in ${countryName}`} />
        
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
                  "name": "Countries",
                  "item": `${window.location.origin}/countries`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": countryName,
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
          <Link href="/countries">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Countries
            </Button>
          </Link>
          
          <header className="mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
              <Flag className="h-4 w-4 mr-1.5" />
              Country Time Information
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
              Time in {countryName}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Current local time in all major cities in {countryName}. 
              {countryName} uses {countryTimeZones.length} time zone{countryTimeZones.length !== 1 ? 's' : ''}.
            </p>
          </header>
        </section>
        
        {/* Time Zones in this Country */}
        <div className="space-y-8 mb-8">
          {countryTimeZones.map(timezone => (
            <section key={timezone} className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-neutral-200 dark:border-neutral-700 p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{timezone.replace('_', ' ')} Time Zone</h2>
                <Link href={`/timezone/${timezone.replace(/\//g, '-').toLowerCase()}`}>
                  <Button variant="outline" size="sm">View Time Zone</Button>
                </Link>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {citiesByTimeZone[timezone].map(city => {
                    const cityTime = timeData.get(city.id);
                    const cityUrlPath = `/city/${countryName.toLowerCase().replace(/\s/g, '-')}/${cityToUrlFormat(city.name)}`;
                    
                    return (
                      <Link key={city.id} href={cityUrlPath}>
                        <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:border-primary/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                          <div className="flex items-center mb-2">
                            <MapPin className="h-4 w-4 text-primary mr-2" />
                            <h3 className="font-medium">{city.name}</h3>
                          </div>
                          
                          {cityTime && (
                            <div>
                              <p className="text-2xl font-bold text-primary">{cityTime.time}</p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-300">{cityTime.date}</p>
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          ))}
        </div>
        
        {/* SEO-friendly content */}
        <section className="bg-white dark:bg-card rounded-lg shadow-sm p-6 prose prose-sm dark:prose-invert max-w-none">
          <h2 className="flex items-center text-lg font-medium mb-3">
            <Globe className="h-5 w-5 text-primary mr-2" />
            About {countryName} Time Zones
          </h2>
          
          <p>
            {countryName} uses {countryTimeZones.length} time zone{countryTimeZones.length !== 1 ? 's' : ''}: 
            {countryTimeZones.map(tz => ` ${tz.replace('_', ' ')}`).join(', ')}.
            {countryTimeZones.length > 1 
              ? ` This means that times can vary across different regions of ${countryName}.` 
              : ` The entire country observes the same time.`}
          </p>
          
          <h3 className="text-base font-medium mt-4">Major Cities in {countryName}</h3>
          <p>
            Major cities in {countryName} include: {countryLocations.slice(0, 8).map(city => city.name).join(', ')}
            {countryLocations.length > 8 ? `, and others.` : '.'}
          </p>
          
          {countryTimeZones.length > 1 && (
            <>
              <h3 className="text-base font-medium mt-4">Time Differences Within {countryName}</h3>
              <p>
                Since {countryName} spans multiple time zones, the time difference between the easternmost 
                and westernmost parts of the country can be up to {countryTimeZones.length - 1} hours.
                This can be important to consider when scheduling domestic calls or travel within {countryName}.
              </p>
            </>
          )}
          
          <p className="text-sm text-neutral-500 dark:text-neutral-300 mt-4">
            Use this directory to find current times in {countryName} cities and to plan travel, 
            business meetings, or calls across different regions of the country.
          </p>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}