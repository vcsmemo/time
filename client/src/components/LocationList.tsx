import { useState } from "react";
import { Location } from "@/lib/locations";
import { TimeData } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { Clock, Globe, Plus, Search, X } from "lucide-react";
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
  
  return (
    <div className="w-full flex flex-col">
      <div className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden">
        {/* Header with add button */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-primary mr-2" />
            <h2 className="text-lg font-medium">My Locations</h2>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onAddLocationClick}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </div>
        
        {/* Location Search */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 p-3">
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
          <div className="p-4 bg-primary/5 dark:bg-primary/10 border-b border-primary/20">
            <div className="flex items-center mb-1">
              <Clock className="h-4 w-4 text-primary mr-1.5" />
              <h3 className="font-medium text-sm text-primary">SELECTED LOCATION</h3>
            </div>
            <div className="flex items-center gap-3 mb-1">
              <div className="text-2xl font-semibold">{selectedLocationTimeData.time}</div>
              <div className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                {selectedLocation.timezone.split('/').pop()?.replace('_', ' ')}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="font-medium">{selectedLocation.name}, {selectedLocation.country}</div>
              <div className="text-sm text-neutral-500">{selectedLocationTimeData.date}</div>
            </div>
          </div>
        )}
        
        {/* Location List */}
        <div className="overflow-y-auto max-h-[500px]">
          {getOtherLocations().length > 0 ? (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {getOtherLocations().map(location => {
                const locationTimeData = timeData.get(location.id);
                if (!locationTimeData) return null;
                
                return (
                  <div 
                    key={location.id}
                    className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    onClick={() => onLocationSelect(location.id)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">{location.name}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-neutral-400 hover:text-error h-6 w-6 -mr-1.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLocationRemove(location.id);
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xl">{locationTimeData.time}</div>
                      <div className="text-xs text-neutral-500 px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                        {location.timezone.split('/').pop()?.replace('_', ' ')}
                      </div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <div className="text-xs text-neutral-500">{location.country}</div>
                      <div className="text-xs text-neutral-500">{locationTimeData.date.split(',')[0]}</div>
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
        {locations.length < 10 && (
          <div className="border-t border-neutral-200 dark:border-neutral-700 p-3 text-center">
            <Button 
              variant="ghost"
              onClick={onAddLocationClick}
              className="text-primary text-sm w-full flex items-center justify-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add more locations</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
