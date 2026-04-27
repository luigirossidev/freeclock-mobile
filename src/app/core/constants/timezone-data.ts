/**
 * IANA to POSIX timezone conversion table for FreeClock ESP32.
 *
 * POSIX TZ format: STDoffset[DST[offset][,start[/time],end[/time]]]
 *
 * Key rules:
 *  - Offset sign is INVERTED vs normal convention: UTC-5 => "EST5", UTC+1 => "CET-1"
 *  - DST transitions use M(month).(week).(day) where week=5 means "last"
 *  - Default DST offset is 1 hour ahead of STD if omitted
 *  - Default transition time is 02:00 local if omitted
 *
 * Sources: IANA tz database, glibc POSIX TZ definitions, ESP-IDF documentation.
 */

export interface TimezoneEntry {
  iana: string;    // e.g. "Europe/Rome"
  posix: string;   // e.g. "CET-1CEST,M3.5.0,M10.5.0/3"
  label: string;   // e.g. "Roma" for display
  region: string;  // e.g. "Europe" for grouping
}

export const TIMEZONE_DATA: TimezoneEntry[] = [

  // =====================================================================
  // AFRICA
  // =====================================================================
  { iana: 'Africa/Abidjan',       posix: 'GMT0',                                          label: 'Abidjan',        region: 'Africa' },
  { iana: 'Africa/Accra',         posix: 'GMT0',                                          label: 'Accra',          region: 'Africa' },
  { iana: 'Africa/Addis_Ababa',   posix: 'EAT-3',                                        label: 'Addis Ababa',    region: 'Africa' },
  { iana: 'Africa/Algiers',       posix: 'CET-1',                                        label: 'Algiers',        region: 'Africa' },
  { iana: 'Africa/Cairo',         posix: 'EET-2',                                        label: 'Cairo',          region: 'Africa' },
  { iana: 'Africa/Casablanca',    posix: '<+01>-1',                                      label: 'Casablanca',     region: 'Africa' },
  { iana: 'Africa/Dar_es_Salaam', posix: 'EAT-3',                                        label: 'Dar es Salaam',  region: 'Africa' },
  { iana: 'Africa/Dakar',         posix: 'GMT0',                                          label: 'Dakar',          region: 'Africa' },
  { iana: 'Africa/Djibouti',      posix: 'EAT-3',                                        label: 'Djibouti',       region: 'Africa' },
  { iana: 'Africa/Douala',        posix: 'WAT-1',                                        label: 'Douala',         region: 'Africa' },
  { iana: 'Africa/Harare',        posix: 'CAT-2',                                        label: 'Harare',         region: 'Africa' },
  { iana: 'Africa/Johannesburg',  posix: 'SAST-2',                                       label: 'Johannesburg',   region: 'Africa' },
  { iana: 'Africa/Kampala',       posix: 'EAT-3',                                        label: 'Kampala',        region: 'Africa' },
  { iana: 'Africa/Khartoum',      posix: 'CAT-2',                                        label: 'Khartoum',       region: 'Africa' },
  { iana: 'Africa/Kinshasa',      posix: 'WAT-1',                                        label: 'Kinshasa',       region: 'Africa' },
  { iana: 'Africa/Lagos',         posix: 'WAT-1',                                        label: 'Lagos',          region: 'Africa' },
  { iana: 'Africa/Luanda',        posix: 'WAT-1',                                        label: 'Luanda',         region: 'Africa' },
  { iana: 'Africa/Maputo',        posix: 'CAT-2',                                        label: 'Maputo',         region: 'Africa' },
  { iana: 'Africa/Mogadishu',     posix: 'EAT-3',                                        label: 'Mogadishu',      region: 'Africa' },
  { iana: 'Africa/Monrovia',      posix: 'GMT0',                                          label: 'Monrovia',       region: 'Africa' },
  { iana: 'Africa/Nairobi',       posix: 'EAT-3',                                        label: 'Nairobi',        region: 'Africa' },
  { iana: 'Africa/Tripoli',       posix: 'EET-2',                                        label: 'Tripoli',        region: 'Africa' },
  { iana: 'Africa/Tunis',         posix: 'CET-1',                                        label: 'Tunis',          region: 'Africa' },
  { iana: 'Africa/Windhoek',      posix: 'CAT-2',                                        label: 'Windhoek',       region: 'Africa' },

  // =====================================================================
  // AMERICA
  // =====================================================================
  { iana: 'America/Anchorage',         posix: 'AKST9AKDT,M3.2.0,M11.1.0',               label: 'Anchorage',       region: 'America' },
  { iana: 'America/Araguaina',         posix: '<-03>3',                                   label: 'Araguaina',       region: 'America' },
  { iana: 'America/Argentina/Buenos_Aires', posix: '<-03>3',                              label: 'Buenos Aires',    region: 'America' },
  { iana: 'America/Argentina/Cordoba',  posix: '<-03>3',                                  label: 'Cordoba',         region: 'America' },
  { iana: 'America/Asuncion',          posix: '<-04>4<-03>,M10.1.0/0,M3.4.0/0',          label: 'Asuncion',        region: 'America' },
  { iana: 'America/Barbados',          posix: 'AST4',                                     label: 'Barbados',        region: 'America' },
  { iana: 'America/Belem',             posix: '<-03>3',                                   label: 'Belem',           region: 'America' },
  { iana: 'America/Bogota',            posix: '<-05>5',                                   label: 'Bogota',          region: 'America' },
  { iana: 'America/Caracas',           posix: '<-04>4',                                   label: 'Caracas',         region: 'America' },
  { iana: 'America/Cayenne',           posix: '<-03>3',                                   label: 'Cayenne',         region: 'America' },
  { iana: 'America/Chicago',           posix: 'CST6CDT,M3.2.0,M11.1.0',                  label: 'Chicago',         region: 'America' },
  { iana: 'America/Costa_Rica',        posix: 'CST6',                                     label: 'Costa Rica',      region: 'America' },
  { iana: 'America/Cuiaba',            posix: '<-04>4',                                   label: 'Cuiaba',          region: 'America' },
  { iana: 'America/Denver',            posix: 'MST7MDT,M3.2.0,M11.1.0',                  label: 'Denver',          region: 'America' },
  { iana: 'America/Edmonton',          posix: 'MST7MDT,M3.2.0,M11.1.0',                  label: 'Edmonton',        region: 'America' },
  { iana: 'America/El_Salvador',       posix: 'CST6',                                     label: 'El Salvador',     region: 'America' },
  { iana: 'America/Fortaleza',         posix: '<-03>3',                                   label: 'Fortaleza',       region: 'America' },
  { iana: 'America/Godthab',           posix: '<-02>2<-01>,M3.5.0/-1,M10.5.0/0',         label: 'Nuuk',            region: 'America' },
  { iana: 'America/Guatemala',         posix: 'CST6',                                     label: 'Guatemala',       region: 'America' },
  { iana: 'America/Guayaquil',         posix: '<-05>5',                                   label: 'Guayaquil',       region: 'America' },
  { iana: 'America/Halifax',           posix: 'AST4ADT,M3.2.0,M11.1.0',                  label: 'Halifax',         region: 'America' },
  { iana: 'America/Havana',            posix: 'CST5CDT,M3.2.0/0,M11.1.0/1',              label: 'Havana',          region: 'America' },
  { iana: 'America/Jamaica',           posix: 'EST5',                                     label: 'Jamaica',         region: 'America' },
  { iana: 'America/La_Paz',            posix: '<-04>4',                                   label: 'La Paz',          region: 'America' },
  { iana: 'America/Lima',              posix: '<-05>5',                                   label: 'Lima',            region: 'America' },
  { iana: 'America/Los_Angeles',       posix: 'PST8PDT,M3.2.0,M11.1.0',                  label: 'Los Angeles',     region: 'America' },
  { iana: 'America/Managua',           posix: 'CST6',                                     label: 'Managua',         region: 'America' },
  { iana: 'America/Manaus',            posix: '<-04>4',                                   label: 'Manaus',          region: 'America' },
  { iana: 'America/Martinique',        posix: 'AST4',                                     label: 'Martinique',      region: 'America' },
  { iana: 'America/Mexico_City',       posix: 'CST6',                                     label: 'Mexico City',     region: 'America' },
  { iana: 'America/Montevideo',        posix: '<-03>3',                                   label: 'Montevideo',      region: 'America' },
  { iana: 'America/New_York',          posix: 'EST5EDT,M3.2.0,M11.1.0',                  label: 'New York',        region: 'America' },
  { iana: 'America/Panama',            posix: 'EST5',                                     label: 'Panama',          region: 'America' },
  { iana: 'America/Paramaribo',        posix: '<-03>3',                                   label: 'Paramaribo',      region: 'America' },
  { iana: 'America/Phoenix',           posix: 'MST7',                                     label: 'Phoenix',         region: 'America' },
  { iana: 'America/Port-au-Prince',    posix: 'EST5EDT,M3.2.0,M11.1.0',                  label: 'Port-au-Prince',  region: 'America' },
  { iana: 'America/Port_of_Spain',     posix: 'AST4',                                     label: 'Port of Spain',   region: 'America' },
  { iana: 'America/Puerto_Rico',       posix: 'AST4',                                     label: 'Puerto Rico',     region: 'America' },
  { iana: 'America/Regina',            posix: 'CST6',                                     label: 'Regina',          region: 'America' },
  { iana: 'America/Santiago',          posix: '<-04>4<-03>,M9.1.6/24,M4.1.6/24',         label: 'Santiago',         region: 'America' },
  { iana: 'America/Santo_Domingo',     posix: 'AST4',                                     label: 'Santo Domingo',   region: 'America' },
  { iana: 'America/Sao_Paulo',         posix: '<-03>3',                                   label: 'Sao Paulo',       region: 'America' },
  { iana: 'America/St_Johns',          posix: 'NST3:30NDT,M3.2.0,M11.1.0',               label: 'St. Johns',       region: 'America' },
  { iana: 'America/Tegucigalpa',       posix: 'CST6',                                     label: 'Tegucigalpa',     region: 'America' },
  { iana: 'America/Tijuana',           posix: 'PST8PDT,M3.2.0,M11.1.0',                  label: 'Tijuana',          region: 'America' },
  { iana: 'America/Toronto',           posix: 'EST5EDT,M3.2.0,M11.1.0',                  label: 'Toronto',          region: 'America' },
  { iana: 'America/Vancouver',         posix: 'PST8PDT,M3.2.0,M11.1.0',                  label: 'Vancouver',        region: 'America' },
  { iana: 'America/Winnipeg',          posix: 'CST6CDT,M3.2.0,M11.1.0',                  label: 'Winnipeg',         region: 'America' },

  // =====================================================================
  // ASIA
  // =====================================================================
  { iana: 'Asia/Almaty',          posix: '<+05>-5',                                       label: 'Almaty',          region: 'Asia' },
  { iana: 'Asia/Amman',           posix: '<+03>-3',                                       label: 'Amman',           region: 'Asia' },
  { iana: 'Asia/Ashgabat',        posix: '<+05>-5',                                       label: 'Ashgabat',        region: 'Asia' },
  { iana: 'Asia/Baghdad',         posix: '<+03>-3',                                       label: 'Baghdad',         region: 'Asia' },
  { iana: 'Asia/Bahrain',         posix: '<+03>-3',                                       label: 'Bahrain',         region: 'Asia' },
  { iana: 'Asia/Baku',            posix: '<+04>-4',                                       label: 'Baku',            region: 'Asia' },
  { iana: 'Asia/Bangkok',         posix: '<+07>-7',                                       label: 'Bangkok',         region: 'Asia' },
  { iana: 'Asia/Beirut',          posix: 'EET-2EEST,M3.5.0/0,M10.5.0/0',                label: 'Beirut',          region: 'Asia' },
  { iana: 'Asia/Bishkek',         posix: '<+06>-6',                                       label: 'Bishkek',         region: 'Asia' },
  { iana: 'Asia/Colombo',         posix: '<+0530>-5:30',                                  label: 'Colombo',         region: 'Asia' },
  { iana: 'Asia/Damascus',        posix: '<+03>-3',                                       label: 'Damascus',        region: 'Asia' },
  { iana: 'Asia/Dhaka',           posix: '<+06>-6',                                       label: 'Dhaka',           region: 'Asia' },
  { iana: 'Asia/Dubai',           posix: '<+04>-4',                                       label: 'Dubai',           region: 'Asia' },
  { iana: 'Asia/Dushanbe',        posix: '<+05>-5',                                       label: 'Dushanbe',        region: 'Asia' },
  { iana: 'Asia/Ho_Chi_Minh',     posix: '<+07>-7',                                       label: 'Ho Chi Minh',     region: 'Asia' },
  { iana: 'Asia/Hong_Kong',       posix: 'HKT-8',                                         label: 'Hong Kong',       region: 'Asia' },
  { iana: 'Asia/Irkutsk',         posix: '<+08>-8',                                       label: 'Irkutsk',         region: 'Asia' },
  { iana: 'Asia/Jakarta',         posix: 'WIB-7',                                         label: 'Jakarta',         region: 'Asia' },
  { iana: 'Asia/Jerusalem',       posix: 'IST-2IDT,M3.4.4/26,M10.5.0',                  label: 'Jerusalem',       region: 'Asia' },
  { iana: 'Asia/Kabul',           posix: '<+0430>-4:30',                                  label: 'Kabul',           region: 'Asia' },
  { iana: 'Asia/Kamchatka',       posix: '<+12>-12',                                      label: 'Kamchatka',       region: 'Asia' },
  { iana: 'Asia/Karachi',         posix: 'PKT-5',                                         label: 'Karachi',         region: 'Asia' },
  { iana: 'Asia/Kathmandu',       posix: '<+0545>-5:45',                                  label: 'Kathmandu',       region: 'Asia' },
  { iana: 'Asia/Kolkata',         posix: 'IST-5:30',                                      label: 'Kolkata',         region: 'Asia' },
  { iana: 'Asia/Krasnoyarsk',     posix: '<+07>-7',                                       label: 'Krasnoyarsk',     region: 'Asia' },
  { iana: 'Asia/Kuala_Lumpur',    posix: '<+08>-8',                                       label: 'Kuala Lumpur',    region: 'Asia' },
  { iana: 'Asia/Kuwait',          posix: '<+03>-3',                                       label: 'Kuwait',          region: 'Asia' },
  { iana: 'Asia/Macau',           posix: 'CST-8',                                         label: 'Macau',           region: 'Asia' },
  { iana: 'Asia/Manila',          posix: 'PST-8',                                         label: 'Manila',          region: 'Asia' },
  { iana: 'Asia/Muscat',          posix: '<+04>-4',                                       label: 'Muscat',          region: 'Asia' },
  { iana: 'Asia/Novosibirsk',     posix: '<+07>-7',                                       label: 'Novosibirsk',     region: 'Asia' },
  { iana: 'Asia/Omsk',            posix: '<+06>-6',                                       label: 'Omsk',            region: 'Asia' },
  { iana: 'Asia/Phnom_Penh',      posix: '<+07>-7',                                       label: 'Phnom Penh',      region: 'Asia' },
  { iana: 'Asia/Qatar',           posix: '<+03>-3',                                       label: 'Qatar',           region: 'Asia' },
  { iana: 'Asia/Riyadh',          posix: '<+03>-3',                                       label: 'Riyadh',          region: 'Asia' },
  { iana: 'Asia/Seoul',           posix: 'KST-9',                                         label: 'Seoul',           region: 'Asia' },
  { iana: 'Asia/Shanghai',        posix: 'CST-8',                                         label: 'Shanghai',        region: 'Asia' },
  { iana: 'Asia/Singapore',       posix: '<+08>-8',                                       label: 'Singapore',       region: 'Asia' },
  { iana: 'Asia/Taipei',          posix: 'CST-8',                                         label: 'Taipei',          region: 'Asia' },
  { iana: 'Asia/Tashkent',        posix: '<+05>-5',                                       label: 'Tashkent',        region: 'Asia' },
  { iana: 'Asia/Tbilisi',         posix: '<+04>-4',                                       label: 'Tbilisi',         region: 'Asia' },
  { iana: 'Asia/Tehran',          posix: '<+0330>-3:30',                                  label: 'Tehran',          region: 'Asia' },
  { iana: 'Asia/Tokyo',           posix: 'JST-9',                                         label: 'Tokyo',           region: 'Asia' },
  { iana: 'Asia/Ulaanbaatar',     posix: '<+08>-8',                                       label: 'Ulaanbaatar',     region: 'Asia' },
  { iana: 'Asia/Vladivostok',     posix: '<+10>-10',                                      label: 'Vladivostok',     region: 'Asia' },
  { iana: 'Asia/Yakutsk',         posix: '<+09>-9',                                       label: 'Yakutsk',         region: 'Asia' },
  { iana: 'Asia/Yangon',          posix: '<+0630>-6:30',                                  label: 'Yangon',          region: 'Asia' },
  { iana: 'Asia/Yekaterinburg',   posix: '<+05>-5',                                       label: 'Yekaterinburg',   region: 'Asia' },
  { iana: 'Asia/Yerevan',         posix: '<+04>-4',                                       label: 'Yerevan',         region: 'Asia' },

  // =====================================================================
  // AUSTRALIA
  // =====================================================================
  { iana: 'Australia/Adelaide',    posix: 'ACST-9:30ACDT,M10.1.0,M4.1.0/3',              label: 'Adelaide',         region: 'Australia' },
  { iana: 'Australia/Brisbane',    posix: 'AEST-10',                                      label: 'Brisbane',         region: 'Australia' },
  { iana: 'Australia/Broken_Hill', posix: 'ACST-9:30ACDT,M10.1.0,M4.1.0/3',              label: 'Broken Hill',      region: 'Australia' },
  { iana: 'Australia/Darwin',      posix: 'ACST-9:30',                                    label: 'Darwin',           region: 'Australia' },
  { iana: 'Australia/Eucla',       posix: '<+0845>-8:45',                                 label: 'Eucla',            region: 'Australia' },
  { iana: 'Australia/Hobart',      posix: 'AEST-10AEDT,M10.1.0,M4.1.0/3',                label: 'Hobart',           region: 'Australia' },
  { iana: 'Australia/Lord_Howe',   posix: '<+1030>-10:30<+11>-11,M10.1.0,M4.1.0',        label: 'Lord Howe',        region: 'Australia' },
  { iana: 'Australia/Melbourne',   posix: 'AEST-10AEDT,M10.1.0,M4.1.0/3',                label: 'Melbourne',        region: 'Australia' },
  { iana: 'Australia/Perth',       posix: 'AWST-8',                                       label: 'Perth',            region: 'Australia' },
  { iana: 'Australia/Sydney',      posix: 'AEST-10AEDT,M10.1.0,M4.1.0/3',                label: 'Sydney',           region: 'Australia' },

  // =====================================================================
  // EUROPE
  // =====================================================================
  { iana: 'Europe/Amsterdam',      posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Amsterdam',        region: 'Europe' },
  { iana: 'Europe/Athens',         posix: 'EET-2EEST,M3.5.0/3,M10.5.0/4',               label: 'Athens',           region: 'Europe' },
  { iana: 'Europe/Belgrade',       posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Belgrade',         region: 'Europe' },
  { iana: 'Europe/Berlin',         posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Berlin',           region: 'Europe' },
  { iana: 'Europe/Bratislava',     posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Bratislava',       region: 'Europe' },
  { iana: 'Europe/Brussels',       posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Brussels',         region: 'Europe' },
  { iana: 'Europe/Bucharest',      posix: 'EET-2EEST,M3.5.0/3,M10.5.0/4',               label: 'Bucharest',        region: 'Europe' },
  { iana: 'Europe/Budapest',       posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Budapest',         region: 'Europe' },
  { iana: 'Europe/Chisinau',       posix: 'EET-2EEST,M3.5.0,M10.5.0/3',                 label: 'Chisinau',         region: 'Europe' },
  { iana: 'Europe/Copenhagen',     posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Copenhagen',       region: 'Europe' },
  { iana: 'Europe/Dublin',         posix: 'IST-1GMT0,M10.5.0,M3.5.0/1',                 label: 'Dublin',           region: 'Europe' },
  { iana: 'Europe/Helsinki',       posix: 'EET-2EEST,M3.5.0/3,M10.5.0/4',               label: 'Helsinki',         region: 'Europe' },
  { iana: 'Europe/Istanbul',       posix: '<+03>-3',                                      label: 'Istanbul',         region: 'Europe' },
  { iana: 'Europe/Kaliningrad',    posix: 'EET-2',                                        label: 'Kaliningrad',      region: 'Europe' },
  { iana: 'Europe/Kyiv',           posix: 'EET-2EEST,M3.5.0/3,M10.5.0/4',               label: 'Kyiv',             region: 'Europe' },
  { iana: 'Europe/Lisbon',         posix: 'WET0WEST,M3.5.0/1,M10.5.0',                  label: 'Lisbon',           region: 'Europe' },
  { iana: 'Europe/Ljubljana',      posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Ljubljana',        region: 'Europe' },
  { iana: 'Europe/London',         posix: 'GMT0BST,M3.5.0/1,M10.5.0',                   label: 'London',           region: 'Europe' },
  { iana: 'Europe/Luxembourg',     posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Luxembourg',       region: 'Europe' },
  { iana: 'Europe/Madrid',         posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Madrid',           region: 'Europe' },
  { iana: 'Europe/Malta',          posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Malta',            region: 'Europe' },
  { iana: 'Europe/Minsk',          posix: '<+03>-3',                                      label: 'Minsk',            region: 'Europe' },
  { iana: 'Europe/Monaco',         posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Monaco',           region: 'Europe' },
  { iana: 'Europe/Moscow',         posix: 'MSK-3',                                        label: 'Moscow',           region: 'Europe' },
  { iana: 'Europe/Oslo',           posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Oslo',             region: 'Europe' },
  { iana: 'Europe/Paris',          posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Paris',            region: 'Europe' },
  { iana: 'Europe/Prague',         posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Prague',           region: 'Europe' },
  { iana: 'Europe/Riga',           posix: 'EET-2EEST,M3.5.0/3,M10.5.0/4',               label: 'Riga',             region: 'Europe' },
  { iana: 'Europe/Rome',           posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Rome',             region: 'Europe' },
  { iana: 'Europe/Samara',         posix: '<+04>-4',                                      label: 'Samara',           region: 'Europe' },
  { iana: 'Europe/Sarajevo',       posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Sarajevo',         region: 'Europe' },
  { iana: 'Europe/Sofia',          posix: 'EET-2EEST,M3.5.0/3,M10.5.0/4',               label: 'Sofia',            region: 'Europe' },
  { iana: 'Europe/Stockholm',      posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Stockholm',        region: 'Europe' },
  { iana: 'Europe/Tallinn',        posix: 'EET-2EEST,M3.5.0/3,M10.5.0/4',               label: 'Tallinn',          region: 'Europe' },
  { iana: 'Europe/Tirane',         posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Tirane',           region: 'Europe' },
  { iana: 'Europe/Vienna',         posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Vienna',           region: 'Europe' },
  { iana: 'Europe/Vilnius',        posix: 'EET-2EEST,M3.5.0/3,M10.5.0/4',               label: 'Vilnius',          region: 'Europe' },
  { iana: 'Europe/Volgograd',      posix: 'MSK-3',                                        label: 'Volgograd',        region: 'Europe' },
  { iana: 'Europe/Warsaw',         posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Warsaw',           region: 'Europe' },
  { iana: 'Europe/Zagreb',         posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Zagreb',           region: 'Europe' },
  { iana: 'Europe/Zurich',         posix: 'CET-1CEST,M3.5.0,M10.5.0/3',                 label: 'Zurich',           region: 'Europe' },

  // =====================================================================
  // PACIFIC
  // =====================================================================
  { iana: 'Pacific/Apia',          posix: '<+13>-13',                                     label: 'Apia',             region: 'Pacific' },
  { iana: 'Pacific/Auckland',      posix: 'NZST-12NZDT,M9.5.0,M4.1.0/3',                label: 'Auckland',         region: 'Pacific' },
  { iana: 'Pacific/Chatham',       posix: '<+1245>-12:45<+1345>,M9.5.0/2:45,M4.1.0/3:45', label: 'Chatham',        region: 'Pacific' },
  { iana: 'Pacific/Easter',        posix: '<-06>6<-05>,M9.1.6/22,M4.1.6/22',             label: 'Easter Island',    region: 'Pacific' },
  { iana: 'Pacific/Fiji',          posix: '<+12>-12',                                     label: 'Fiji',             region: 'Pacific' },
  { iana: 'Pacific/Guam',          posix: 'ChST-10',                                      label: 'Guam',             region: 'Pacific' },
  { iana: 'Pacific/Honolulu',      posix: 'HST10',                                        label: 'Honolulu',         region: 'Pacific' },
  { iana: 'Pacific/Kiritimati',    posix: '<+14>-14',                                     label: 'Kiritimati',       region: 'Pacific' },
  { iana: 'Pacific/Noumea',        posix: '<+11>-11',                                     label: 'Noumea',           region: 'Pacific' },
  { iana: 'Pacific/Pago_Pago',     posix: 'SST11',                                        label: 'Pago Pago',        region: 'Pacific' },
  { iana: 'Pacific/Port_Moresby',  posix: '<+10>-10',                                     label: 'Port Moresby',     region: 'Pacific' },
  { iana: 'Pacific/Tahiti',        posix: '<-10>10',                                      label: 'Tahiti',           region: 'Pacific' },
  { iana: 'Pacific/Tongatapu',     posix: '<+13>-13',                                     label: 'Tongatapu',        region: 'Pacific' },

  // =====================================================================
  // OTHER / SPECIAL
  // =====================================================================
  { iana: 'Atlantic/Azores',       posix: '<-01>1<+00>,M3.5.0/0,M10.5.0/1',              label: 'Azores',           region: 'Atlantic' },
  { iana: 'Atlantic/Cape_Verde',   posix: '<-01>1',                                       label: 'Cape Verde',       region: 'Atlantic' },
  { iana: 'Atlantic/Reykjavik',    posix: 'GMT0',                                          label: 'Reykjavik',        region: 'Atlantic' },
  { iana: 'Atlantic/South_Georgia', posix: '<-02>2',                                      label: 'South Georgia',    region: 'Atlantic' },
  { iana: 'Indian/Maldives',       posix: '<+05>-5',                                      label: 'Maldives',         region: 'Indian' },
  { iana: 'Indian/Mauritius',      posix: '<+04>-4',                                      label: 'Mauritius',        region: 'Indian' },
  { iana: 'Indian/Reunion',        posix: '<+04>-4',                                      label: 'Reunion',          region: 'Indian' },
  { iana: 'Etc/UTC',               posix: 'UTC0',                                         label: 'UTC',              region: 'Other' },
];
