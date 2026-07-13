export interface WifiConfig {
  ssid: string;
  pass: string;
}

export interface WifiNetwork {
  s: string;  // SSID
  r: number;  // RSSI (dBm)
  e: string;  // Encryption: OPEN, WEP, WPA, WPA2, WPA_WPA2, WPA2_ENT, WPA3
}

export interface WifiScanResult {
  n: WifiNetwork[];
}

export interface GeneralConfig {
  clk: boolean;
  clkAS: boolean;
  cal: boolean;
  calAS: boolean;
  wea: boolean;
  weaAS: boolean;
  news: boolean;
  newsAS: boolean;
  brand: boolean;
  brandAS: boolean;
  quote: boolean;
  quoteAS: boolean;
  quiz: boolean;
  quizAS: boolean;
  refresh: number;
}

export interface TimeWeatherConfig {
  tz: string;       // POSIX timezone string
  h24: boolean;
  pm: boolean;
  flash: boolean;
  wKey: string;
  city: number;
  sCity: boolean;
  sCond: boolean;
  sHum: boolean;
  sWind: boolean;
  sWDir: boolean;
  sPress: boolean;
  sHL: boolean;
  metric: boolean;
}

export interface NewsConfig {
  key: string;
  src: string;
}

export interface BrandConfig {
  text: string;
}

export interface QuoteQuizConfig {
  quoteUrl: string;
  quizUrl: string;
  quizHour: number;
  quote?: boolean;  // solo Oraquadra: abilita frase del giorno
  quiz?: boolean;   // solo Oraquadra: abilita indovinello del giorno
}

export interface DisplayConfig {
  bright: number;   // 0-15
  speed: number;    // ms per frame
  scroll: number;   // minutes between scroll
  on: string;       // HH:MM
  off: string;      // HH:MM
}

// ==================== Oraquadra (deviceType 'oraquadra') ====================

// Orologio a parole: preset effetto, colore, luminosita' e fasce orarie
export interface OqClockConfig {
  preset: number;        // 0-18
  blink: boolean;        // lampeggio secondi sulla lettera E
  color: string;         // hex RRGGBB (senza #)
  rainbow: boolean;      // colore arcobaleno per il testo
  power: boolean;        // display acceso
  dayBright: number;     // 0-100
  nightBright: number;   // 0-100
  dayStart: string;      // HH:MM inizio fascia giorno
  nightStart: string;    // HH:MM inizio fascia sera
  sleepStart: string;    // HH:MM spegnimento notturno
  sleepEnabled: boolean;
}

// Testo scorrevole
export interface OqScrollConfig {
  enabled: boolean;
  text: string;          // max 200 caratteri ASCII
  color: string;         // hex RRGGBB (senza #)
  rainbow: boolean;
  speed: number;         // ms tra i frame (10-500)
  fontSize: number;      // 1=piccolo, 2=medio, 3=grande
  pause: number;         // secondi di pausa tra i passaggi (0-60)
  showText: boolean;
  showDate: boolean;
  showTime: boolean;
  textual: boolean;      // data/ora in formato testuale
  showPreset: boolean;   // mostra il preset durante la pausa
}

// Quadrante digitale alternato agli effetti
export interface OqDigitalConfig {
  enabled: boolean;
  interval: number;      // secondi tra le apparizioni (5-120)
  duration: number;      // secondi di permanenza (10-59)
}

// Characteristic TIMEWEATHER su Oraquadra: solo timezone
export interface OqTimeConfig {
  tz: string;            // stringa POSIX
}

export interface DeviceStatus {
  fw: string;
  fwCode: number;
  serverUrl: string;
  deviceType: string;
  wifi: boolean;
  ip: string;
  heap: number;
  ssid: string;
}

export interface MelodyItem {
  i: number;  // id
  n: string;  // name
}

export interface MelodyRequest {
  id: number;
  msg: string;
  rep: number;
}

export type DeviceCommandType = 'save' | 'reboot' | 'factory_reset' | 'wifi_reconnect' | 'wifi_scan' | 'ota_update';

export interface DeviceCommand {
  cmd: DeviceCommandType;
}
