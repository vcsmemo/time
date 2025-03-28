import { useState } from "react";
import { Location } from "@/lib/locations";
import { TimeData, getTimeDifference, getDetailedTimeDifference } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { 
  Clock, Globe, MapPin, Plus, Search, X, 
  ArrowUp, ArrowDown, Sun, Moon, Calendar, Info
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface LocationListProps {
  locations: Location[];
  timeData: Map<string, TimeData>;
  selectedLocationId: string | null;
  onLocationSelect: (locationId: string) => void;
  onLocationRemove: (locationId: string) => void;
  onAddLocationClick: () => void;
}

export default function LocationList({
  locations,
  timeData,
  selectedLocationId,
  onLocationSelect,
  onLocationRemove,
  onAddLocationClick
}: LocationListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showActive, setShowActive] = useState(true);
  
  const filteredLocations = searchTerm.trim() === '' 
    ? locations 
    : locations.filter(location => 
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
  const selectedLocationTimeData = selectedLocationId && timeData.get(selectedLocationId);
  
  const getOtherLocations = () => {
    return filteredLocations.filter(location => location.id !== selectedLocationId);
  };
  
  // Helper to check if it's daytime at a location (simplified logic)
  const isDaytime = (timeStr: string): boolean => {
    const hour = parseInt(timeStr.split(':')[0]);
    return hour >= 6 && hour < 18;
  };

  // Get GMT offset for display
  const getGmtOffset = (timezone: string): string => {
    try {
      const date = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        timeZoneName: 'short'
      };
      const dateString = date.toLocaleString('en-US', options);
      const gmtMatch = dateString.match(/GMT([+-]\d+)/);
      return gmtMatch ? gmtMatch[0] : '';
    } catch (e) {
      return '';
    }
  };
  
  return (
    <div className="w-full flex flex-col">
      <div className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden">
        {/* Header with add button */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 p-3 flex justify-between items-center">
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-primary mr-2" />
            <h1 className="text-lg font-medium">World Time Zones</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onAddLocationClick}
            className="flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </Button>
        </div>
        
        {/* Location Search */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 p-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search locations..."
              className="w-full pr-8 pl-3 border border-neutral-200 dark:border-neutral-700 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>
        
        {/* Selected Location */}
        {selectedLocation && selectedLocationTimeData && (
          <div className="px-3 py-2 bg-primary/5 dark:bg-primary/10 border-b border-primary/20">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {isDaytime(selectedLocationTimeData.time) ? (
                    <Sun className="h-6 w-6 text-amber-500" />
                  ) : (
                    <Moon className="h-6 w-6 text-indigo-400" />
                  )}
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-xs text-primary flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      REFERENCE TIME
                    </div>
                    <h2 className="text-xl font-bold truncate">{selectedLocation.name}</h2>
                  </div>
                  <div className="text-xs px-2 py-0.5 border border-primary/20 text-primary rounded-full">
                    {getGmtOffset(selectedLocation.timezone)}
                  </div>
                </div>
                <div className="flex items-center text-sm text-neutral-500">
                  <MapPin className="h-3 w-3 mr-1 inline flex-shrink-0" />
                  <span className="truncate">{selectedLocation.country}</span>
                  <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                    <Info className="h-3 w-3 text-neutral-400" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-3xl font-bold mr-2 tabular-nums">
                  {selectedLocationTimeData.time}
                </div>
                <div className="flex flex-col">
                  <div className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                    {selectedLocation.timezone.split('/').pop()?.replace('_', ' ')}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 text-neutral-500 mr-1.5" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {selectedLocationTimeData.date}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Filter toggle */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 p-2 flex justify-between items-center">
          <div className="text-sm font-medium">Other Locations</div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-neutral-500">{getOtherLocations().length} cities</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => setShowActive(!showActive)}
            >
              {showActive ? 'Show All' : 'Show Active'}
            </Button>
          </div>
        </div>
        
        {/* Location List */}
        <div className="overflow-y-auto max-h-[400px]">
          {getOtherLocations().length > 0 ? (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {getOtherLocations().map(location => {
                const locationTimeData = timeData.get(location.id);
                if (!locationTimeData) return null;
                
                // Skip inactive times if filter is on
                if (showActive) {
                  const hour = parseInt(locationTimeData.time.split(':')[0]);
                  if (hour < 7 || hour > 22) return null;
                }
                
                // Calculate time difference if selected location exists
                const timeDiff = selectedLocation ? 
                  getTimeDifference(selectedLocation, location) : '';
                
                // Calculate detailed time difference with day information
                const detailedDiff = selectedLocation ? 
                  getDetailedTimeDifference(selectedLocation, location, new Date()) : null;
                
                const isAhead = timeDiff.startsWith('+');
                
                return (
                  <div 
                    key={location.id}
                    className="p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    onClick={() => onLocationSelect(location.id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 mr-2 flex items-center justify-center">
                        {isDaytime(locationTimeData.time) ? (
                          <Sun className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Moon className="h-4 w-4 text-indigo-400" />
                        )}
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center">
                          <div className="font-medium truncate">{location.name}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-neutral-400 hover:text-error h-6 w-6 -mr-1.5 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onLocationRemove(location.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-neutral-500 truncate">
                            {location.country}
                          </div>
                          {timeDiff && (
                            <div className={`text-xs flex items-center ${
                              isAhead ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                              {isAhead ? (
                                <ArrowUp className="h-3 w-3 mr-0.5" />
                              ) : (
                                <ArrowDown className="h-3 w-3 mr-0.5" />
                              )}
                              {timeDiff.replace('+', '').replace('-', '')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 ml-2 text-right">
                        <div className="font-medium tabular-nums">{locationTimeData.time}</div>
                        <div className="flex items-center text-xs text-neutral-500 justify-end">
                          <span>{locationTimeData.date.split(',')[0]}</span>
                          
                          {/* Day difference indicators */}
                          {detailedDiff?.isNextDay && (
                            <span className="ml-1 px-1 py-0.5 text-[9px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-sm flex items-center">
                              +1
                            </span>
                          )}
                          {detailedDiff?.isPrevDay && (
                            <span className="ml-1 px-1 py-0.5 text-[9px] bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-sm flex items-center">
                              -1
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : filteredLocations.length === 0 ? (
            <div className="text-neutral-500 dark:text-neutral-400 text-center py-8">
              No locations found. Try a different search term.
            </div>
          ) : (
            <div className="text-neutral-500 dark:text-neutral-400 text-center py-8">
              No other locations. Add more locations to compare.
            </div>
          )}
        </div>
        
        {/* Add more locations footer */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 p-2 text-center">
          <Button 
            variant="ghost"
            onClick={onAddLocationClick}
            className="text-primary text-sm w-full flex items-center justify-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add more locations</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
