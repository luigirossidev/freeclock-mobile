import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export interface GeoCity {
  name: string;
  localName: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface CityResult {
  id: number;
  name: string;
  country: string;
  state?: string;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';
  private readonly WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient, private translate: TranslateService) {}

  private get lang(): string {
    return this.translate.currentLang ?? 'en';
  }

  /** Validates an API key by making a minimal weather call */
  async testApiKey(apiKey: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.get(`${this.WEATHER_URL}`, {
          params: { q: 'London', appid: apiKey, cnt: '1' },
        }),
      );
      return true;
    } catch {
      return false;
    }
  }

  /** Search cities by name, returns localized names based on app language */
  async searchCities(query: string, apiKey: string): Promise<GeoCity[]> {
    if (!query || query.length < 2) return [];
    const res = await firstValueFrom(
      this.http.get<any[]>(this.GEO_URL, {
        params: { q: query, limit: '10', appid: apiKey },
      }),
    );
    return (res ?? []).map(item => ({
      name: item.name,
      localName: item.local_names?.[this.lang] ?? item.name,
      lat: item.lat,
      lon: item.lon,
      country: item.country,
      state: item.state,
    }));
  }

  /** Get the OWM city ID from coordinates */
  async getCityId(lat: number, lon: number, apiKey: string): Promise<CityResult | null> {
    try {
      const res = await firstValueFrom(
        this.http.get<any>(this.WEATHER_URL, {
          params: { lat: lat.toString(), lon: lon.toString(), appid: apiKey },
        }),
      );
      return {
        id: res.id,
        name: res.name,
        country: res.sys?.country ?? '',
        state: '',
      };
    } catch {
      return null;
    }
  }
}
