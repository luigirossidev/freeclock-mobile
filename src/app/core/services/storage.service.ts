import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { PairedDevice } from '../models/paired-device.model';

const KEYS = {
  PAIRED_DEVICES: 'paired_devices',
  LANGUAGE: 'language',
};

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly _pairedDevices$ = new BehaviorSubject<PairedDevice[]>([]);
  readonly pairedDevices$ = this._pairedDevices$.asObservable();

  constructor() {
    this.loadDevices();
  }

  private async loadDevices(): Promise<void> {
    this._pairedDevices$.next(await this.getPairedDevices());
  }

  async getPairedDevices(): Promise<PairedDevice[]> {
    const { value } = await Preferences.get({ key: KEYS.PAIRED_DEVICES });
    if (!value) return [];
    try {
      return JSON.parse(value) as PairedDevice[];
    } catch {
      return [];
    }
  }

  async addPairedDevice(device: PairedDevice): Promise<void> {
    const devices = await this.getPairedDevices();
    const existing = devices.findIndex(d => d.id === device.id);
    if (existing >= 0) {
      devices[existing] = device; // aggiorna se già presente (es. cambio PIN)
    } else {
      devices.push(device);
    }
    await Preferences.set({ key: KEYS.PAIRED_DEVICES, value: JSON.stringify(devices) });
    this._pairedDevices$.next(devices);
  }

  async updateDeviceAlias(id: string, alias: string): Promise<void> {
    const devices = await this.getPairedDevices();
    const device = devices.find(d => d.id === id);
    if (!device) return;
    device.alias = alias.trim() || undefined;
    await Preferences.set({ key: KEYS.PAIRED_DEVICES, value: JSON.stringify(devices) });
    this._pairedDevices$.next(devices);
  }

  async removePairedDevice(id: string): Promise<void> {
    const devices = await this.getPairedDevices();
    const filtered = devices.filter(d => d.id !== id);
    await Preferences.set({ key: KEYS.PAIRED_DEVICES, value: JSON.stringify(filtered) });
    this._pairedDevices$.next(filtered);
  }

  async getLanguage(): Promise<'it' | 'en'> {
    const { value } = await Preferences.get({ key: KEYS.LANGUAGE });
    return (value === 'en') ? 'en' : 'it';
  }

  async setLanguage(lang: 'it' | 'en'): Promise<void> {
    await Preferences.set({ key: KEYS.LANGUAGE, value: lang });
  }
}
