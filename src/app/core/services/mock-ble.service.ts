import { Injectable, NgZone } from '@angular/core';
import { BleDevice } from '@capacitor-community/bluetooth-le';
import {
  GeneralConfig, TimeWeatherConfig, NewsConfig, BrandConfig,
  QuoteQuizConfig, DisplayConfig, WifiConfig,
} from '../models/device-config.model';
import {
  CHAR_GENERAL_UUID, CHAR_TIMEWEATHER_UUID, CHAR_NEWS_UUID,
  CHAR_BRAND_UUID, CHAR_QUOTEQUIZ_UUID, CHAR_DISPLAY_UUID,
  CHAR_WIFI_UUID,
} from '../constants/ble-uuids';
import { BleService } from './ble.service';

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

@Injectable()
export class MockBleService extends BleService {

  constructor(ngZone: NgZone) {
    super(ngZone);
  }

  override async initialize(): Promise<void> {}

  override async scanForDevices(_timeoutMs = 10000): Promise<BleDevice[]> {
    this.connectionState$.next('scanning');
    await delay(2000);
    this.connectionState$.next('disconnected');
    return [{ deviceId: 'mock-device-001', name: 'FreeClock-Demo' }];
  }

  override async connect(deviceId: string): Promise<void> {
    this.connectionState$.next('connecting');
    await delay(1000);
    this.connectedDeviceId$.next(deviceId);
    this.connectionState$.next('connected');
  }

  override async disconnect(): Promise<void> {
    this.connectedDeviceId$.next(null);
    this.connectionState$.next('disconnected');
    this.authenticated$.next(false);
  }

  override async authenticate(_pin: number): Promise<boolean> {
    await delay(600);
    this.authenticated$.next(true);
    return true;
  }

  override async readCharacteristic<T>(charUuid: string): Promise<T> {
    await delay(100);
    return this.getMockConfig(charUuid) as T;
  }

  override async writeCharacteristic(_charUuid: string, _data: object): Promise<void> {
    await delay(100);
  }

  override async triggerWifiScan(): Promise<void> {
    setTimeout(() => {
      this.wifiScanResults$.next({
        n: [
          { s: 'HomeNetwork-5G', r: -42, e: 'WPA2' },
          { s: 'Office_WiFi', r: -61, e: 'WPA2' },
          { s: 'GuestOpen', r: -78, e: 'OPEN' },
        ],
      });
    }, 2000);
  }

  override async writeWifiConfig(ssid: string, _pass: string): Promise<void> {
    setTimeout(() => {
      this.deviceStatus$.next({
        fw: '1.0.0-mock', fwCode: 1, serverUrl: 'https://freeclock.matesemakers.it', deviceType: 'esp32dev',
        wifi: true, ip: '192.168.1.100', heap: 210000, ssid,
      });
    }, 2000);
  }

  private getMockConfig(charUuid: string): unknown {
    switch (charUuid) {
      case CHAR_GENERAL_UUID:
        return {
          clk: true, clkAS: false, cal: true, calAS: false,
          wea: true, weaAS: false, news: false, newsAS: false,
          brand: false, brandAS: false, quote: false, quoteAS: false,
          quiz: false, quizAS: false, refresh: 30,
        } satisfies GeneralConfig;
      case CHAR_TIMEWEATHER_UUID:
        return {
          tz: 'CET-1CEST,M3.5.0,M10.5.0/3', h24: true, pm: false, flash: true,
          wKey: '', city: 0, sCity: true, sCond: true, sHum: true,
          sWind: false, sWDir: false, sPress: false, sHL: false, metric: true,
        } satisfies TimeWeatherConfig;
      case CHAR_NEWS_UUID:
        return { key: '', src: '' } satisfies NewsConfig;
      case CHAR_BRAND_UUID:
        return { text: 'FreeClock Demo' } satisfies BrandConfig;
      case CHAR_QUOTEQUIZ_UUID:
        return { quoteUrl: '', quizUrl: '', quizHour: 9 } satisfies QuoteQuizConfig;
      case CHAR_DISPLAY_UUID:
        return { bright: 8, speed: 50, scroll: 5, on: '07:00', off: '23:00' } satisfies DisplayConfig;
      case CHAR_WIFI_UUID:
        return { ssid: 'HomeNetwork', pass: '********' } satisfies WifiConfig;
      default:
        return {};
    }
  }
}
