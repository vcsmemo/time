import { Location } from "@/lib/locations";
import { TimeData, getTimeDifference } from "@/lib/time";

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
    <div className="mt-6 bg-white dark:bg-card rounded-lg shadow-md p-4">
      <h2 className="text-lg font-medium mb-4">Time Comparison</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-800">
              <th className="text-left p-3 border-b dark:border-neutral-700">Location</th>
              <th className="text-left p-3 border-b dark:border-neutral-700">Time</th>
              <th className="text-left p-3 border-b dark:border-neutral-700">Date</th>
              <th className="text-left p-3 border-b dark:border-neutral-700">Time Zone</th>
              <th className="text-left p-3 border-b dark:border-neutral-700">Difference</th>
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
                    isSelected ? 'bg-secondary/5 dark:bg-secondary/10' : ''
                  }`}
                >
                  <td className="p-3">{location.name}</td>
                  <td className="p-3 time-display">{locationTimeData.time}</td>
                  <td className="p-3">{locationTimeData.date.split(',')[1]}</td>
                  <td className="p-3">{locationTimeData.timezone}</td>
                  <td className={`p-3 ${
                    isSelected 
                      ? 'font-medium' 
                      : difference.startsWith('+') 
                        ? 'text-success' 
                        : difference.startsWith('-') 
                          ? 'text-error' 
                          : ''
                  }`}>
                    {difference}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
