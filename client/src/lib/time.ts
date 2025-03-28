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

// Interface for detailed time difference
export interface TimeDifferenceResult {
  hours: string;         // Time difference with sign (e.g., "+8h", "-5h")
  isNextDay: boolean;    // If true, it's the next day at this location
  isPrevDay: boolean;    // If true, it's the previous day at this location
  dayDifference: number; // Day difference (e.g., -1, 0, +1)
}

// Calculate time difference between two locations (simple version)
export function getTimeDifference(location1: Location, location2: Location): string {
  const now = new Date();
  const time1 = utcToZonedTime(now, location1.timezone);
  const time2 = utcToZonedTime(now, location2.timezone);
  
  const diffHours = differenceInHours(time2, time1);
  
  // Format the difference with a sign
  const sign = diffHours >= 0 ? '+' : '';
  return `${sign}${diffHours}h`;
}

// Calculate detailed time difference between two locations
export function getDetailedTimeDifference(
  location1: Location, 
  location2: Location, 
  referenceTime: Date
): TimeDifferenceResult {
  // Get times in both locations with the same reference time
  const time1 = utcToZonedTime(referenceTime, location1.timezone);
  const time2 = utcToZonedTime(referenceTime, location2.timezone);
  
  // Calculate hour difference
  const diffHours = differenceInHours(time2, time1);
  
  // Calculate day difference by comparing day of month
  const day1 = format(time1, 'd');
  const month1 = format(time1, 'M');
  const year1 = format(time1, 'yyyy');
  
  const day2 = format(time2, 'd');
  const month2 = format(time2, 'M');
  const year2 = format(time2, 'yyyy');
  
  // Determine if it's a different day
  let dayDifference = 0;
  
  // Check year difference first
  if (year1 !== year2) {
    dayDifference = year2 > year1 ? 1 : -1;
  } 
  // Then check month difference
  else if (month1 !== month2) {
    dayDifference = month2 > month1 ? 1 : -1;
  }
  // Then check day difference 
  else if (day1 !== day2) {
    dayDifference = parseInt(day2) > parseInt(day1) ? 1 : -1;
  }
  
  return {
    hours: `${diffHours >= 0 ? '+' : ''}${diffHours}h`,
    isNextDay: dayDifference > 0,
    isPrevDay: dayDifference < 0,
    dayDifference
  };
}

// Convert a specific date and time to all timezones
export function convertTimeToAllLocations(date: Date, locations: Location[]): Map<string, TimeData> {
  const result = new Map<string, TimeData>();
  
  for (const location of locations) {
    result.set(location.id, getTimeData(date, location.timezone));
  }
  
  return result;
}
