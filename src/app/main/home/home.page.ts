import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton, IonSkeletonText,
  IonRefresher, IonRefresherContent,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { bluetooth, chevronForward, wifiOutline, refreshOutline } from 'ionicons/icons';
import { StorageService } from '../../core/services/storage.service';
import { PairedDevice } from '../../core/models/paired-device.model';
import { NewsService, NewsListItem, MEDIA_BASE } from '../../core/services/news.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, DatePipe, TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton, IonSkeletonText,
    IonRefresher, IonRefresherContent,
  ],
  templateUrl: './home.page.html',
})
export class HomePage {
  devices: PairedDevice[] = [];
  newsList: NewsListItem[] = [];
  newsLoading = true;
  newsError: 'offline' | 'empty' | null = null;
  readonly mediaBase = MEDIA_BASE;

  constructor(
    private storage: StorageService,
    private router: Router,
    private newsService: NewsService,
  ) {
    addIcons({ bluetooth, chevronForward, wifiOutline, refreshOutline });
  }

  async ionViewWillEnter() {
    this.devices = await this.storage.getPairedDevices();
    this.loadNews();
  }

  loadNews() {
    this.newsLoading = true;
    this.newsError = null;
    this.newsService.getNewsList().subscribe({
      next: items => {
        this.newsList = items;
        this.newsError = items.length === 0 ? 'empty' : null;
        this.newsLoading = false;
      },
      error: () => {
        this.newsError = 'offline';
        this.newsLoading = false;
      },
    });
  }

  doRefresh(event: any) {
    this.newsError = null;
    this.newsService.getNewsList().subscribe({
      next: items => {
        this.newsList = items;
        this.newsError = items.length === 0 ? 'empty' : null;
      },
      error: () => {
        this.newsError = 'offline';
        event.target.complete();
      },
      complete: () => event.target.complete(),
    });
  }

  goToDevices() {
    this.router.navigate(['/main/devices']);
  }

  openNews(id: number) {
    this.router.navigate(['/main/home/news', id]);
  }
}
