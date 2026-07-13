export interface PairedDevice {
  id: string;           // BLE deviceId
  name: string;         // nome display (dal dispositivo)
  pin: number;          // PIN memorizzato per riconnessione
  alias?: string;       // nome personalizzato memorizzato solo nell'app
  deviceType?: string;  // 'esp32dev', 'nodemcu-32s', 'oraquadra', ... (dalla characteristic STATUS)
}
