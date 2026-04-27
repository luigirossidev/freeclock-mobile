import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonBackButton, IonButtons, IonSkeletonText, IonIcon,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { wifiOutline } from 'ionicons/icons';
import { NewsService, NewsDetail, MEDIA_BASE } from '../../../core/services/news.service';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [
    CommonModule, DatePipe, TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonBackButton, IonButtons, IonSkeletonText, IonIcon,
  ],
  templateUrl: './news-detail.page.html',
})
export class NewsDetailPage implements OnInit {
  loading = true;
  error = false;
  news: NewsDetail | null = null;
  safeContent: SafeHtml | null = null;
  readonly mediaBase = MEDIA_BASE;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private sanitizer: DomSanitizer,
  ) {
    addIcons({ wifiOutline });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.newsService.getNewsDetail(id).subscribe({
      next: detail => {
        this.news = detail;
        this.safeContent = this.sanitizer.bypassSecurityTrustHtml(detail.content);
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }
}
