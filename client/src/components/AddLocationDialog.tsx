import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search as SearchIcon, Globe, MapPin, Filter } from "lucide-react";
import { debounce } from "@/lib/utils";
import { 
  Location, 
  searchLocation, 
  getRegions, 
  getCountries 
} from "@/lib/locations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AddLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLocation: (location: Location) => void;
  existingLocationIds: Set<string>;
}

export default function AddLocationDialog({
  isOpen,
  onClose,
  onAddLocation,
  existingLocationIds
}: AddLocationDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
  const [searchTab, setSearchTab] = useState<string>('search');
  
  // Get regions and countries
  const regions = getRegions();
  const countries = getCountries();
  
  // Search handler with debounce
  const handleSearch = debounce(() => {
    // Get filters based on current selections
    const filters = {
      region: selectedRegion,
      country: selectedCountry
    };
    
    // Use our enhanced search function
    let results = searchLocation(searchTerm, filters);
    
    // Filter out already added locations
    results = results.filter(location => !existingLocationIds.has(location.id));
    
    setSearchResults(results);
  }, 300);
  
  // Run search when any search parameter changes
  useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedRegion, selectedCountry]);
  
  // Reset filters
  const handleResetFilters = () => {
    setSelectedRegion(undefined);
    setSelectedCountry(undefined);
  };
  
  // Handle location selection
  const handleSelectLocation = (location: Location) => {
    onAddLocation(location);
    onClose();
  };
  
  // Close dialog and reset all filters
  const handleClose = () => {
    onClose();
    setSearchTerm('');
    handleResetFilters();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-white dark:bg-card p-6 max-w-md w-full mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center">
            <Globe className="mr-2 h-5 w-5 text-primary" />
            Add Location
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-800"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <Tabs value={searchTab} onValueChange={setSearchTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="search" className="flex items-center">
              <SearchIcon className="mr-2 h-4 w-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              Browse
            </TabsTrigger>
          </TabsList>
          
          {/* Search Tab */}
          <TabsContent value="search" className="mt-0">
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Search Location
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="City name, country..."
                  className="w-full p-2 pl-8 border border-neutral-300 dark:border-neutral-600 rounded"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                <SearchIcon className="h-4 w-4 absolute left-2.5 top-3 text-neutral-400" />
              </div>
            </div>
            
            {/* Filters Section */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Region
                </label>
                <Select 
                  value={selectedRegion} 
                  onValueChange={(value) => setSelectedRegion(value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Country
                </label>
                <Select 
                  value={selectedCountry} 
                  onValueChange={(value) => setSelectedCountry(value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Reset Filters Button */}
            {(selectedRegion || selectedCountry) && (
              <div className="flex justify-end mb-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleResetFilters}
                  className="text-xs flex items-center text-primary"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Browse Tab */}
          <TabsContent value="browse" className="mt-0">
            <div className="mb-4 grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Browse by Region
                </label>
                <Select 
                  value={selectedRegion} 
                  onValueChange={(value) => setSelectedRegion(value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedRegion && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Country
                  </label>
                  <Select 
                    value={selectedCountry} 
                    onValueChange={(value) => setSelectedCountry(value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries
                        .filter(country => {
                          // Only show countries in the selected region
                          const countryLocations = searchLocation('', { 
                            region: selectedRegion,
                            country: country
                          });
                          return countryLocations.length > 0;
                        })
                        .map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Results List */}
        <div className="mb-2 max-h-60 overflow-y-auto border border-neutral-200 dark:border-neutral-700 rounded">
          {searchResults.length > 0 ? (
            searchResults.map(result => (
              <div 
                key={result.id}
                className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer border-b last:border-0 border-neutral-200 dark:border-neutral-700"
                onClick={() => handleSelectLocation(result)}
              >
                <div className="font-medium flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-neutral-500" />
                  {result.name}
                </div>
                <div className="text-sm text-neutral-500 flex justify-between">
                  <span>{result.country}</span>
                  <span className="text-primary">{result.timezone.split('/').pop()?.replace('_', ' ')}</span>
                </div>
              </div>
            ))
          ) : (
            (!searchTerm && !selectedRegion && !selectedCountry) ? (
              <div className="p-3 text-center text-neutral-500 dark:text-neutral-400">
                Enter search terms or select filters
              </div>
            ) : (
              <div className="p-3 text-center text-neutral-500 dark:text-neutral-400">
                No locations found
              </div>
            )
          )}
        </div>
        
        {/* Result Count */}
        {searchResults.length > 0 && (
          <div className="text-xs text-right text-neutral-500">
            Found {searchResults.length} locations
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}