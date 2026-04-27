import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
  ],
  templateUrl: './info.page.html',
})
export class InfoPage {
  htmlContent: SafeHtml = '';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private translate: TranslateService,
  ) {}

  ionViewWillEnter() {
    this.loadContent();
  }

  private loadContent() {
    const lang = this.translate.currentLang ?? 'it';
    this.http.get(`assets/content/info.${lang}.html`, { responseType: 'text' }).subscribe({
      next: html => {
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(html);
      },
      error: () => {
        if (lang !== 'en') {
          this.http.get('assets/content/info.en.html', { responseType: 'text' }).subscribe({
            next: html => {
              this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(html);
            },
            error: () => { this.htmlContent = ''; },
          });
        }
      },
    });
  }
}
