import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BleClient, BleDevice, dataViewToText, textToDataView, numberToUUID } from '@capacitor-community/bluetooth-le';
import {
  BLE_SERVICE_UUID, BLE_DEVICE_NAME_PREFIX,
  CHAR_WIFI_UUID, CHAR_WIFI_SCAN_UUID, CHAR_STATUS_UUID, CHAR_COMMAND_UUID, CHAR_AUTH_UUID,
} from '../constants/ble-uuids';
import { DeviceStatus, WifiScanResult, DeviceCommandType } from '../models/device-config.model';

export type BleConnectionState = 'disconnected' | 'scanning' | 'connecting' | 'connected' | 'reconnecting';

@Injectable({ providedIn: 'root' })
export class BleService {

  readonly connectionState$ = new BehaviorSubject<BleConnectionState>('disconnected');
  readonly connectedDeviceId$ = new BehaviorSubject<string | null>(null);
  readonly deviceStatus$ = new Subject<DeviceStatus>();
  readonly wifiScanResults$ = new Subject<WifiScanResult>();
  readonly reconnectFailed$ = new Subject<void>();
  readonly authenticated$ = new BehaviorSubject<boolean>(false);

  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT = 3;
  private intentionalDisconnect = false;
  private lastConnectedDeviceId: string | null = null;
  private lastPin: number | null = null;

  constructor(private ngZone: NgZone) {}

  async initialize(): Promise<void> {
    await BleClient.initialize({ androidNeverForLocation: false });
  }

  async scanForDevices(timeoutMs = 10000): Promise<BleDevice[]> {
    this.connectionState$.next('scanning');
    const devices: BleDevice[] = [];

    await BleClient.requestLEScan(
      { services: [BLE_SERVICE_UUID] },
      (result) => {
        this.ngZone.run(() => {
          const name = result.device.name || result.localName || '';
          if (name.startsWith(BLE_DEVICE_NAME_PREFIX)) {
            const exists = devices.find(d => d.deviceId === result.device.deviceId);
            if (!exists) {
              devices.push(result.device);
            }
          }
        });
      }
    );

    await new Promise(resolve => setTimeout(resolve, timeoutMs));
    await BleClient.stopLEScan();
    this.connectionState$.next('disconnected');
    return devices;
  }

  async connect(deviceId: string): Promise<void> {
    this.connectionState$.next('connecting');
    this.intentionalDisconnect = false;

    try {
      await BleClient.connect(deviceId, () => {
        this.ngZone.run(() => this.onDisconnect(deviceId));
      });

      // Request high MTU for JSON payloads (Android only)
      try {
        await (BleClient as any).requestMtu?.(deviceId, 517);
      } catch {
        // iOS doesn't support requestMtu, ignore
      }

      // Start notifications
      await this.startNotifications(deviceId);

      this.connectedDeviceId$.next(deviceId);
      this.connectionState$.next('connected');
      this.reconnectAttempts = 0;
      this.lastConnectedDeviceId = deviceId;
    } catch (error) {
      this.connectionState$.next('disconnected');
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.intentionalDisconnect = true;
    const deviceId = this.connectedDeviceId$.value;
    if (deviceId) {
      try {
        await BleClient.disconnect(deviceId);
      } catch {
        // Already disconnected
      }
    }
    this.connectedDeviceId$.next(null);
    this.connectionState$.next('disconnected');
    this.authenticated$.next(false);
  }

  async authenticate(pin: number): Promise<boolean> {
    await this.writeCharacteristic(CHAR_AUTH_UUID, { pin });
    const result = await this.readCharacteristic<{ auth: boolean }>(CHAR_AUTH_UUID);
    this.authenticated$.next(result.auth);
    if (result.auth) this.lastPin = pin;
    return result.auth;
  }

  async ensureConnected(): Promise<void> {
    const deviceId = this.connectedDeviceId$.value;

    if (deviceId) {
      // Connessione apparentemente attiva: verifica con una read leggera
      try {
        await BleClient.read(deviceId, BLE_SERVICE_UUID, CHAR_STATUS_UUID);
        return; // connessione viva
      } catch {
        // connessione morta, pulizia stato
        this.connectedDeviceId$.next(null);
        this.authenticated$.next(false);
        try { await BleClient.disconnect(deviceId); } catch { /* già disconnesso */ }
      }
    }

    // Riconnessione
    const targetId = deviceId ?? this.lastConnectedDeviceId;
    if (!targetId) throw new Error('No device to reconnect to');

    this.connectionState$.next('reconnecting');
    await this.connect(targetId);

    if (this.lastPin != null) {
      await this.authenticate(this.lastPin);
    }
  }

  async readCharacteristic<T>(charUuid: string): Promise<T> {
    const deviceId = this.getDeviceIdOrThrow();
    const result = await BleClient.read(deviceId, BLE_SERVICE_UUID, charUuid);
    const json = dataViewToText(result);
    return JSON.parse(json) as T;
  }

  async writeCharacteristic(charUuid: string, data: object): Promise<void> {
    const deviceId = this.getDeviceIdOrThrow();
    const dataView = textToDataView(JSON.stringify(data));
    await BleClient.write(deviceId, BLE_SERVICE_UUID, charUuid, dataView);
  }

  async sendCommand(cmd: DeviceCommandType): Promise<void> {
    await this.writeCharacteristic(CHAR_COMMAND_UUID, { cmd });
  }

  async writeWifiConfig(ssid: string, pass: string): Promise<void> {
    await this.writeCharacteristic(CHAR_WIFI_UUID, { ssid, pass });
  }

  async triggerWifiScan(): Promise<void> {
    await this.sendCommand('wifi_scan');
  }

  // --- Private ---

  private getDeviceIdOrThrow(): string {
    const id = this.connectedDeviceId$.value;
    if (!id) throw new Error('Not connected to any device');
    return id;
  }

  private async startNotifications(deviceId: string): Promise<void> {
    // Status notifications (every 10s from ESP32)
    await BleClient.startNotifications(deviceId, BLE_SERVICE_UUID, CHAR_STATUS_UUID, (value) => {
      this.ngZone.run(() => {
        try {
          const json = dataViewToText(value);
          this.deviceStatus$.next(JSON.parse(json));
        } catch { /* ignore malformed */ }
      });
    });

    // WiFi scan result notifications
    await BleClient.startNotifications(deviceId, BLE_SERVICE_UUID, CHAR_WIFI_SCAN_UUID, (value) => {
      this.ngZone.run(() => {
        try {
          const json = dataViewToText(value);
          this.wifiScanResults$.next(JSON.parse(json));
        } catch { /* ignore malformed */ }
      });
    });
  }

  private async onDisconnect(deviceId: string): Promise<void> {
    this.connectedDeviceId$.next(null);
    this.authenticated$.next(false);

    // Don't auto-reconnect if user disconnected intentionally
    if (this.intentionalDisconnect) {
      this.connectionState$.next('disconnected');
      return;
    }

    // Auto-retry with exponential backoff
    if (this.reconnectAttempts < this.MAX_RECONNECT) {
      this.connectionState$.next('reconnecting');
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts - 1) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));

      try {
        await this.connect(deviceId);
      } catch {
        if (this.reconnectAttempts >= this.MAX_RECONNECT) {
          this.connectionState$.next('disconnected');
          this.reconnectFailed$.next();
        }
      }
    } else {
      this.connectionState$.next('disconnected');
      this.reconnectFailed$.next();
    }
  }
}
