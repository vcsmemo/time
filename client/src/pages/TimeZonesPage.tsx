import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Location, defaultLocations, allTimezones } from "@/lib/locations";
import { formatTimezoneOffset } from "@/lib/time";
import { Globe, ArrowLeft, Clock, Search } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Group timezones by region
function groupTimezones() {
  // Sort timezones by offset
  const sortedTimezones = [...allTimezones].sort((a, b) => {
    const offsetA = a.startsWith('UTC') ? 
      (a.includes('+') ? parseFloat(a.replace('UTC+', '')) : parseFloat(a.replace('UTC-', '')) * -1) : 0;
    const offsetB = b.startsWith('UTC') ? 
      (b.includes('+') ? parseFloat(b.replace('UTC+', '')) : parseFloat(b.replace('UTC-', '')) * -1) : 0;
    return offsetA - offsetB;
  });
  
  // Group by region
  const groups: Record<string, string[]> = {
    'UTC (Coordinated Universal Time)': [],
    'Europe & Africa': [],
    'Asia & Pacific': [],
    'Americas': [],
    'Other': []
  };
  
  sortedTimezones.forEach(tz => {
    if (tz.startsWith('UTC')) {
      groups['UTC (Coordinated Universal Time)'].push(tz);
    } else if (tz.startsWith('Europe/') || tz.startsWith('Africa/')) {
      groups['Europe & Africa'].push(tz);
    } else if (tz.startsWith('Asia/') || tz.startsWith('Pacific/') || tz.startsWith('Australia/')) {
      groups['Asia & Pacific'].push(tz);
    } else if (tz.startsWith('America/')) {
      groups['Americas'].push(tz);
    } else {
      groups['Other'].push(tz);
    }
  });
  
  return groups;
}

// Convert timezone string to URL format
function timezoneToUrlFormat(timezone: string): string {
  if (timezone.startsWith('UTC+')) {
    return `utc-plus-${timezone.replace('UTC+', '')}`;
  } else if (timezone.startsWith('UTC-')) {
    return `utc-minus-${timezone.replace('UTC-', '')}`;
  } else {
    return timezone.replace(/\//g, '-').replace(/\s/g, '_').toLowerCase();
  }
}

// Get cities in a timezone
function getCitiesInTimezone(timezone: string): Location[] {
  return defaultLocations.filter(loc => loc.timezone === timezone);
}

export default function TimeZonesPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupedTimezones, setGroupedTimezones] = useState<Record<string, string[]>>({});
  
  // App title and description
  const pageTitle = "All World Time Zones - World Clock";
  const pageDescription = "Complete list of world time zones with current local times. Find time zones by region, offset from UTC, or country.";
  
  // Initialize timezone groups
  useEffect(() => {
    const groups = groupTimezones();
    setGroupedTimezones(groups);
  }, []);
  
  // Toggle dark mode
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Filter timezones based on search query
  const getFilteredTimezones = () => {
    if (!searchQuery) return groupedTimezones;
    
    const query = searchQuery.toLowerCase();
    const filtered: Record<string, string[]> = {};
    
    Object.entries(groupedTimezones).forEach(([group, timezones]) => {
      const matchingTimezones = timezones.filter(tz => {
        // Match timezone name
        if (tz.toLowerCase().includes(query)) return true;
        
        // Match offset
        const offset = formatTimezoneOffset(tz);
        if (offset.toLowerCase().includes(query)) return true;
        
        // Match cities in this timezone
        const cities = getCitiesInTimezone(tz);
        if (cities.some(city => 
          city.name.toLowerCase().includes(query) || 
          city.country.toLowerCase().includes(query)
        )) return true;
        
        return false;
      });
      
      if (matchingTimezones.length > 0) {
        filtered[group] = matchingTimezones;
      }
    });
    
    return filtered;
  };
  
  const filteredTimezones = getFilteredTimezones();
  
  return (
    <div className={`flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 ${isDarkMode ? 'dark' : ''}`}>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="time zones, world clock, UTC, GMT, time zone list, international time zones" />
        
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
              Time Zone Directory
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
              All World Time Zones
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Browse the complete list of time zones around the world. Click on any time zone to view detailed information.
            </p>
          </header>
        </section>
        
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex items-center max-w-md">
            <Input
              type="text"
              placeholder="Search time zones, regions, or countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Search className="h-5 w-5 text-neutral-400 -ml-8" />
          </div>
        </div>
        
        {/* Time Zones Listing */}
        <div className="space-y-8 mb-8">
          {Object.entries(filteredTimezones).map(([groupName, timezones]) => (
            <section key={groupName} className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-neutral-200 dark:border-neutral-700 p-4">
                <h2 className="text-xl font-semibold">{groupName} Time Zones</h2>
              </div>
              
              <div className="p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {timezones.map(timezone => {
                    const offset = formatTimezoneOffset(timezone);
                    const cities = getCitiesInTimezone(timezone);
                    const urlFormat = timezoneToUrlFormat(timezone);
                    
                    return (
                      <Link key={timezone} href={`/timezone/${urlFormat}`}>
                        <div className="border border-neutral-200 dark:border-neutral-700 rounded-md p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors">
                          <h3 className="font-medium text-primary mb-1">{timezone}</h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">{offset} from UTC</p>
                          
                          {cities.length > 0 && (
                            <p className="text-xs text-neutral-500 mt-2 truncate">
                              {cities.slice(0, 3).map(c => c.name).join(', ')}
                              {cities.length > 3 && `, +${cities.length - 3} more`}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          ))}
          
          {Object.keys(filteredTimezones).length === 0 && (
            <div className="bg-white dark:bg-card rounded-lg shadow-sm p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">No results found</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                No time zones match your search. Try a different query or browse all time zones.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
        
        {/* SEO-friendly content */}
        <section className="bg-white dark:bg-card rounded-lg shadow-sm p-6 prose prose-sm dark:prose-invert max-w-none">
          <h2 className="flex items-center text-lg font-medium mb-3">
            <Globe className="h-5 w-5 text-primary mr-2" />
            Understanding Time Zones
          </h2>
          
          <p>
            Time zones are regions of the globe that observe a uniform standard time for legal, commercial, 
            and social purposes. Time zones tend to follow the boundaries of countries and their subdivisions 
            because it is convenient for areas in close commercial or other communication to keep the same time.
          </p>
          
          <h3 className="text-base font-medium mt-4">Time Zone Facts</h3>
          <ul>
            <li>There are approximately 40 time zones in use worldwide today</li>
            <li>Time zones generally differ by an hourly offset from UTC (Coordinated Universal Time)</li>
            <li>Some time zones differ by 30 or 45 minutes from adjacent time zones</li>
            <li>The International Date Line (IDL) marks the change from one calendar day to the next</li>
            <li>Many countries observe Daylight Saving Time (DST), which adds temporary offsets during summer months</li>
          </ul>
          
          <h3 className="text-base font-medium mt-4">Regional Time Zone Distribution</h3>
          <p>
            Most countries in Europe and Africa use time zones between UTC+0 and UTC+3. 
            Asia and Australia use time zones between UTC+5 and UTC+12. 
            North and South America use time zones between UTC-4 and UTC-10. 
            Pacific islands span many time zones, sometimes with significant offsets.
          </p>
          
          <p className="text-sm text-neutral-500 mt-4">
            Use our directory to explore time zones around the world and better understand 
            global time differences for travel planning, business communications, and more.
          </p>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}