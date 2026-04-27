export interface PairedDevice {
  id: string;      // BLE deviceId
  name: string;    // nome display (dal dispositivo)
  pin: number;     // PIN memorizzato per riconnessione
  alias?: string;  // nome personalizzato memorizzato solo nell'app
}
