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
}

export interface DisplayConfig {
  bright: number;   // 0-15
  speed: number;    // ms per frame
  scroll: number;   // minutes between scroll
  on: string;       // HH:MM
  off: string;      // HH:MM
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
