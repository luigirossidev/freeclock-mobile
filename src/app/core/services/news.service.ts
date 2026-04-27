import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

const API_BASE = 'https://freeclock.matesemakers.it/api';
export const MEDIA_BASE = 'https://freeclock.matesemakers.it';

export interface NewsListItem {
  id: number;
  title: string;
  thumbnail: string | null;
  summary: string;
  published_at: string;
}

export interface NewsDetail {
  id: number;
  title: string;
  image: string | null;
  content: string;
  summary: string;
  published_at: string;
}

interface NewsListResponse {
  data: NewsListItem[];
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  constructor(private http: HttpClient, private translate: TranslateService) {}

  private get lang(): string {
    return this.translate.currentLang ?? 'it';
  }

  getNewsList(): Observable<NewsListItem[]> {
    return this.http
      .get<NewsListResponse>(`${API_BASE}/news?lang=${this.lang}`)
      .pipe(map(res => res.data));
  }

  getNewsDetail(id: number): Observable<NewsDetail> {
    return this.http.get<NewsDetail>(`${API_BASE}/news/${id}?lang=${this.lang}`);
  }
}
