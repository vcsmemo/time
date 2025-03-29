import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Location, defaultLocations, getCountries } from "@/lib/locations";
import { Globe, ArrowLeft, Flag, Search } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Get unique countries with their locations
function getCountriesWithLocations() {
  const countries = getCountries();
  
  return countries.map(country => {
    const locations = defaultLocations.filter(loc => loc.country === country);
    
    // Get unique time zones used in this country
    const timeZones = Array.from(new Set(locations.map(loc => loc.timezone)));
    
    return {
      name: country,
      locations,
      timeZones
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
}

// Convert country name to URL format
function countryToUrlFormat(country: string): string {
  return country.toLowerCase().replace(/\s/g, '-');
}

export default function CountriesPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState<{name: string, locations: Location[], timeZones: string[]}[]>([]);
  
  // App title and description
  const pageTitle = "Countries and Time Zones - World Clock";
  const pageDescription = "Browse countries and their time zones. Find local times in cities around the world organized by country.";
  
  // Initialize countries list
  useEffect(() => {
    const countriesList = getCountriesWithLocations();
    setCountries(countriesList);
  }, []);
  
  // Toggle dark mode
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Filter countries based on search query
  const getFilteredCountries = () => {
    if (!searchQuery) return countries;
    
    const query = searchQuery.toLowerCase();
    
    return countries.filter(country => {
      // Match country name
      if (country.name.toLowerCase().includes(query)) return true;
      
      // Match cities in this country
      if (country.locations.some(loc => loc.name.toLowerCase().includes(query))) return true;
      
      // Match time zones in this country
      if (country.timeZones.some(tz => tz.toLowerCase().includes(query))) return true;
      
      return false;
    });
  };
  
  const filteredCountries = getFilteredCountries();
  
  return (
    <div className={`flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 ${isDarkMode ? 'dark' : ''}`}>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="countries, time zones, world clock, international time, local time, city time" />
        
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
              <Flag className="h-4 w-4 mr-1.5" />
              Country Directory
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
              Countries and Time Zones
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Browse countries and find their local times and time zones. Select a country to see all major cities and their current times.
            </p>
          </header>
        </section>
        
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex items-center max-w-md">
            <Input
              type="text"
              placeholder="Search countries, cities, or time zones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Search className="h-5 w-5 text-neutral-400 -ml-8" />
          </div>
        </div>
        
        {/* Countries Listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredCountries.map(country => {
            const urlFormat = countryToUrlFormat(country.name);
            
            return (
              <Link key={country.name} href={`/country/${urlFormat}`}>
                <div className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-transparent hover:border-primary/20">
                  <div className="border-b border-neutral-200 dark:border-neutral-700 p-4">
                    <h2 className="text-lg font-semibold">{country.name}</h2>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-3">
                      <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Time Zones:</div>
                      <div className="flex flex-wrap gap-1">
                        {country.timeZones.map(zone => (
                          <span key={zone} className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                            {zone.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Major Cities:</div>
                      <p className="text-sm text-neutral-500 line-clamp-2">
                        {country.locations.slice(0, 5).map(loc => loc.name).join(', ')}
                        {country.locations.length > 5 && `, +${country.locations.length - 5} more`}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        {filteredCountries.length === 0 && (
          <div className="bg-white dark:bg-card rounded-lg shadow-sm p-8 text-center mb-8">
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              No countries match your search. Try a different query or browse all countries.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </div>
        )}
        
        {/* SEO-friendly content */}
        <section className="bg-white dark:bg-card rounded-lg shadow-sm p-6 prose prose-sm dark:prose-invert max-w-none">
          <h2 className="flex items-center text-lg font-medium mb-3">
            <Globe className="h-5 w-5 text-primary mr-2" />
            Countries and Their Time Zones
          </h2>
          
          <p>
            Many countries use a single time zone throughout their territory, but larger countries often span multiple time zones. 
            For example, the United States uses multiple time zones (Eastern, Central, Mountain, Pacific, Alaska, and Hawaii), 
            while most European countries use just one time zone.
          </p>
          
          <h3 className="text-base font-medium mt-4">Countries with the Most Time Zones</h3>
          <ul>
            <li><strong>France</strong> - 12 time zones (including overseas territories)</li>
            <li><strong>United States</strong> - 11 time zones (including territories)</li>
            <li><strong>Russia</strong> - 11 time zones</li>
            <li><strong>United Kingdom</strong> - 9 time zones (including overseas territories)</li>
            <li><strong>Australia</strong> - 9 time zones (including territories)</li>
          </ul>
          
          <h3 className="text-base font-medium mt-4">Time Zone Curiosities</h3>
          <p>
            Some countries have unusual time zone practices, such as China, which uses a single time zone (UTC+8) despite 
            spanning what would naturally be 5 time zones. Nepal uses a time zone offset of UTC+5:45, one of the few 
            countries with a 45-minute offset from UTC.
          </p>
          
          <p className="text-sm text-neutral-500 mt-4">
            Use this directory to explore time zones by country and better understand 
            global time differences for travel planning, business communications, and more.
          </p>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}