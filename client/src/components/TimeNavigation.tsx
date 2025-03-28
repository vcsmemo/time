import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { formatDateForInput, formatTimeForInput } from "@/lib/utils";
import { Clock, RotateCcw } from "lucide-react";

interface TimeNavigationProps {
  onDateTimeChange: (date: Date) => void;
  selectedDateTime: Date;
}

export default function TimeNavigation({ onDateTimeChange, selectedDateTime }: TimeNavigationProps) {
  const [dateValue, setDateValue] = useState<string>(formatDateForInput(selectedDateTime));
  const [timeValue, setTimeValue] = useState<string>(formatTimeForInput(selectedDateTime));

  // Update input values when selectedDateTime changes
  useEffect(() => {
    setDateValue(formatDateForInput(selectedDateTime));
    setTimeValue(formatTimeForInput(selectedDateTime));
  }, [selectedDateTime]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateValue(e.target.value);
    updateDateTime(e.target.value, timeValue);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(e.target.value);
    updateDateTime(dateValue, e.target.value);
  };

  const updateDateTime = (date: string, time: string) => {
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    
    const newDate = new Date(year, month - 1, day, hours, minutes);
    onDateTimeChange(newDate);
  };

  const handleResetToCurrent = () => {
    const now = new Date();
    onDateTimeChange(now);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Select Date
          </label>
          <div className="relative">
            <input
              type="date"
              className="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 dark:text-white"
              value={dateValue}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Select Time
          </label>
          <div className="relative">
            <input
              type="time"
              className="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 dark:text-white"
              value={timeValue}
              onChange={handleTimeChange}
            />
          </div>
        </div>
      </div>
      
      <Button 
        variant="outline"
        size="sm"
        onClick={handleResetToCurrent}
        className="w-full flex items-center justify-center gap-1.5"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Reset to Current Time</span>
      </Button>
    </div>
  );
}
