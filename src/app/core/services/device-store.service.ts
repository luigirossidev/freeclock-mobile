import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BleService } from './ble.service';
import {
  GeneralConfig, TimeWeatherConfig, NewsConfig, BrandConfig,
  QuoteQuizConfig, DisplayConfig, DeviceStatus, WifiConfig, MelodyRequest,
} from '../models/device-config.model';
import {
  CHAR_GENERAL_UUID, CHAR_TIMEWEATHER_UUID, CHAR_NEWS_UUID,
  CHAR_BRAND_UUID, CHAR_QUOTEQUIZ_UUID, CHAR_DISPLAY_UUID,
  CHAR_WIFI_UUID, CHAR_MELODY_UUID,
} from '../constants/ble-uuids';

@Injectable({ providedIn: 'root' })
export class DeviceStoreService {

  readonly general$ = new BehaviorSubject<GeneralConfig | null>(null);
  readonly timeWeather$ = new BehaviorSubject<TimeWeatherConfig | null>(null);
  readonly news$ = new BehaviorSubject<NewsConfig | null>(null);
  readonly brand$ = new BehaviorSubject<BrandConfig | null>(null);
  readonly quoteQuiz$ = new BehaviorSubject<QuoteQuizConfig | null>(null);
  readonly display$ = new BehaviorSubject<DisplayConfig | null>(null);
  readonly wifi$ = new BehaviorSubject<WifiConfig | null>(null);
  readonly status$ = new BehaviorSubject<DeviceStatus | null>(null);

  constructor(private ble: BleService) {
    // Subscribe to status notifications
    this.ble.deviceStatus$.subscribe(s => this.status$.next(s));
  }

  async loadAllFromDevice(): Promise<void> {
    const [general, timeWeather, news, brand, quoteQuiz, display, wifi] =
      await Promise.all([
        this.ble.readCharacteristic<GeneralConfig>(CHAR_GENERAL_UUID),
        this.ble.readCharacteristic<TimeWeatherConfig>(CHAR_TIMEWEATHER_UUID),
        this.ble.readCharacteristic<NewsConfig>(CHAR_NEWS_UUID),
        this.ble.readCharacteristic<BrandConfig>(CHAR_BRAND_UUID),
        this.ble.readCharacteristic<QuoteQuizConfig>(CHAR_QUOTEQUIZ_UUID),
        this.ble.readCharacteristic<DisplayConfig>(CHAR_DISPLAY_UUID),
        this.ble.readCharacteristic<WifiConfig>(CHAR_WIFI_UUID),
      ]);

    this.general$.next(general);
    this.timeWeather$.next(timeWeather);
    this.news$.next(news);
    this.brand$.next(brand);
    this.quoteQuiz$.next(quoteQuiz);
    this.display$.next(display);
    this.wifi$.next(wifi);
  }

  async updateGeneral(config: Partial<GeneralConfig>): Promise<void> {
    await this.ble.ensureConnected();
    await this.ble.writeCharacteristic(CHAR_GENERAL_UUID, config);
    const current = this.general$.value;
    if (current) this.general$.next({ ...current, ...config });
  }

  async updateTimeWeather(config: Partial<TimeWeatherConfig>): Promise<void> {
    await this.ble.ensureConnected();
    await this.ble.writeCharacteristic(CHAR_TIMEWEATHER_UUID, config);
    const current = this.timeWeather$.value;
    if (current) this.timeWeather$.next({ ...current, ...config });
  }

  async updateNews(config: Partial<NewsConfig>): Promise<void> {
    await this.ble.ensureConnected();
    await this.ble.writeCharacteristic(CHAR_NEWS_UUID, config);
    const current = this.news$.value;
    if (current) this.news$.next({ ...current, ...config });
  }

  async updateBrand(config: Partial<BrandConfig>): Promise<void> {
    await this.ble.ensureConnected();
    await this.ble.writeCharacteristic(CHAR_BRAND_UUID, config);
    const current = this.brand$.value;
    if (current) this.brand$.next({ ...current, ...config });
  }

  async updateQuoteQuiz(config: Partial<QuoteQuizConfig>): Promise<void> {
    await this.ble.ensureConnected();
    await this.ble.writeCharacteristic(CHAR_QUOTEQUIZ_UUID, config);
    const current = this.quoteQuiz$.value;
    if (current) this.quoteQuiz$.next({ ...current, ...config });
  }

  async updateDisplay(config: Partial<DisplayConfig>): Promise<void> {
    await this.ble.ensureConnected();
    await this.ble.writeCharacteristic(CHAR_DISPLAY_UUID, config);
    const current = this.display$.value;
    if (current) this.display$.next({ ...current, ...config });
  }

  async updateWifi(ssid: string, pass: string): Promise<void> {
    await this.ble.ensureConnected();
    await this.ble.writeWifiConfig(ssid, pass);
    this.wifi$.next({ ssid, pass: '********' });
  }

  // Metodi per scrittura completa (deferred save dalle pagine impostazioni)
  async writeGeneral(config: GeneralConfig): Promise<void> {
    await this.ble.ensureConnected();
    await this.ble.writeCharacteristic(CHAR_GENERAL_UUID, config);
    this.general$.next(config);
  }

  async writeTimeWeather(config: TimeWeatherConfig): Promise<void> {
    await this.ble.ensureConnected();
    await this.ble.writeCharacteristic(CHAR_TIMEWEATHER_UUID, config);
    this.timeWeather$.next(config);
  }

  async writeNews(config: NewsConfig): Promise<void> {
    await this.ble.ensureConnected();
    await this.ble.writeCharacteristic(CHAR_NEWS_UUID, config);
    this.news$.next(config);
  }

  async writeBrand(config: BrandConfig): Promise<void> {
    await this.ble.ensureConnected();
    await this.ble.writeCharacteristic(CHAR_BRAND_UUID, config);
    this.brand$.next(config);
  }

  async writeQuoteQuiz(config: QuoteQuizConfig): Promise<void> {
    await this.ble.ensureConnected();
    await this.ble.writeCharacteristic(CHAR_QUOTEQUIZ_UUID, config);
    this.quoteQuiz$.next(config);
  }

  async writeDisplay(config: DisplayConfig): Promise<void> {
    await this.ble.ensureConnected();
    await this.ble.writeCharacteristic(CHAR_DISPLAY_UUID, config);
    this.display$.next(config);
  }

  async writeMelody(req: MelodyRequest): Promise<void> {
    await this.ble.ensureConnected();
    await this.ble.writeCharacteristic(CHAR_MELODY_UUID, req);
  }

  clear(): void {
    this.general$.next(null);
    this.timeWeather$.next(null);
    this.news$.next(null);
    this.brand$.next(null);
    this.quoteQuiz$.next(null);
    this.display$.next(null);
    this.wifi$.next(null);
    this.status$.next(null);
  }
}
