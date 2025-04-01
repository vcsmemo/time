import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TimeComparison from "@/components/TimeComparison";
import { Location, defaultLocations } from "@/lib/locations";
import { TimeData, convertTimeToAllLocations, getDetailedTimeDifference } from "@/lib/time";
import { Globe, ArrowLeft, Clock, CalendarClock, ArrowRightLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import TimeNavigation from "@/components/TimeNavigation";

export default function ComparisonPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());
  const [useRealTime, setUseRealTime] = useState<boolean>(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [timeData, setTimeData] = useState<Map<string, TimeData>>(new Map<string, TimeData>());
  
  // Extract city parameters from the URL
  const [matchesCompare, paramsCompare] = useRoute('/compare/:from/:to');
  const [matchesComparison] = useRoute('/comparison');
  
  // Use default locations if on the /comparison route
  let fromCityId = paramsCompare?.from;
  let toCityId = paramsCompare?.to;
  
  // If on the '/comparison' route, use default cities
  if (matchesComparison) {
    // Choose New York and London by default
    fromCityId = 'new-york-us';
    toCityId = 'london-uk';
  }
  
  // Find the locations in our database
  const fromLocation = defaultLocations.find(loc => loc.id === fromCityId);
  const toLocation = defaultLocations.find(loc => loc.id === toCityId);
  
  // App title and description
  const pageTitle = (fromLocation && toLocation) 
    ? `${fromLocation.name} to ${toLocation.name} Time Difference - World Clock`
    : `Time Zone Comparison - World Clock`;
    
  const pageDescription = (fromLocation && toLocation)
    ? `Compare time between ${fromLocation.name}, ${fromLocation.country} and ${toLocation.name}, ${toLocation.country}. Time difference, overlap hours, and scheduling tool.`
    : `Compare time across different cities and time zones. Plan meetings, calls, and travel with our time zone comparison tool.`;
  
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
  
  // Initialize with from and to cities + some major cities
  useEffect(() => {
    if (!fromLocation || !toLocation) return;
    
    // Use from and to cities + add some major cities for reference
    const majorCities = defaultLocations.filter(loc => 
      ["America/New_York", "Europe/London", "Asia/Tokyo", "Australia/Sydney"].includes(loc.timezone) &&
      loc.id !== fromLocation.id && loc.id !== toLocation.id
    );
    
    // Put from and to cities first, then add a few major cities
    const comparisonLocations = [fromLocation, toLocation, ...majorCities].slice(0, 6);
    
    setLocations(comparisonLocations);
  }, [fromLocation, toLocation]);
  
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
  
  // If locations not found, show a message
  if (!fromLocation || !toLocation) {
    return (
      <div className={`flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 ${isDarkMode ? 'dark' : ''}`}>
        <Helmet>
          <title>Comparison Not Found - World Clock</title>
          <meta name="description" content="One or both of the requested cities could not be found in our database." />
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
            <h1 className="text-2xl font-bold mb-2">Comparison Not Found</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Sorry, we couldn't find one or both of the cities you requested in our database.
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
  
  // Get current time data
  const fromTimeData = timeData.get(fromLocation.id);
  const toTimeData = timeData.get(toLocation.id);
  
  // Calculate time difference details
  const timeDifference = fromLocation && toLocation 
    ? getDetailedTimeDifference(fromLocation, toLocation, selectedDateTime)
    : null;
  
  // Calculate business hours overlap (assuming 9 AM to 5 PM in both locations)
  const calculateBusinessOverlap = () => {
    if (!fromLocation || !toLocation) return null;
    
    // Create a mapping of the full 24-hour day in "from" location to corresponding hours in "to" location
    const hourMapping: {fromHour: number, toHour: number, fromIsNextDay: boolean, toIsNextDay: boolean}[] = [];
    
    const hourDiff = timeDifference ? (
      timeDifference.hours.startsWith('+') 
        ? parseInt(timeDifference.hours.substring(1)) 
        : -parseInt(timeDifference.hours.substring(1))
    ) : 0;
    
    for (let fromHour = 0; fromHour < 24; fromHour++) {
      let toHour = (fromHour + hourDiff) % 24;
      if (toHour < 0) toHour += 24;
      
      const fromIsNextDay = false; // Always start from "today" in from location
      const toIsNextDay = timeDifference ? timeDifference.dayDifference > 0 : false;
      
      hourMapping.push({ fromHour, toHour, fromIsNextDay, toIsNextDay });
    }
    
    // Find business hours (9 AM to 5 PM) overlap
    const businessOverlap = hourMapping.filter(mapping => 
      mapping.fromHour >= 9 && mapping.fromHour < 17 && // Business hours in "from" location
      mapping.toHour >= 9 && mapping.toHour < 17 // Business hours in "to" location
    );
    
    if (businessOverlap.length === 0) {
      return { hasOverlap: false, overlapHours: [] };
    }
    
    return {
      hasOverlap: true,
      overlapHours: businessOverlap.map(h => ({
        fromTime: `${h.fromHour}:00`,
        toTime: `${h.toHour}:00`
      }))
    };
  };
  
  const businessOverlap = calculateBusinessOverlap();
  
  return (
    <div className={`flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 ${isDarkMode ? 'dark' : ''}`}>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`time difference, ${fromLocation.name}, ${toLocation.name}, time zones, travel planning, international calls`} />
        
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
                  "name": "Time Comparisons",
                  "item": `${window.location.origin}/compare`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": `${fromLocation.name} to ${toLocation.name}`,
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
              <ArrowRightLeft className="h-4 w-4 mr-1.5" />
              Time Zone Comparison
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
              {fromLocation.name} to {toLocation.name} Time Difference
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Compare time between {fromLocation.name}, {fromLocation.country} and {toLocation.name}, {toLocation.country}.
              {timeDifference && ` The time difference is ${timeDifference.hours}.`}
            </p>
          </header>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* From Location */}
          <article className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-neutral-200 dark:border-neutral-700 p-4 flex items-center">
              <Clock className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-lg font-medium">{fromLocation.name}, {fromLocation.country}</h2>
            </div>
            
            <div className="p-4">
              {fromTimeData && (
                <div className="mb-4">
                  <time 
                    dateTime={fromTimeData.rawDate.toISOString()} 
                    className="text-4xl font-bold text-center block bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text"
                  >
                    {fromTimeData.time}
                  </time>
                  <time 
                    dateTime={fromTimeData.rawDate.toISOString()} 
                    className="text-center text-sm mt-1 text-neutral-500 dark:text-neutral-300 block"
                  >
                    {fromTimeData.date}
                  </time>
                </div>
              )}
              
              <div className="flex justify-center">
                <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                  {fromLocation.timezone.replace('_', ' ')}
                </div>
              </div>
            </div>
          </article>
          
          {/* To Location */}
          <article className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-neutral-200 dark:border-neutral-700 p-4 flex items-center">
              <Clock className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-lg font-medium">{toLocation.name}, {toLocation.country}</h2>
            </div>
            
            <div className="p-4">
              {toTimeData && (
                <div className="mb-4">
                  <time 
                    dateTime={toTimeData.rawDate.toISOString()} 
                    className="text-4xl font-bold text-center block bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text"
                  >
                    {toTimeData.time}
                  </time>
                  <time 
                    dateTime={toTimeData.rawDate.toISOString()} 
                    className="text-center text-sm mt-1 text-neutral-500 dark:text-neutral-300 block"
                  >
                    {toTimeData.date}
                  </time>
                </div>
              )}
              
              <div className="flex justify-center">
                <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                  {toLocation.timezone.replace('_', ' ')}
                </div>
              </div>
            </div>
          </article>
        </div>
        
        {/* Time Difference Details */}
        <section className="bg-white dark:bg-card rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Time Difference Details</h2>
          
          {timeDifference && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-base font-medium mb-2">Hour Difference</h3>
                <p className="text-3xl font-bold text-primary">
                  {timeDifference.hours}
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  {timeDifference.hours.startsWith('+') 
                    ? `${toLocation.name} is ahead of ${fromLocation.name}` 
                    : timeDifference.hours.startsWith('-')
                      ? `${toLocation.name} is behind ${fromLocation.name}`
                      : `${toLocation.name} is in the same time zone as ${fromLocation.name}`}
                </p>
              </div>
              
              <div>
                <h3 className="text-base font-medium mb-2">Day Difference</h3>
                <p className="text-3xl font-bold text-primary">
                  {timeDifference.dayDifference === 0 
                    ? "Same day" 
                    : timeDifference.dayDifference === 1 
                      ? "Next day" 
                      : timeDifference.dayDifference === -1 
                        ? "Previous day"
                        : timeDifference.dayDifference > 0
                          ? `+${timeDifference.dayDifference} days`
                          : `${timeDifference.dayDifference} days`}
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  {timeDifference.isNextDay 
                    ? `When it's today in ${fromLocation.name}, it's tomorrow in ${toLocation.name}` 
                    : timeDifference.isPrevDay
                      ? `When it's today in ${fromLocation.name}, it's yesterday in ${toLocation.name}`
                      : `Both locations are currently on the same calendar day`}
                </p>
              </div>
            </div>
          )}
        </section>
        
        {/* Business Hours Overlap */}
        <section className="bg-white dark:bg-card rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Business Hours Overlap</h2>
          
          {businessOverlap && (
            <>
              <p className="mb-4">
                {businessOverlap.hasOverlap 
                  ? `Business hours (9 AM to 5 PM) in ${fromLocation.name} and ${toLocation.name} overlap for ${businessOverlap.overlapHours.length} hours.`
                  : `Business hours (9 AM to 5 PM) in ${fromLocation.name} and ${toLocation.name} do not overlap.`}
              </p>
              
              {businessOverlap.hasOverlap && (
                <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-md">
                  <h3 className="text-base font-medium mb-2">Best times to schedule meetings:</h3>
                  <ul className="space-y-1">
                    {businessOverlap.overlapHours.map((hours, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{hours.fromTime} in {fromLocation.name}</span>
                        <span>= {hours.toTime} in {toLocation.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </section>
        
        {/* Time Navigation Tools */}
        <section className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="border-b border-neutral-200 dark:border-neutral-700 p-4 flex items-center">
            <CalendarClock className="h-5 w-5 text-primary mr-2" />
            <h2 className="text-lg font-medium">Adjust Time for Planning</h2>
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
        
        {/* Time Comparison Section */}
        <section aria-labelledby="time-comparison-heading" className="mb-8">
          <h2 id="time-comparison-heading" className="text-xl font-semibold mb-4">
            Compare with Other Major Cities
          </h2>
          <TimeComparison 
            locations={locations}
            timeData={timeData}
            selectedLocationId={fromLocation.id}
          />
        </section>
        
        {/* SEO-friendly content */}
        <section className="bg-white dark:bg-card rounded-lg shadow-sm p-6 prose prose-sm dark:prose-invert max-w-none">
          <h2 className="flex items-center text-lg font-medium mb-3">
            <Globe className="h-5 w-5 text-primary mr-2" />
            About {fromLocation.name} and {toLocation.name} Time Difference
          </h2>
          
          <p>
            {fromLocation.name}, {fromLocation.country} uses the {fromLocation.timezone} time zone, while
            {' '}{toLocation.name}, {toLocation.country} uses the {toLocation.timezone} time zone.
            {timeDifference && ` This results in a time difference of ${timeDifference.hours}.`}
          </p>
          
          <h3 className="text-base font-medium mt-4">Planning Trips and Calls</h3>
          <p>
            When traveling from {fromLocation.name} to {toLocation.name}, you'll need to 
            {timeDifference && timeDifference.hours.startsWith('+') 
              ? ` advance your clock by ${timeDifference.hours.substring(1)} hours` 
              : timeDifference && timeDifference.hours.startsWith('-')
                ? ` set your clock back by ${timeDifference.hours.substring(1)} hours`
                : ` keep your clock on the same time`}.
            {timeDifference && timeDifference.isNextDay && ` You'll also cross the International Date Line and move forward one day.`}
            {timeDifference && timeDifference.isPrevDay && ` You'll also cross the International Date Line and move back one day.`}
          </p>
          
          <h3 className="text-base font-medium mt-4">Travel Advice</h3>
          <p>
            Travelers from {fromLocation.name} to {toLocation.name} should be prepared for 
            {timeDifference && Math.abs(parseInt(timeDifference.hours.substring(1))) >= 5 
              ? " significant jet lag. Allow several days for your body to adjust to the new time zone." 
              : " some adjustment to the time difference."} 
            Staying hydrated, getting natural sunlight exposure, and adjusting your sleep schedule gradually can help with time zone adaptation.
          </p>
          
          <p className="text-sm text-neutral-500 dark:text-neutral-300 mt-4">
            Use this tool to convert times between {fromLocation.name} and {toLocation.name} to plan 
            international calls, meetings, and travel with accurate local time information.
          </p>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}