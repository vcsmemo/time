import { useState } from "react";
import { Location } from "@/lib/locations";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

interface WorldMapProps {
  locations: Location[];
  selectedLocationId: string | null;
  onLocationSelect: (locationId: string) => void;
}

export default function WorldMap({ 
  locations, 
  selectedLocationId, 
  onLocationSelect 
}: WorldMapProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const handleZoomIn = () => {
    if (zoomLevel < 2) {
      setZoomLevel(zoomLevel + 0.2);
    }
  };
  
  const handleZoomOut = () => {
    if (zoomLevel > 0.6) {
      setZoomLevel(zoomLevel - 0.2);
    }
  };
  
  return (
    <div className="w-full md:w-2/3 bg-white dark:bg-card rounded-lg shadow-md p-4 relative min-h-[400px]">
      <h2 className="text-lg font-medium mb-4">World Map & Time Zones</h2>
      
      <div className="relative bg-accent/10 dark:bg-accent/5 rounded-lg p-2 h-[400px] overflow-hidden">
        <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.3s ease' }}>
          <svg viewBox="0 0 1000 500" className="w-full h-full">
            {/* Simplified world map outline */}
            <path 
              d="M150,250 Q400,150 850,250 Q400,350 150,250" 
              fill="none" 
              stroke="#bdbdbd" 
              strokeWidth="2" 
              className="dark:stroke-neutral-600"
            />
            
            {/* Location markers */}
            <g>
              {locations.map((location) => (
                <circle 
                  key={location.id}
                  className={`map-marker ${selectedLocationId === location.id ? 'fill-secondary' : 'fill-primary'}`}
                  cx={location.coordinates.x} 
                  cy={location.coordinates.y} 
                  r="8" 
                  stroke="#fff"
                  strokeWidth="2"
                  onClick={() => onLocationSelect(location.id)}
                />
              ))}
            </g>
          </svg>
        </div>
        
        {/* Map controls */}
        <div className="absolute bottom-3 right-3 flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-white dark:bg-neutral-800 shadow-md rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-white dark:bg-neutral-800 shadow-md rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
          </Button>
        </div>
      </div>
    </div>
  );
}
