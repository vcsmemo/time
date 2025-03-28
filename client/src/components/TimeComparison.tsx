import { Location } from "@/lib/locations";
import { TimeData, getTimeDifference } from "@/lib/time";
import { BarChart4, Clock } from "lucide-react";

interface TimeComparisonProps {
  locations: Location[];
  timeData: Map<string, TimeData>;
  selectedLocationId: string | null;
}

export default function TimeComparison({ 
  locations, 
  timeData, 
  selectedLocationId 
}: TimeComparisonProps) {
  const selectedLocation = locations.find(location => location.id === selectedLocationId);
  
  return (
    <div className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-neutral-200 dark:border-neutral-700 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <BarChart4 className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-lg font-medium">Time Comparison</h2>
        </div>
        {selectedLocation && (
          <div className="text-sm text-neutral-500">
            All times relative to <span className="font-medium text-primary">{selectedLocation.name}</span>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-800">
              <th className="text-left p-3 border-b dark:border-neutral-700 font-medium">Location</th>
              <th className="text-left p-3 border-b dark:border-neutral-700 font-medium">Time</th>
              <th className="text-left p-3 border-b dark:border-neutral-700 font-medium">Date</th>
              <th className="text-left p-3 border-b dark:border-neutral-700 font-medium">Time Zone</th>
              <th className="text-left p-3 border-b dark:border-neutral-700 font-medium">Difference</th>
            </tr>
          </thead>
          <tbody>
            {locations.map(location => {
              const locationTimeData = timeData.get(location.id);
              if (!locationTimeData) return null;
              
              const isSelected = location.id === selectedLocationId;
              const difference = selectedLocation && !isSelected 
                ? getTimeDifference(selectedLocation, location) 
                : isSelected ? "Selected" : "-";
              
              return (
                <tr 
                  key={location.id} 
                  className={`border-b dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                    isSelected ? 'bg-primary/5 dark:bg-primary/10' : ''
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center">
                      {isSelected && <Clock className="h-3.5 w-3.5 text-primary mr-1.5" />}
                      <span className={isSelected ? "font-medium" : ""}>{location.name}</span>
                    </div>
                    <div className="text-xs text-neutral-500">{location.country}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{locationTimeData.time}</div>
                  </td>
                  <td className="p-3 text-neutral-700 dark:text-neutral-300">
                    {locationTimeData.date.split(',')[0]}
                    <div className="text-xs text-neutral-500">{locationTimeData.date.split(',')[1]}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded inline-block">
                      {location.timezone.split('/').pop()?.replace('_', ' ')}
                    </div>
                  </td>
                  <td className={`p-3 ${
                    isSelected 
                      ? 'font-medium' 
                      : difference.startsWith('+') 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : difference.startsWith('-') 
                          ? 'text-rose-600 dark:text-rose-400' 
                          : ''
                  }`}>
                    {isSelected ? (
                      <div className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs inline-block">
                        Reference
                      </div>
                    ) : (
                      difference
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="p-3 text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-700">
        <span className="text-emerald-600 dark:text-emerald-400">+</span> means ahead of selected location, 
        <span className="ml-2 text-rose-600 dark:text-rose-400">-</span> means behind selected location
      </div>
    </div>
  );
}
