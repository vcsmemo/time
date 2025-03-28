import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search as SearchIcon } from "lucide-react";
import { debounce } from "@/lib/utils";
import { Location, defaultLocations } from "@/lib/locations";

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
  
  const handleSearch = debounce((term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }
    
    const normalizedTerm = term.toLowerCase();
    const results = defaultLocations
      .filter(location => !existingLocationIds.has(location.id))
      .filter(location => 
        location.name.toLowerCase().includes(normalizedTerm) ||
        location.country.toLowerCase().includes(normalizedTerm)
      );
    
    setSearchResults(results);
  }, 300);
  
  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);
  
  const handleSelectLocation = (location: Location) => {
    onAddLocation(location);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white dark:bg-card p-6 max-w-md w-full mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Location</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-800"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
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
        
        <div className="mb-4 max-h-48 overflow-y-auto border border-neutral-200 dark:border-neutral-700 rounded">
          {searchResults.length > 0 ? (
            searchResults.map(result => (
              <div 
                key={result.id}
                className="p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                onClick={() => handleSelectLocation(result)}
              >
                <div className="font-medium">{result.name}</div>
                <div className="text-sm text-neutral-500">{result.country} ({result.timezone.split('/').pop()})</div>
              </div>
            ))
          ) : (
            searchTerm.length > 1 ? (
              <div className="p-3 text-center text-neutral-500 dark:text-neutral-400">
                No locations found
              </div>
            ) : (
              <div className="p-3 text-center text-neutral-500 dark:text-neutral-400">
                Type at least 2 characters to search
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
