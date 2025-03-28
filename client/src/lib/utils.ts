import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Generate a human-readable time difference (e.g., "3 hours ahead", "2 hours behind")
export function formatTimeDifference(diffHours: number): string {
  if (diffHours === 0) {
    return "Same time";
  }
  
  const absHours = Math.abs(diffHours);
  const hourWord = absHours === 1 ? "hour" : "hours";
  
  if (diffHours > 0) {
    return `${absHours} ${hourWord} ahead`;
  } else {
    return `${absHours} ${hourWord} behind`;
  }
}

// Format date for input elements
export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Format time for input elements
export function formatTimeForInput(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

// Parse date and time from input elements
export function parseDateTimeFromInputs(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  return new Date(year, month - 1, day, hours, minutes);
}
