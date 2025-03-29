import { Location } from "@/lib/locations";
import { TimeData, getTimeDifference, getDetailedTimeDifference } from "@/lib/time";
import { BarChart4, Clock, ArrowUp, ArrowDown, CalendarDays, GripVertical } from "lucide-react";
import { Droppable, Draggable } from "react-beautiful-dnd";

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
              <th className="w-8 text-center p-3 border-b dark:border-neutral-700 font-medium"></th>
              <th className="text-left p-3 border-b dark:border-neutral-700 font-medium">Location</th>
              <th className="text-left p-3 border-b dark:border-neutral-700 font-medium">Time</th>
              <th className="text-left p-3 border-b dark:border-neutral-700 font-medium">Date</th>
              <th className="text-left p-3 border-b dark:border-neutral-700 font-medium">Time Zone</th>
              <th className="text-left p-3 border-b dark:border-neutral-700 font-medium">Difference</th>
            </tr>
          </thead>
          <Droppable droppableId="locationTable">
            {(provided) => (
              <tbody 
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {locations.map((location, index) => {
                  const locationTimeData = timeData.get(location.id);
                  if (!locationTimeData) return null;
                  
                  const isSelected = location.id === selectedLocationId;
                  const simpleDifference = selectedLocation && !isSelected 
                    ? getTimeDifference(selectedLocation, location) 
                    : isSelected ? "Selected" : "-";
                  
                  // Calculate detailed time difference if we have a selected location
                  const detailedDiff = selectedLocation && !isSelected && selectedLocationId
                    ? getDetailedTimeDifference(
                        selectedLocation, 
                        location, 
                        new Date() // Use current date as reference
                      )
                    : null;
                  
                  return (
                    <Draggable 
                      key={location.id} 
                      draggableId={location.id} 
                      index={index}
                    >
                      {(providedDrag) => (
                        <tr 
                          ref={providedDrag.innerRef}
                          {...providedDrag.draggableProps}
                          className={`border-b dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                            isSelected ? 'bg-primary/5 dark:bg-primary/10' : ''
                          }`}
                        >
                          <td className="p-2 text-center" {...providedDrag.dragHandleProps}>
                            <GripVertical className="h-4 w-4 inline-block text-neutral-400 cursor-grab" />
                          </td>
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
                            <div className="flex items-center">
                              <span>{locationTimeData.date.split(',')[0]}</span>
                              
                              {/* Day difference indicators */}
                              {detailedDiff?.isNextDay && (
                                <div className="ml-2 px-1.5 py-0.5 text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-sm flex items-center">
                                  <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                                  +1 day
                                </div>
                              )}
                              {detailedDiff?.isPrevDay && (
                                <div className="ml-2 px-1.5 py-0.5 text-[10px] bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-sm flex items-center">
                                  <ArrowDown className="h-2.5 w-2.5 mr-0.5" />
                                  -1 day
                                </div>
                              )}
                            </div>
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
                              : detailedDiff?.hours.startsWith('+') 
                                ? 'text-emerald-600 dark:text-emerald-400' 
                                : detailedDiff?.hours.startsWith('-') 
                                  ? 'text-rose-600 dark:text-rose-400' 
                                  : ''
                          }`}>
                            {isSelected ? (
                              <div className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs inline-block">
                                Reference
                              </div>
                            ) : (
                              <div className="flex items-center">
                                {detailedDiff ? detailedDiff.hours : simpleDifference}
                                
                                {/* If there's a day difference, show a calendar icon */}
                                {(detailedDiff?.isNextDay || detailedDiff?.isPrevDay) && (
                                  <CalendarDays className="h-3 w-3 ml-1 text-neutral-500" />
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </table>
      </div>
      
      <div className="p-3 pb-0 text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap gap-x-4 gap-y-1">
        <div>
          <span className="text-emerald-600 dark:text-emerald-400">+</span> means ahead of selected location, 
          <span className="ml-1 text-rose-600 dark:text-rose-400">-</span> means behind
        </div>
        <div>
          <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] px-1 py-0.5 rounded-sm mr-1">
            <ArrowUp className="h-2.5 w-2.5 mr-0.5" />+1
          </span> 
          means next day
        </div>
        <div>
          <span className="inline-flex items-center bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-[10px] px-1 py-0.5 rounded-sm mr-1">
            <ArrowDown className="h-2.5 w-2.5 mr-0.5" />-1
          </span> 
          means previous day
        </div>
      </div>
      
      <div className="p-3 pt-1 text-xs text-neutral-500 flex items-center justify-center border-t border-neutral-100 dark:border-neutral-800">
        <GripVertical className="h-3.5 w-3.5 text-neutral-400 mr-1.5" />
        <span>Drag to reorder locations</span>
      </div>
    </div>
  );
}
