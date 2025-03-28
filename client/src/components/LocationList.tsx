import { useState } from "react";
import { Location } from "@/lib/locations";
import { TimeData } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
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
    <div className="w-full md:w-1/3 flex flex-col gap-4">
      <div className="bg-white dark:bg-card rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Locations</h2>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onAddLocationClick}
              className="text-primary hover:text-primary/90"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Location Search */}
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search city or location..."
            className="w-full p-2 pl-8 border border-neutral-200 dark:border-neutral-700 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search absolute left-2.5 top-3 text-neutral-400"></i>
        </div>
        
        <div className="space-y-3">
          {/* Primary selected location */}
          {selectedLocation && selectedLocationTimeData && (
            <div className="border-2 border-secondary rounded-lg p-3 bg-secondary/5 dark:bg-secondary/10">
              <div className="flex justify-between">
                <div className="font-medium">{selectedLocation.name}</div>
                <div className="text-xs bg-secondary text-white px-2 py-0.5 rounded-full">Selected</div>
              </div>
              <div className="time-display text-2xl font-medium mt-1">
                {selectedLocationTimeData.time}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {selectedLocationTimeData.date}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                {selectedLocationTimeData.timezone}
              </div>
            </div>
          )}
          
          {/* Other locations */}
          {getOtherLocations().map(location => {
            const locationTimeData = timeData.get(location.id);
            if (!locationTimeData) return null;
            
            return (
              <div 
                key={location.id}
                className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                onClick={() => onLocationSelect(location.id)}
              >
                <div className="flex justify-between">
                  <div className="font-medium">{location.name}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-400 hover:text-error h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLocationRemove(location.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="time-display text-xl font-medium mt-1">
                  {locationTimeData.time}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {locationTimeData.date}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  {locationTimeData.timezone}
                </div>
              </div>
            );
          })}
          
          {filteredLocations.length === 0 && (
            <div className="text-neutral-500 dark:text-neutral-400 text-center py-4">
              No locations found. Try a different search term.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
