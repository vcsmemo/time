import { format, addDays, addHours, differenceInHours } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Location } from './locations';

// Custom implementation for utcToZonedTime since it's missing from date-fns-tz
export function utcToZonedTime(date: Date, timeZone: string): Date {
  const targetDate = new Date(date);
  const formattedDate = formatInTimeZone(date, timeZone, 'yyyy-MM-dd HH:mm:ss');
  const [yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr] = 
    formattedDate.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/)!.slice(1);
  
  const year = parseInt(yearStr);
  const month = parseInt(monthStr) - 1; // Month is 0-indexed in JS Date
  const day = parseInt(dayStr);
  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);
  const second = parseInt(secondStr);
  
  targetDate.setFullYear(year, month, day);
  targetDate.setHours(hour, minute, second);
  
  return targetDate;
}

// Type definition for time data
export interface TimeData {
  time: string;
  date: string;
  timezone: string;
  rawDate: Date;
}

// Get current time data for a specific timezone
export function getCurrentTimeData(timezone: string): TimeData {
  const now = new Date();
  const zonedDate = utcToZonedTime(now, timezone);
  
  return {
    time: format(zonedDate, 'HH:mm:ss'),
    date: format(zonedDate, 'EEEE, MMMM d, yyyy'),
    timezone: formatTimezoneOffset(timezone),
    rawDate: zonedDate
  };
}

// Get a specific time in a specific timezone
export function getTimeData(dateTime: Date, timezone: string): TimeData {
  const zonedDate = utcToZonedTime(dateTime, timezone);
  
  return {
    time: format(zonedDate, 'HH:mm:ss'),
    date: format(zonedDate, 'EEEE, MMMM d, yyyy'),
    timezone: formatTimezoneOffset(timezone),
    rawDate: zonedDate
  };
}

// Format timezone offset for display (e.g., "UTC+8 (CST)")
export function formatTimezoneOffset(timezone: string): string {
  const now = new Date();
  const zonedDate = utcToZonedTime(now, timezone);
  
  // Get the timezone abbreviation
  const tzAbbr = formatInTimeZone(zonedDate, timezone, 'zzz');
  
  // Get the offset in hours from UTC
  const offset = zonedDate.getTimezoneOffset() / -60;
  const sign = offset >= 0 ? '+' : '';
  
  return `UTC${sign}${offset} (${tzAbbr})`;
}

// Calculate time difference between two locations
export function getTimeDifference(location1: Location, location2: Location): string {
  const now = new Date();
  const time1 = utcToZonedTime(now, location1.timezone);
  const time2 = utcToZonedTime(now, location2.timezone);
  
  const diffHours = differenceInHours(time2, time1);
  
  // Format the difference with a sign
  const sign = diffHours >= 0 ? '+' : '';
  return `${sign}${diffHours}h`;
}

// Convert a specific date and time to all timezones
export function convertTimeToAllLocations(date: Date, locations: Location[]): Map<string, TimeData> {
  const result = new Map<string, TimeData>();
  
  for (const location of locations) {
    result.set(location.id, getTimeData(date, location.timezone));
  }
  
  return result;
}
