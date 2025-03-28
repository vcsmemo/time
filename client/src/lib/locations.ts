// Type definition for a location
export interface Location {
  id: string;
  name: string;
  country: string;
  timezone: string;
  coordinates: {
    x: number;
    y: number;
  };
}

// Built-in major cities and their locations
export const defaultLocations: Location[] = [
  // North America
  {
    id: 'newyork',
    name: 'New York',
    country: 'United States',
    timezone: 'America/New_York',
    coordinates: { x: 180, y: 230 }
  },
  {
    id: 'losangeles',
    name: 'Los Angeles',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    coordinates: { x: 120, y: 220 }
  },
  {
    id: 'chicago',
    name: 'Chicago',
    country: 'United States',
    timezone: 'America/Chicago',
    coordinates: { x: 160, y: 220 }
  },
  {
    id: 'toronto',
    name: 'Toronto',
    country: 'Canada',
    timezone: 'America/Toronto',
    coordinates: { x: 175, y: 210 }
  },
  {
    id: 'vancouver',
    name: 'Vancouver',
    country: 'Canada',
    timezone: 'America/Vancouver',
    coordinates: { x: 130, y: 210 }
  },
  {
    id: 'mexicocity',
    name: 'Mexico City',
    country: 'Mexico',
    timezone: 'America/Mexico_City',
    coordinates: { x: 150, y: 250 }
  },

  // South America
  {
    id: 'riodejaneiro',
    name: 'Rio de Janeiro',
    country: 'Brazil',
    timezone: 'America/Sao_Paulo',
    coordinates: { x: 250, y: 290 }
  },
  {
    id: 'buenosaires',
    name: 'Buenos Aires',
    country: 'Argentina',
    timezone: 'America/Argentina/Buenos_Aires',
    coordinates: { x: 240, y: 310 }
  },
  {
    id: 'santiago',
    name: 'Santiago',
    country: 'Chile',
    timezone: 'America/Santiago',
    coordinates: { x: 230, y: 320 }
  },
  {
    id: 'bogota',
    name: 'Bogotá',
    country: 'Colombia',
    timezone: 'America/Bogota',
    coordinates: { x: 220, y: 260 }
  },
  {
    id: 'lima',
    name: 'Lima',
    country: 'Peru',
    timezone: 'America/Lima',
    coordinates: { x: 215, y: 275 }
  },

  // Europe
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    coordinates: { x: 280, y: 180 }
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    timezone: 'Europe/Paris',
    coordinates: { x: 300, y: 200 }
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    coordinates: { x: 310, y: 190 }
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    timezone: 'Europe/Rome',
    coordinates: { x: 320, y: 205 }
  },
  {
    id: 'madrid',
    name: 'Madrid',
    country: 'Spain',
    timezone: 'Europe/Madrid',
    coordinates: { x: 290, y: 210 }
  },
  {
    id: 'moscow',
    name: 'Moscow',
    country: 'Russia',
    timezone: 'Europe/Moscow',
    coordinates: { x: 350, y: 175 }
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    timezone: 'Europe/Amsterdam',
    coordinates: { x: 300, y: 185 }
  },
  {
    id: 'zurich',
    name: 'Zurich',
    country: 'Switzerland',
    timezone: 'Europe/Zurich',
    coordinates: { x: 305, y: 195 }
  },
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    timezone: 'Europe/Lisbon',
    coordinates: { x: 280, y: 215 }
  },
  {
    id: 'stockholm',
    name: 'Stockholm',
    country: 'Sweden',
    timezone: 'Europe/Stockholm',
    coordinates: { x: 320, y: 170 }
  },
  {
    id: 'istanbul',
    name: 'Istanbul',
    country: 'Turkey',
    timezone: 'Europe/Istanbul',
    coordinates: { x: 340, y: 215 }
  },

  // Asia
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    coordinates: { x: 650, y: 220 }
  },
  {
    id: 'beijing',
    name: 'Beijing',
    country: 'China',
    timezone: 'Asia/Shanghai',
    coordinates: { x: 580, y: 220 }
  },
  {
    id: 'shanghai',
    name: 'Shanghai',
    country: 'China',
    timezone: 'Asia/Shanghai',
    coordinates: { x: 600, y: 230 }
  },
  {
    id: 'hongkong',
    name: 'Hong Kong',
    country: 'China',
    timezone: 'Asia/Hong_Kong',
    coordinates: { x: 590, y: 240 }
  },
  {
    id: 'seoul',
    name: 'Seoul',
    country: 'South Korea',
    timezone: 'Asia/Seoul',
    coordinates: { x: 620, y: 215 }
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    timezone: 'Asia/Singapore',
    coordinates: { x: 520, y: 260 }
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    timezone: 'Asia/Bangkok',
    coordinates: { x: 540, y: 250 }
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    timezone: 'Asia/Kolkata',
    coordinates: { x: 460, y: 250 }
  },
  {
    id: 'delhi',
    name: 'New Delhi',
    country: 'India',
    timezone: 'Asia/Kolkata',
    coordinates: { x: 470, y: 240 }
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    timezone: 'Asia/Dubai',
    coordinates: { x: 380, y: 240 }
  },
  {
    id: 'taipei',
    name: 'Taipei',
    country: 'Taiwan',
    timezone: 'Asia/Taipei',
    coordinates: { x: 610, y: 235 }
  },
  {
    id: 'kualalumpur',
    name: 'Kuala Lumpur',
    country: 'Malaysia',
    timezone: 'Asia/Kuala_Lumpur',
    coordinates: { x: 530, y: 255 }
  },

  // Oceania
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    timezone: 'Australia/Sydney',
    coordinates: { x: 640, y: 300 }
  },
  {
    id: 'melbourne',
    name: 'Melbourne',
    country: 'Australia',
    timezone: 'Australia/Melbourne',
    coordinates: { x: 630, y: 310 }
  },
  {
    id: 'brisbane',
    name: 'Brisbane',
    country: 'Australia',
    timezone: 'Australia/Brisbane',
    coordinates: { x: 645, y: 290 }
  },
  {
    id: 'auckland',
    name: 'Auckland',
    country: 'New Zealand',
    timezone: 'Pacific/Auckland',
    coordinates: { x: 670, y: 320 }
  },
  {
    id: 'perth',
    name: 'Perth',
    country: 'Australia',
    timezone: 'Australia/Perth',
    coordinates: { x: 580, y: 300 }
  },

  // Africa
  {
    id: 'cairo',
    name: 'Cairo',
    country: 'Egypt',
    timezone: 'Africa/Cairo',
    coordinates: { x: 350, y: 230 }
  },
  {
    id: 'johannesburg',
    name: 'Johannesburg',
    country: 'South Africa',
    timezone: 'Africa/Johannesburg',
    coordinates: { x: 330, y: 290 }
  },
  {
    id: 'lagos',
    name: 'Lagos',
    country: 'Nigeria',
    timezone: 'Africa/Lagos',
    coordinates: { x: 300, y: 260 }
  },
  {
    id: 'casablanca',
    name: 'Casablanca',
    country: 'Morocco',
    timezone: 'Africa/Casablanca',
    coordinates: { x: 280, y: 235 }
  },
  {
    id: 'nairobi',
    name: 'Nairobi',
    country: 'Kenya',
    timezone: 'Africa/Nairobi',
    coordinates: { x: 340, y: 265 }
  }
];

