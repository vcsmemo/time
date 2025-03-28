import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { formatDateForInput, formatTimeForInput } from "@/lib/utils";

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
    <div className="bg-white dark:bg-card rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-medium mb-3">Time Navigation</h2>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-sm text-neutral-600 dark:text-neutral-300 mb-1">
            Select Date
          </label>
          <input
            type="date"
            className="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 dark:text-white"
            value={dateValue}
            onChange={handleDateChange}
          />
        </div>
        <div className="flex-1 min-w-[250px]">
          <label className="block text-sm text-neutral-600 dark:text-neutral-300 mb-1">
            Select Time
          </label>
          <input
            type="time"
            className="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 dark:text-white"
            value={timeValue}
            onChange={handleTimeChange}
          />
        </div>
        <div className="flex items-end">
          <Button 
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded"
            onClick={handleResetToCurrent}
          >
            Current Time
          </Button>
        </div>
      </div>
    </div>
  );
}
