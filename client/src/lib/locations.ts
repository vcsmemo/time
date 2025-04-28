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
  // North America - United States
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
    id: 'houston',
    name: 'Houston',
    country: 'United States',
    timezone: 'America/Chicago',
    coordinates: { x: 150, y: 230 }
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    country: 'United States',
    timezone: 'America/Phoenix',
    coordinates: { x: 130, y: 225 }
  },
  {
    id: 'philadelphia',
    name: 'Philadelphia',
    country: 'United States',
    timezone: 'America/New_York',
    coordinates: { x: 175, y: 225 }
  },
  {
    id: 'sanantonio',
    name: 'San Antonio',
    country: 'United States',
    timezone: 'America/Chicago',
    coordinates: { x: 145, y: 235 }
  },
  {
    id: 'sandiego',
    name: 'San Diego',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    coordinates: { x: 118, y: 225 }
  },
  {
    id: 'dallas',
    name: 'Dallas',
    country: 'United States',
    timezone: 'America/Chicago',
    coordinates: { x: 155, y: 230 }
  },
  {
    id: 'sanjose',
    name: 'San Jose',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    coordinates: { x: 115, y: 215 }
  },
  {
    id: 'austin',
    name: 'Austin',
    country: 'United States',
    timezone: 'America/Chicago',
    coordinates: { x: 152, y: 232 }
  },
  {
    id: 'seattle',
    name: 'Seattle',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    coordinates: { x: 125, y: 205 }
  },
  {
    id: 'denver',
    name: 'Denver',
    country: 'United States',
    timezone: 'America/Denver',
    coordinates: { x: 140, y: 215 }
  },
  {
    id: 'boston',
    name: 'Boston',
    country: 'United States',
    timezone: 'America/New_York',
    coordinates: { x: 185, y: 220 }
  },
  {
    id: 'washingtondc',
    name: 'Washington DC',
    country: 'United States',
    timezone: 'America/New_York',
    coordinates: { x: 178, y: 222 }
  },
  {
    id: 'miami',
    name: 'Miami',
    country: 'United States',
    timezone: 'America/New_York',
    coordinates: { x: 170, y: 240 }
  },
  {
    id: 'atlanta',
    name: 'Atlanta',
    country: 'United States',
    timezone: 'America/New_York',
    coordinates: { x: 165, y: 235 }
  },
  
  // North America - Canada
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
    id: 'montreal',
    name: 'Montreal',
    country: 'Canada',
    timezone: 'America/Montreal',
    coordinates: { x: 180, y: 205 }
  },
  {
    id: 'calgary',
    name: 'Calgary',
    country: 'Canada',
    timezone: 'America/Edmonton',
    coordinates: { x: 140, y: 200 }
  },
  {
    id: 'ottawa',
    name: 'Ottawa',
    country: 'Canada',
    timezone: 'America/Toronto',
    coordinates: { x: 177, y: 207 }
  },
  {
    id: 'edmonton',
    name: 'Edmonton',
    country: 'Canada',
    timezone: 'America/Edmonton',
    coordinates: { x: 145, y: 195 }
  },
  {
    id: 'winnipeg',
    name: 'Winnipeg',
    country: 'Canada',
    timezone: 'America/Winnipeg',
    coordinates: { x: 155, y: 200 }
  },
  {
    id: 'quebec',
    name: 'Quebec City',
    country: 'Canada',
    timezone: 'America/Toronto',
    coordinates: { x: 182, y: 202 }
  },
  
  // North America - Mexico
  {
    id: 'mexicocity',
    name: 'Mexico City',
    country: 'Mexico',
    timezone: 'America/Mexico_City',
    coordinates: { x: 150, y: 250 }
  },
  {
    id: 'guadalajara',
    name: 'Guadalajara',
    country: 'Mexico',
    timezone: 'America/Mexico_City',
    coordinates: { x: 145, y: 248 }
  },
  {
    id: 'monterrey',
    name: 'Monterrey',
    country: 'Mexico',
    timezone: 'America/Monterrey',
    coordinates: { x: 148, y: 245 }
  },
  {
    id: 'tijuana',
    name: 'Tijuana',
    country: 'Mexico',
    timezone: 'America/Tijuana',
    coordinates: { x: 120, y: 230 }
  },
  {
    id: 'cancun',
    name: 'Cancún',
    country: 'Mexico',
    timezone: 'America/Cancun',
    coordinates: { x: 160, y: 245 }
  },

  // Central America & Caribbean
  {
    id: 'panama',
    name: 'Panama City',
    country: 'Panama',
    timezone: 'America/Panama',
    coordinates: { x: 190, y: 260 }
  },
  {
    id: 'sanjose',
    name: 'San José',
    country: 'Costa Rica',
    timezone: 'America/Costa_Rica',
    coordinates: { x: 185, y: 258 }
  },
  {
    id: 'guatemala',
    name: 'Guatemala City',
    country: 'Guatemala',
    timezone: 'America/Guatemala',
    coordinates: { x: 170, y: 252 }
  },
  {
    id: 'havana',
    name: 'Havana',
    country: 'Cuba',
    timezone: 'America/Havana',
    coordinates: { x: 165, y: 242 }
  },
  {
    id: 'santodomingo',
    name: 'Santo Domingo',
    country: 'Dominican Republic',
    timezone: 'America/Santo_Domingo',
    coordinates: { x: 180, y: 245 }
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
    id: 'saopaulo',
    name: 'São Paulo',
    country: 'Brazil',
    timezone: 'America/Sao_Paulo',
    coordinates: { x: 248, y: 295 }
  },
  {
    id: 'brasilia',
    name: 'Brasília',
    country: 'Brazil',
    timezone: 'America/Sao_Paulo',
    coordinates: { x: 245, y: 285 }
  },
  {
    id: 'salvador',
    name: 'Salvador',
    country: 'Brazil',
    timezone: 'America/Bahia',
    coordinates: { x: 255, y: 280 }
  },
  {
    id: 'buenosaires',
    name: 'Buenos Aires',
    country: 'Argentina',
    timezone: 'America/Argentina/Buenos_Aires',
    coordinates: { x: 240, y: 310 }
  },
  {
    id: 'cordoba',
    name: 'Córdoba',
    country: 'Argentina',
    timezone: 'America/Argentina/Cordoba',
    coordinates: { x: 235, y: 308 }
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
    id: 'medellin',
    name: 'Medellín',
    country: 'Colombia',
    timezone: 'America/Bogota',
    coordinates: { x: 218, y: 258 }
  },
  {
    id: 'cali',
    name: 'Cali',
    country: 'Colombia',
    timezone: 'America/Bogota',
    coordinates: { x: 217, y: 262 }
  },
  {
    id: 'lima',
    name: 'Lima',
    country: 'Peru',
    timezone: 'America/Lima',
    coordinates: { x: 215, y: 275 }
  },
  {
    id: 'quito',
    name: 'Quito',
    country: 'Ecuador',
    timezone: 'America/Guayaquil',
    coordinates: { x: 212, y: 265 }
  },
  {
    id: 'caracas',
    name: 'Caracas',
    country: 'Venezuela',
    timezone: 'America/Caracas',
    coordinates: { x: 225, y: 255 }
  },
  {
    id: 'montevideo',
    name: 'Montevideo',
    country: 'Uruguay',
    timezone: 'America/Montevideo',
    coordinates: { x: 242, y: 312 }
  },
  {
    id: 'lapaz',
    name: 'La Paz',
    country: 'Bolivia',
    timezone: 'America/La_Paz',
    coordinates: { x: 228, y: 280 }
  },
  {
    id: 'asuncion',
    name: 'Asunción',
    country: 'Paraguay',
    timezone: 'America/Asuncion',
    coordinates: { x: 235, y: 290 }
  },

  // Europe - Western
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    coordinates: { x: 280, y: 180 }
  },
  {
    id: 'manchester',
    name: 'Manchester',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    coordinates: { x: 278, y: 175 }
  },
  {
    id: 'birmingham',
    name: 'Birmingham',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    coordinates: { x: 278, y: 178 }
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    timezone: 'Europe/Paris',
    coordinates: { x: 300, y: 200 }
  },
  {
    id: 'marseille',
    name: 'Marseille',
    country: 'France',
    timezone: 'Europe/Paris',
    coordinates: { x: 302, y: 205 }
  },
  {
    id: 'lyon',
    name: 'Lyon',
    country: 'France',
    timezone: 'Europe/Paris',
    coordinates: { x: 301, y: 203 }
  },
  {
    id: 'madrid',
    name: 'Madrid',
    country: 'Spain',
    timezone: 'Europe/Madrid',
    coordinates: { x: 290, y: 210 }
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    timezone: 'Europe/Madrid',
    coordinates: { x: 295, y: 210 }
  },
  {
    id: 'valencia',
    name: 'Valencia',
    country: 'Spain',
    timezone: 'Europe/Madrid',
    coordinates: { x: 292, y: 212 }
  },
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    timezone: 'Europe/Lisbon',
    coordinates: { x: 280, y: 215 }
  },
  {
    id: 'porto',
    name: 'Porto',
    country: 'Portugal',
    timezone: 'Europe/Lisbon',
    coordinates: { x: 281, y: 213 }
  },
  {
    id: 'dublin',
    name: 'Dublin',
    country: 'Ireland',
    timezone: 'Europe/Dublin',
    coordinates: { x: 275, y: 175 }
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    timezone: 'Europe/Amsterdam',
    coordinates: { x: 300, y: 185 }
  },
  {
    id: 'rotterdam',
    name: 'Rotterdam',
    country: 'Netherlands',
    timezone: 'Europe/Amsterdam',
    coordinates: { x: 299, y: 186 }
  },
  {
    id: 'brussels',
    name: 'Brussels',
    country: 'Belgium',
    timezone: 'Europe/Brussels',
    coordinates: { x: 298, y: 188 }
  },
  {
    id: 'luxembourg',
    name: 'Luxembourg',
    country: 'Luxembourg',
    timezone: 'Europe/Luxembourg',
    coordinates: { x: 299, y: 192 }
  },

  // Europe - Central
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    coordinates: { x: 310, y: 190 }
  },
  {
    id: 'munich',
    name: 'Munich',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    coordinates: { x: 308, y: 195 }
  },
  {
    id: 'hamburg',
    name: 'Hamburg',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    coordinates: { x: 307, y: 187 }
  },
  {
    id: 'cologne',
    name: 'Cologne',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    coordinates: { x: 305, y: 190 }
  },
  {
    id: 'frankfurt',
    name: 'Frankfurt',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    coordinates: { x: 306, y: 193 }
  },
  {
    id: 'zurich',
    name: 'Zurich',
    country: 'Switzerland',
    timezone: 'Europe/Zurich',
    coordinates: { x: 305, y: 195 }
  },
  {
    id: 'geneva',
    name: 'Geneva',
    country: 'Switzerland',
    timezone: 'Europe/Zurich',
    coordinates: { x: 303, y: 197 }
  },
  {
    id: 'vienna',
    name: 'Vienna',
    country: 'Austria',
    timezone: 'Europe/Vienna',
    coordinates: { x: 315, y: 195 }
  },
  {
    id: 'prague',
    name: 'Prague',
    country: 'Czech Republic',
    timezone: 'Europe/Prague',
    coordinates: { x: 313, y: 190 }
  },
  {
    id: 'warsaw',
    name: 'Warsaw',
    country: 'Poland',
    timezone: 'Europe/Warsaw',
    coordinates: { x: 320, y: 185 }
  },
  {
    id: 'krakow',
    name: 'Krakow',
    country: 'Poland',
    timezone: 'Europe/Warsaw',
    coordinates: { x: 321, y: 188 }
  },
  {
    id: 'budapest',
    name: 'Budapest',
    country: 'Hungary',
    timezone: 'Europe/Budapest',
    coordinates: { x: 318, y: 197 }
  },
  {
    id: 'bratislava',
    name: 'Bratislava',
    country: 'Slovakia',
    timezone: 'Europe/Bratislava',
    coordinates: { x: 317, y: 196 }
  },

  // Europe - Northern
  {
    id: 'stockholm',
    name: 'Stockholm',
    country: 'Sweden',
    timezone: 'Europe/Stockholm',
    coordinates: { x: 320, y: 170 }
  },
  {
    id: 'gothenburg',
    name: 'Gothenburg',
    country: 'Sweden',
    timezone: 'Europe/Stockholm',
    coordinates: { x: 315, y: 172 }
  },
  {
    id: 'oslo',
    name: 'Oslo',
    country: 'Norway',
    timezone: 'Europe/Oslo',
    coordinates: { x: 310, y: 165 }
  },
  {
    id: 'bergen',
    name: 'Bergen',
    country: 'Norway',
    timezone: 'Europe/Oslo',
    coordinates: { x: 308, y: 167 }
  },
  {
    id: 'copenhagen',
    name: 'Copenhagen',
    country: 'Denmark',
    timezone: 'Europe/Copenhagen',
    coordinates: { x: 312, y: 175 }
  },
  {
    id: 'helsinki',
    name: 'Helsinki',
    country: 'Finland',
    timezone: 'Europe/Helsinki',
    coordinates: { x: 325, y: 165 }
  },
  {
    id: 'reykjavik',
    name: 'Reykjavik',
    country: 'Iceland',
    timezone: 'Atlantic/Reykjavik',
    coordinates: { x: 265, y: 155 }
  },

  // Europe - Southern
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    timezone: 'Europe/Rome',
    coordinates: { x: 320, y: 205 }
  },
  {
    id: 'milan',
    name: 'Milan',
    country: 'Italy',
    timezone: 'Europe/Rome',
    coordinates: { x: 315, y: 200 }
  },
  {
    id: 'naples',
    name: 'Naples',
    country: 'Italy',
    timezone: 'Europe/Rome',
    coordinates: { x: 322, y: 207 }
  },
  {
    id: 'florence',
    name: 'Florence',
    country: 'Italy',
    timezone: 'Europe/Rome',
    coordinates: { x: 318, y: 203 }
  },
  {
    id: 'venice',
    name: 'Venice',
    country: 'Italy',
    timezone: 'Europe/Rome',
    coordinates: { x: 317, y: 202 }
  },
  {
    id: 'athens',
    name: 'Athens',
    country: 'Greece',
    timezone: 'Europe/Athens',
    coordinates: { x: 335, y: 220 }
  },
  {
    id: 'thessaloniki',
    name: 'Thessaloniki',
    country: 'Greece',
    timezone: 'Europe/Athens',
    coordinates: { x: 333, y: 218 }
  },

  // Europe - Eastern
  {
    id: 'moscow',
    name: 'Moscow',
    country: 'Russia',
    timezone: 'Europe/Moscow',
    coordinates: { x: 350, y: 175 }
  },
  {
    id: 'saintpetersburg',
    name: 'Saint Petersburg',
    country: 'Russia',
    timezone: 'Europe/Moscow',
    coordinates: { x: 345, y: 170 }
  },
  {
    id: 'kyiv',
    name: 'Kyiv',
    country: 'Ukraine',
    timezone: 'Europe/Kiev',
    coordinates: { x: 340, y: 188 }
  },
  {
    id: 'minsk',
    name: 'Minsk',
    country: 'Belarus',
    timezone: 'Europe/Minsk',
    coordinates: { x: 335, y: 183 }
  },
  {
    id: 'bucharest',
    name: 'Bucharest',
    country: 'Romania',
    timezone: 'Europe/Bucharest',
    coordinates: { x: 330, y: 205 }
  },
  {
    id: 'sofia',
    name: 'Sofia',
    country: 'Bulgaria',
    timezone: 'Europe/Sofia',
    coordinates: { x: 328, y: 210 }
  },
  {
    id: 'istanbul',
    name: 'Istanbul',
    country: 'Turkey',
    timezone: 'Europe/Istanbul',
    coordinates: { x: 340, y: 215 }
  },
  {
    id: 'ankara',
    name: 'Ankara',
    country: 'Turkey',
    timezone: 'Europe/Istanbul',
    coordinates: { x: 345, y: 218 }
  },
  {
    id: 'izmir',
    name: 'Izmir',
    country: 'Turkey',
    timezone: 'Europe/Istanbul',
    coordinates: { x: 338, y: 217 }
  },

  // Asia - East Asia
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    coordinates: { x: 650, y: 220 }
  },
  {
    id: 'osaka',
    name: 'Osaka',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    coordinates: { x: 645, y: 222 }
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    coordinates: { x: 643, y: 223 }
  },
  {
    id: 'fukuoka',
    name: 'Fukuoka',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    coordinates: { x: 640, y: 225 }
  },
  {
    id: 'sapporo',
    name: 'Sapporo',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    coordinates: { x: 655, y: 215 }
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
    id: 'guangzhou',
    name: 'Guangzhou',
    country: 'China',
    timezone: 'Asia/Shanghai',
    coordinates: { x: 595, y: 235 }
  },
  {
    id: 'shenzhen',
    name: 'Shenzhen',
    country: 'China',
    timezone: 'Asia/Shanghai',
    coordinates: { x: 593, y: 238 }
  },
  {
    id: 'chengdu',
    name: 'Chengdu',
    country: 'China',
    timezone: 'Asia/Shanghai',
    coordinates: { x: 570, y: 225 }
  },
  {
    id: 'tianjin',
    name: 'Tianjin',
    country: 'China',
    timezone: 'Asia/Shanghai',
    coordinates: { x: 583, y: 222 }
  },
  {
    id: 'wuhan',
    name: 'Wuhan',
    country: 'China',
    timezone: 'Asia/Shanghai',
    coordinates: { x: 585, y: 227 }
  },
  {
    id: 'chongqing',
    name: 'Chongqing',
    country: 'China',
    timezone: 'Asia/Shanghai',
    coordinates: { x: 575, y: 228 }
  },
  {
    id: 'xian',
    name: "Xi'an",
    country: 'China',
    timezone: 'Asia/Shanghai',
    coordinates: { x: 565, y: 223 }
  },
  {
    id: 'hongkong',
    name: 'Hong Kong',
    country: 'China',
    timezone: 'Asia/Hong_Kong',
    coordinates: { x: 590, y: 240 }
  },
  {
    id: 'taipei',
    name: 'Taipei',
    country: 'Taiwan',
    timezone: 'Asia/Taipei',
    coordinates: { x: 610, y: 235 }
  },
  {
    id: 'kaohsiung',
    name: 'Kaohsiung',
    country: 'Taiwan',
    timezone: 'Asia/Taipei',
    coordinates: { x: 608, y: 237 }
  },
  {
    id: 'seoul',
    name: 'Seoul',
    country: 'South Korea',
    timezone: 'Asia/Seoul',
    coordinates: { x: 620, y: 215 }
  },
  {
    id: 'busan',
    name: 'Busan',
    country: 'South Korea',
    timezone: 'Asia/Seoul',
    coordinates: { x: 625, y: 220 }
  },
  {
    id: 'pyongyang',
    name: 'Pyongyang',
    country: 'North Korea',
    timezone: 'Asia/Pyongyang',
    coordinates: { x: 615, y: 210 }
  },
  {
    id: 'ulaanbaatar',
    name: 'Ulaanbaatar',
    country: 'Mongolia',
    timezone: 'Asia/Ulaanbaatar',
    coordinates: { x: 570, y: 195 }
  },

  // Asia - Southeast Asia
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
    id: 'chiangmai',
    name: 'Chiang Mai',
    country: 'Thailand',
    timezone: 'Asia/Bangkok',
    coordinates: { x: 538, y: 245 }
  },
  {
    id: 'phuket',
    name: 'Phuket',
    country: 'Thailand',
    timezone: 'Asia/Bangkok',
    coordinates: { x: 535, y: 255 }
  },
  {
    id: 'jakarta',
    name: 'Jakarta',
    country: 'Indonesia',
    timezone: 'Asia/Jakarta',
    coordinates: { x: 525, y: 270 }
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    timezone: 'Asia/Makassar',
    coordinates: { x: 535, y: 275 }
  },
  {
    id: 'kualalumpur',
    name: 'Kuala Lumpur',
    country: 'Malaysia',
    timezone: 'Asia/Kuala_Lumpur',
    coordinates: { x: 530, y: 255 }
  },
  {
    id: 'manila',
    name: 'Manila',
    country: 'Philippines',
    timezone: 'Asia/Manila',
    coordinates: { x: 560, y: 245 }
  },
  {
    id: 'cebu',
    name: 'Cebu',
    country: 'Philippines',
    timezone: 'Asia/Manila',
    coordinates: { x: 558, y: 248 }
  },
  {
    id: 'hanoi',
    name: 'Hanoi',
    country: 'Vietnam',
    timezone: 'Asia/Ho_Chi_Minh',
    coordinates: { x: 545, y: 240 }
  },
  {
    id: 'hochiminh',
    name: 'Ho Chi Minh City',
    country: 'Vietnam',
    timezone: 'Asia/Ho_Chi_Minh',
    coordinates: { x: 542, y: 250 }
  },
  {
    id: 'phnompenh',
    name: 'Phnom Penh',
    country: 'Cambodia',
    timezone: 'Asia/Phnom_Penh',
    coordinates: { x: 538, y: 248 }
  },
  {
    id: 'yangon',
    name: 'Yangon',
    country: 'Myanmar',
    timezone: 'Asia/Yangon',
    coordinates: { x: 530, y: 240 }
  },

  // Asia - South Asia
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
    id: 'kolkata',
    name: 'Kolkata',
    country: 'India',
    timezone: 'Asia/Kolkata',
    coordinates: { x: 480, y: 245 }
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    country: 'India',
    timezone: 'Asia/Kolkata',
    coordinates: { x: 465, y: 255 }
  },
  {
    id: 'chennai',
    name: 'Chennai',
    country: 'India',
    timezone: 'Asia/Kolkata',
    coordinates: { x: 470, y: 258 }
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    country: 'India',
    timezone: 'Asia/Kolkata',
    coordinates: { x: 468, y: 253 }
  },
  {
    id: 'pune',
    name: 'Pune',
    country: 'India',
    timezone: 'Asia/Kolkata',
    coordinates: { x: 462, y: 252 }
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    country: 'India',
    timezone: 'Asia/Kolkata',
    coordinates: { x: 458, y: 245 }
  },
  {
    id: 'karachi',
    name: 'Karachi',
    country: 'Pakistan',
    timezone: 'Asia/Karachi',
    coordinates: { x: 450, y: 240 }
  },
  {
    id: 'lahore',
    name: 'Lahore',
    country: 'Pakistan',
    timezone: 'Asia/Karachi',
    coordinates: { x: 455, y: 235 }
  },
  {
    id: 'islamabad',
    name: 'Islamabad',
    country: 'Pakistan',
    timezone: 'Asia/Karachi',
    coordinates: { x: 458, y: 232 }
  },
  {
    id: 'dhaka',
    name: 'Dhaka',
    country: 'Bangladesh',
    timezone: 'Asia/Dhaka',
    coordinates: { x: 490, y: 240 }
  },
  {
    id: 'chittagong',
    name: 'Chittagong',
    country: 'Bangladesh',
    timezone: 'Asia/Dhaka',
    coordinates: { x: 492, y: 242 }
  },
  {
    id: 'colombo',
    name: 'Colombo',
    country: 'Sri Lanka',
    timezone: 'Asia/Colombo',
    coordinates: { x: 475, y: 260 }
  },
  {
    id: 'kathmandu',
    name: 'Kathmandu',
    country: 'Nepal',
    timezone: 'Asia/Kathmandu',
    coordinates: { x: 475, y: 235 }
  },

  // Asia - Central & Western Asia
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    timezone: 'Asia/Dubai',
    coordinates: { x: 380, y: 240 }
  },
  {
    id: 'abudhabi',
    name: 'Abu Dhabi',
    country: 'United Arab Emirates',
    timezone: 'Asia/Dubai',
    coordinates: { x: 378, y: 242 }
  },
  {
    id: 'doha',
    name: 'Doha',
    country: 'Qatar',
    timezone: 'Asia/Qatar',
    coordinates: { x: 375, y: 245 }
  },
  {
    id: 'riyadh',
    name: 'Riyadh',
    country: 'Saudi Arabia',
    timezone: 'Asia/Riyadh',
    coordinates: { x: 370, y: 240 }
  },
  {
    id: 'jeddah',
    name: 'Jeddah',
    country: 'Saudi Arabia',
    timezone: 'Asia/Riyadh',
    coordinates: { x: 365, y: 245 }
  },
  {
    id: 'tehran',
    name: 'Tehran',
    country: 'Iran',
    timezone: 'Asia/Tehran',
    coordinates: { x: 400, y: 230 }
  },
  {
    id: 'baghdad',
    name: 'Baghdad',
    country: 'Iraq',
    timezone: 'Asia/Baghdad',
    coordinates: { x: 390, y: 230 }
  },
  {
    id: 'kuwait',
    name: 'Kuwait City',
    country: 'Kuwait',
    timezone: 'Asia/Kuwait',
    coordinates: { x: 385, y: 235 }
  },
  {
    id: 'amman',
    name: 'Amman',
    country: 'Jordan',
    timezone: 'Asia/Amman',
    coordinates: { x: 375, y: 225 }
  },
  {
    id: 'muscat',
    name: 'Muscat',
    country: 'Oman',
    timezone: 'Asia/Muscat',
    coordinates: { x: 390, y: 245 }
  },
  {
    id: 'jerusalem',
    name: 'Jerusalem',
    country: 'Israel',
    timezone: 'Asia/Jerusalem',
    coordinates: { x: 370, y: 225 }
  },
  {
    id: 'telaviv',
    name: 'Tel Aviv',
    country: 'Israel',
    timezone: 'Asia/Jerusalem',
    coordinates: { x: 368, y: 227 }
  },
  {
    id: 'beirut',
    name: 'Beirut',
    country: 'Lebanon',
    timezone: 'Asia/Beirut',
    coordinates: { x: 372, y: 220 }
  },
  {
    id: 'damascus',
    name: 'Damascus',
    country: 'Syria',
    timezone: 'Asia/Damascus',
    coordinates: { x: 375, y: 220 }
  },
  {
    id: 'baku',
    name: 'Baku',
    country: 'Azerbaijan',
    timezone: 'Asia/Baku',
    coordinates: { x: 410, y: 220 }
  },
  {
    id: 'yerevan',
    name: 'Yerevan',
    country: 'Armenia',
    timezone: 'Asia/Yerevan',
    coordinates: { x: 405, y: 215 }
  },
  {
    id: 'tbilisi',
    name: 'Tbilisi',
    country: 'Georgia',
    timezone: 'Asia/Tbilisi',
    coordinates: { x: 400, y: 210 }
  },
  {
    id: 'almaty',
    name: 'Almaty',
    country: 'Kazakhstan',
    timezone: 'Asia/Almaty',
    coordinates: { x: 430, y: 205 }
  },
  {
    id: 'tashkent',
    name: 'Tashkent',
    country: 'Uzbekistan',
    timezone: 'Asia/Tashkent',
    coordinates: { x: 425, y: 210 }
  },

  // Oceania - Australia
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
    id: 'perth',
    name: 'Perth',
    country: 'Australia',
    timezone: 'Australia/Perth',
    coordinates: { x: 580, y: 300 }
  },
  {
    id: 'adelaide',
    name: 'Adelaide',
    country: 'Australia',
    timezone: 'Australia/Adelaide',
    coordinates: { x: 610, y: 305 }
  },
  {
    id: 'canberra',
    name: 'Canberra',
    country: 'Australia',
    timezone: 'Australia/Sydney',
    coordinates: { x: 635, y: 305 }
  },
  {
    id: 'goldcoast',
    name: 'Gold Coast',
    country: 'Australia',
    timezone: 'Australia/Brisbane',
    coordinates: { x: 647, y: 293 }
  },
  {
    id: 'darwin',
    name: 'Darwin',
    country: 'Australia',
    timezone: 'Australia/Darwin',
    coordinates: { x: 600, y: 280 }
  },
  {
    id: 'hobart',
    name: 'Hobart',
    country: 'Australia',
    timezone: 'Australia/Hobart',
    coordinates: { x: 625, y: 320 }
  },

  // Oceania - New Zealand & Pacific Islands
  {
    id: 'auckland',
    name: 'Auckland',
    country: 'New Zealand',
    timezone: 'Pacific/Auckland',
    coordinates: { x: 670, y: 320 }
  },
  {
    id: 'wellington',
    name: 'Wellington',
    country: 'New Zealand',
    timezone: 'Pacific/Auckland',
    coordinates: { x: 665, y: 325 }
  },
  {
    id: 'christchurch',
    name: 'Christchurch',
    country: 'New Zealand',
    timezone: 'Pacific/Auckland',
    coordinates: { x: 663, y: 330 }
  },
  {
    id: 'suva',
    name: 'Suva',
    country: 'Fiji',
    timezone: 'Pacific/Fiji',
    coordinates: { x: 680, y: 290 }
  },
  {
    id: 'portmoresby',
    name: 'Port Moresby',
    country: 'Papua New Guinea',
    timezone: 'Pacific/Port_Moresby',
    coordinates: { x: 620, y: 270 }
  },
  {
    id: 'honolulu',
    name: 'Honolulu',
    country: 'United States',
    timezone: 'Pacific/Honolulu',
    coordinates: { x: 70, y: 240 }
  },

  // Africa - North Africa
  {
    id: 'cairo',
    name: 'Cairo',
    country: 'Egypt',
    timezone: 'Africa/Cairo',
    coordinates: { x: 350, y: 230 }
  },
  {
    id: 'alexandria',
    name: 'Alexandria',
    country: 'Egypt',
    timezone: 'Africa/Cairo',
    coordinates: { x: 348, y: 228 }
  },
  {
    id: 'giza',
    name: 'Giza',
    country: 'Egypt',
    timezone: 'Africa/Cairo',
    coordinates: { x: 351, y: 231 }
  },
  {
    id: 'casablanca',
    name: 'Casablanca',
    country: 'Morocco',
    timezone: 'Africa/Casablanca',
    coordinates: { x: 280, y: 235 }
  },
  {
    id: 'marrakesh',
    name: 'Marrakesh',
    country: 'Morocco',
    timezone: 'Africa/Casablanca',
    coordinates: { x: 282, y: 237 }
  },
  {
    id: 'rabat',
    name: 'Rabat',
    country: 'Morocco',
    timezone: 'Africa/Casablanca',
    coordinates: { x: 279, y: 234 }
  },
  {
    id: 'tunis',
    name: 'Tunis',
    country: 'Tunisia',
    timezone: 'Africa/Tunis',
    coordinates: { x: 310, y: 225 }
  },
  {
    id: 'algiers',
    name: 'Algiers',
    country: 'Algeria',
    timezone: 'Africa/Algiers',
    coordinates: { x: 295, y: 230 }
  },
  {
    id: 'tripoli',
    name: 'Tripoli',
    country: 'Libya',
    timezone: 'Africa/Tripoli',
    coordinates: { x: 320, y: 235 }
  },
  {
    id: 'khartoum',
    name: 'Khartoum',
    country: 'Sudan',
    timezone: 'Africa/Khartoum',
    coordinates: { x: 350, y: 250 }
  },

  // Africa - West Africa
  {
    id: 'lagos',
    name: 'Lagos',
    country: 'Nigeria',
    timezone: 'Africa/Lagos',
    coordinates: { x: 300, y: 260 }
  },
  {
    id: 'abuja',
    name: 'Abuja',
    country: 'Nigeria',
    timezone: 'Africa/Lagos',
    coordinates: { x: 302, y: 258 }
  },
  {
    id: 'accra',
    name: 'Accra',
    country: 'Ghana',
    timezone: 'Africa/Accra',
    coordinates: { x: 295, y: 262 }
  },
  {
    id: 'dakar',
    name: 'Dakar',
    country: 'Senegal',
    timezone: 'Africa/Dakar',
    coordinates: { x: 275, y: 250 }
  },
  {
    id: 'abidjan',
    name: 'Abidjan',
    country: 'Ivory Coast',
    timezone: 'Africa/Abidjan',
    coordinates: { x: 290, y: 260 }
  },

  // Africa - East Africa
  {
    id: 'nairobi',
    name: 'Nairobi',
    country: 'Kenya',
    timezone: 'Africa/Nairobi',
    coordinates: { x: 340, y: 265 }
  },
  {
    id: 'mombasa',
    name: 'Mombasa',
    country: 'Kenya',
    timezone: 'Africa/Nairobi',
    coordinates: { x: 342, y: 267 }
  },
  {
    id: 'addisababa',
    name: 'Addis Ababa',
    country: 'Ethiopia',
    timezone: 'Africa/Addis_Ababa',
    coordinates: { x: 345, y: 255 }
  },
  {
    id: 'daressalaam',
    name: 'Dar es Salaam',
    country: 'Tanzania',
    timezone: 'Africa/Dar_es_Salaam',
    coordinates: { x: 345, y: 270 }
  },
  {
    id: 'kampala',
    name: 'Kampala',
    country: 'Uganda',
    timezone: 'Africa/Kampala',
    coordinates: { x: 340, y: 260 }
  },

  // Africa - Southern Africa
  {
    id: 'johannesburg',
    name: 'Johannesburg',
    country: 'South Africa',
    timezone: 'Africa/Johannesburg',
    coordinates: { x: 330, y: 290 }
  },
  {
    id: 'capetown',
    name: 'Cape Town',
    country: 'South Africa',
    timezone: 'Africa/Johannesburg',
    coordinates: { x: 320, y: 300 }
  },
  {
    id: 'durban',
    name: 'Durban',
    country: 'South Africa',
    timezone: 'Africa/Johannesburg',
    coordinates: { x: 335, y: 295 }
  },
  {
    id: 'pretoria',
    name: 'Pretoria',
    country: 'South Africa',
    timezone: 'Africa/Johannesburg',
    coordinates: { x: 332, y: 288 }
  },
  {
    id: 'harare',
    name: 'Harare',
    country: 'Zimbabwe',
    timezone: 'Africa/Harare',
    coordinates: { x: 335, y: 280 }
  },
  {
    id: 'lusaka',
    name: 'Lusaka',
    country: 'Zambia',
    timezone: 'Africa/Lusaka',
    coordinates: { x: 332, y: 275 }
  },
  {
    id: 'maputo',
    name: 'Maputo',
    country: 'Mozambique',
    timezone: 'Africa/Maputo',
    coordinates: { x: 338, y: 285 }
  },
  {
    id: 'luanda',
    name: 'Luanda',
    country: 'Angola',
    timezone: 'Africa/Luanda',
    coordinates: { x: 320, y: 270 }
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

// Get location based on user's timezone
export function getLocationByClientTimezone(): Location | null {
  try {
    // Get user's browser timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Look for exact timezone match
    const exactMatch = defaultLocations.find(loc => loc.timezone === userTimezone);
    if (exactMatch) {
      return exactMatch;
    }
    
    // If no exact match, look for region match
    // For example, if user is in 'America/Chicago', match any location with 'America/' prefix
    const regionPrefix = userTimezone.split('/')[0];
    const regionMatch = defaultLocations.find(loc => loc.timezone.startsWith(`${regionPrefix}/`));
    if (regionMatch) {
      return regionMatch;
    }
    
    // If no match found, return default location (New York)
    return defaultLocations.find(loc => loc.id === 'newyork') || defaultLocations[0];
  } catch (error) {
    console.error("Unable to get location based on timezone:", error);
    return defaultLocations.find(loc => loc.id === 'newyork') || defaultLocations[0];
  }
}