// Helper function to get all continents/regions
export function getRegions(): string[] {
  return [
    'North America',
    'South America',
    'Europe',
    'Asia',
    'Oceania',
    'Africa'
  ];
}

// Helper function to get all countries from the dataset
export function getCountries(): string[] {
  const countriesSet = new Set<string>();
  defaultLocations.forEach(location => {
    countriesSet.add(location.country);
  });
  return Array.from(countriesSet).sort();
}

// Search for a location by name, country, or region
export function searchLocation(query: string, filters?: {
  region?: string;
  country?: string;
}): Location[] {
  // Require at least 2 characters for text search unless filters are provided
  if (!query && !filters) return [];
  if (!filters && (!query || query.length < 2)) return [];
  
  const normalizedQuery = query ? query.toLowerCase() : '';
  
  // Apply filters to locations
  return defaultLocations.filter(location => {
    // Text search
    const matchesQuery = !normalizedQuery || 
      location.name.toLowerCase().includes(normalizedQuery) ||
      location.country.toLowerCase().includes(normalizedQuery) ||
      location.timezone.toLowerCase().includes(normalizedQuery);
    
    // Region filter - based on location ordering in the array
    // We've organized the array by regions with comments
    const matchesRegion = !filters?.region || getLocationRegion(location) === filters.region;
    
    // Country filter
    const matchesCountry = !filters?.country || location.country === filters.country;
    
    return matchesQuery && matchesRegion && matchesCountry;
  });
}

// Helper function to determine a location's region based on our data organization
function getLocationRegion(location: Location): string {
  const id = location.id;
  
  // These ID mappings are based on how the locations are organized in the defaultLocations array
  const locationIndex = defaultLocations.findIndex(loc => loc.id === id);
  
  if (locationIndex < 0) return 'Unknown';
  
  // Map index ranges to regions based on how data is organized
  if (locationIndex < 6) return 'North America';
  if (locationIndex < 11) return 'South America';
  if (locationIndex < 22) return 'Europe';
  if (locationIndex < 34) return 'Asia';
  if (locationIndex < 39) return 'Oceania';
  return 'Africa';
}

