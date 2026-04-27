import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export interface NewsSource {
  id: string;
  name: string;
  description: string;
  category: string;
  country: string;
}

@Injectable({ providedIn: 'root' })
export class NewsApiService {
  private readonly BASE_URL = 'https://newsapi.org/v2';

  constructor(private http: HttpClient, private translate: TranslateService) {}

  private get lang(): string {
    return this.translate.currentLang ?? 'en';
  }

  /** Validates an API key by fetching a minimal response */
  async testApiKey(apiKey: string): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.get<any>(`${this.BASE_URL}/top-headlines/sources`, {
          params: { apiKey, language: this.lang },
        }),
      );
      return res?.status === 'ok';
    } catch {
      return false;
    }
  }

  /** Fetch available sources for the current app language */
  async getSources(apiKey: string): Promise<NewsSource[]> {
    try {
      const res = await firstValueFrom(
        this.http.get<any>(`${this.BASE_URL}/top-headlines/sources`, {
          params: { apiKey, language: this.lang },
        }),
      );
      return (res?.sources ?? []).map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description ?? '',
        category: s.category ?? '',
        country: (s.country ?? '').toUpperCase(),
      }));
    } catch {
      return [];
    }
  }
}