// List of all IANA timezones for advanced use
export const allTimezones = [
  "Africa/Abidjan", "Africa/Accra", "Africa/Algiers", "Africa/Bissau", "Africa/Cairo",
  "Africa/Casablanca", "Africa/Ceuta", "Africa/El_Aaiun", "Africa/Johannesburg", "Africa/Juba",
  "Africa/Khartoum", "Africa/Lagos", "Africa/Maputo", "Africa/Monrovia", "Africa/Nairobi",
  "Africa/Ndjamena", "Africa/Sao_Tome", "Africa/Tripoli", "Africa/Tunis", "Africa/Windhoek",
  "America/Adak", "America/Anchorage", "America/Araguaina", "America/Argentina/Buenos_Aires",
  "America/Argentina/Catamarca", "America/Argentina/Cordoba", "America/Argentina/Jujuy",
  "America/Argentina/La_Rioja", "America/Argentina/Mendoza", "America/Argentina/Rio_Gallegos",
  "America/Argentina/Salta", "America/Argentina/San_Juan", "America/Argentina/San_Luis",
  "America/Argentina/Tucuman", "America/Argentina/Ushuaia", "America/Asuncion", "America/Atikokan",
  "America/Bahia", "America/Bahia_Banderas", "America/Barbados", "America/Belem", "America/Belize",
  "America/Blanc-Sablon", "America/Boa_Vista", "America/Bogota", "America/Boise", "America/Cambridge_Bay",
  "America/Campo_Grande", "America/Cancun", "America/Caracas", "America/Cayenne", "America/Chicago",
  "America/Chihuahua", "America/Costa_Rica", "America/Creston", "America/Cuiaba", "America/Curacao",
  "America/Danmarkshavn", "America/Dawson", "America/Dawson_Creek", "America/Denver", "America/Detroit",
  "America/Edmonton", "America/Eirunepe", "America/El_Salvador", "America/Fort_Nelson", "America/Fortaleza",
  "America/Glace_Bay", "America/Goose_Bay", "America/Grand_Turk", "America/Guatemala", "America/Guayaquil",
  "America/Guyana", "America/Halifax", "America/Havana", "America/Hermosillo", "America/Indiana/Indianapolis",
  "America/Indiana/Knox", "America/Indiana/Marengo", "America/Indiana/Petersburg", "America/Indiana/Tell_City",
  "America/Indiana/Vevay", "America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Inuvik",
  "America/Iqaluit", "America/Jamaica", "America/Juneau", "America/Kentucky/Louisville",
  "America/Kentucky/Monticello", "America/La_Paz", "America/Lima", "America/Los_Angeles", "America/Maceio",
  "America/Managua", "America/Manaus", "America/Martinique", "America/Matamoros", "America/Mazatlan",
  "America/Menominee", "America/Merida", "America/Metlakatla", "America/Mexico_City", "America/Miquelon",
  "America/Moncton", "America/Monterrey", "America/Montevideo", "America/Nassau", "America/New_York",
  "America/Nipigon", "America/Nome", "America/Noronha", "America/North_Dakota/Beulah",
  "America/North_Dakota/Center", "America/North_Dakota/New_Salem", "America/Ojinaga", "America/Panama",
  "America/Pangnirtung", "America/Paramaribo", "America/Phoenix", "America/Port-au-Prince",
  "America/Port_of_Spain", "America/Porto_Velho", "America/Puerto_Rico", "America/Punta_Arenas",
  "America/Rainy_River", "America/Rankin_Inlet", "America/Recife", "America/Regina", "America/Resolute",
  "America/Rio_Branco", "America/Santarem", "America/Santiago", "America/Santo_Domingo", "America/Sao_Paulo",
  "America/Scoresbysund", "America/Sitka", "America/St_Johns", "America/Swift_Current", "America/Tegucigalpa",
  "America/Thule", "America/Thunder_Bay", "America/Tijuana", "America/Toronto", "America/Vancouver",
  "America/Whitehorse", "America/Winnipeg", "America/Yakutat", "America/Yellowknife", "Antarctica/Casey",
  "Antarctica/Davis", "Antarctica/DumontDUrville", "Antarctica/Macquarie", "Antarctica/Mawson",
  "Antarctica/Palmer", "Antarctica/Rothera", "Antarctica/Syowa", "Antarctica/Troll", "Antarctica/Vostok",
  "Asia/Almaty", "Asia/Amman", "Asia/Anadyr", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Atyrau",
  "Asia/Baghdad", "Asia/Baku", "Asia/Bangkok", "Asia/Barnaul", "Asia/Beirut", "Asia/Bishkek", "Asia/Brunei",
  "Asia/Chita", "Asia/Choibalsan", "Asia/Colombo", "Asia/Damascus", "Asia/Dhaka", "Asia/Dili", "Asia/Dubai",
  "Asia/Dushanbe", "Asia/Famagusta", "Asia/Gaza", "Asia/Hebron", "Asia/Ho_Chi_Minh", "Asia/Hong_Kong",
  "Asia/Hovd", "Asia/Irkutsk", "Asia/Jakarta", "Asia/Jayapura", "Asia/Jerusalem", "Asia/Kabul", "Asia/Kamchatka",
  "Asia/Karachi", "Asia/Kathmandu", "Asia/Khandyga", "Asia/Kolkata", "Asia/Krasnoyarsk", "Asia/Kuala_Lumpur",
  "Asia/Kuching", "Asia/Macau", "Asia/Magadan", "Asia/Makassar", "Asia/Manila", "Asia/Nicosia", "Asia/Novokuznetsk",
  "Asia/Novosibirsk", "Asia/Omsk", "Asia/Oral", "Asia/Pontianak", "Asia/Pyongyang", "Asia/Qatar", "Asia/Qyzylorda",
  "Asia/Riyadh", "Asia/Sakhalin", "Asia/Samarkand", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Srednekolymsk",
  "Asia/Taipei", "Asia/Tashkent", "Asia/Tbilisi", "Asia/Tehran", "Asia/Thimphu", "Asia/Tokyo", "Asia/Tomsk",
  "Asia/Ulaanbaatar", "Asia/Urumqi", "Asia/Ust-Nera", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yangon", "Asia/Yekaterinburg",
  "Asia/Yerevan", "Atlantic/Azores", "Atlantic/Bermuda", "Atlantic/Canary", "Atlantic/Cape_Verde", "Atlantic/Faroe",
  "Atlantic/Madeira", "Atlantic/Reykjavik", "Atlantic/South_Georgia", "Atlantic/Stanley", "Australia/Adelaide",
  "Australia/Brisbane", "Australia/Broken_Hill", "Australia/Darwin", "Australia/Eucla", "Australia/Hobart",
  "Australia/Lindeman", "Australia/Lord_Howe", "Australia/Melbourne", "Australia/Perth", "Australia/Sydney",
  "Europe/Amsterdam", "Europe/Andorra", "Europe/Astrakhan", "Europe/Athens", "Europe/Belgrade", "Europe/Berlin",
  "Europe/Brussels", "Europe/Bucharest", "Europe/Budapest", "Europe/Chisinau", "Europe/Copenhagen", "Europe/Dublin",
  "Europe/Gibraltar", "Europe/Helsinki", "Europe/Istanbul", "Europe/Kaliningrad", "Europe/Kiev", "Europe/Kirov",
  "Europe/Lisbon", "Europe/London", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Minsk", "Europe/Monaco",
  "Europe/Moscow", "Europe/Oslo", "Europe/Paris", "Europe/Prague", "Europe/Riga", "Europe/Rome", "Europe/Samara",
  "Europe/Saratov", "Europe/Simferopol", "Europe/Sofia", "Europe/Stockholm", "Europe/Tallinn", "Europe/Tirane",
  "Europe/Ulyanovsk", "Europe/Uzhgorod", "Europe/Vienna", "Europe/Vilnius", "Europe/Volgograd", "Europe/Warsaw",
  "Europe/Zaporozhye", "Europe/Zurich", "Indian/Chagos", "Indian/Christmas", "Indian/Cocos", "Indian/Kerguelen",
  "Indian/Mahe", "Indian/Maldives", "Indian/Mauritius", "Indian/Reunion", "Pacific/Apia", "Pacific/Auckland",
  "Pacific/Bougainville", "Pacific/Chatham", "Pacific/Chuuk", "Pacific/Easter", "Pacific/Efate", "Pacific/Enderbury",
  "Pacific/Fakaofo", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Galapagos", "Pacific/Gambier", "Pacific/Guadalcanal",
  "Pacific/Guam", "Pacific/Honolulu", "Pacific/Kiritimati", "Pacific/Kosrae", "Pacific/Kwajalein", "Pacific/Majuro",
  "Pacific/Marquesas", "Pacific/Nauru", "Pacific/Niue", "Pacific/Norfolk", "Pacific/Noumea", "Pacific/Pago_Pago",
  "Pacific/Palau", "Pacific/Pitcairn", "Pacific/Pohnpei", "Pacific/Port_Moresby", "Pacific/Rarotonga", "Pacific/Tahiti",
  "Pacific/Tarawa", "Pacific/Tongatapu", "Pacific/Wake", "Pacific/Wallis"
];
