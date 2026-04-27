import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonList, IonItem, IonLabel, IonInput, IonFooter, IonButton, IonSpinner,
  IonNote, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonSearchbar, ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { checkmarkCircle, alertCircle, openOutline } from 'ionicons/icons';
import { DeviceStoreService } from '../../../../core/services/device-store.service';
import { NewsApiService, NewsSource } from '../../../../core/services/newsapi.service';
import { NewsConfig } from '../../../../core/models/device-config.model';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    FormsModule, TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonList, IonItem, IonLabel, IonInput, IonFooter, IonButton, IonSpinner,
    IonNote, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonSearchbar,
  ],
  templateUrl: './news.page.html',
})
export class NewsPage {
  draft: NewsConfig | null = null;
  saving = false;

  // Guided flow state
  apiKeyTesting = false;
  apiKeyValid: boolean | null = null;
  sources: NewsSource[] = [];
  filteredSources: NewsSource[] = [];
  loadingSources = false;
  selectedSourceName = '';

  constructor(
    private store: DeviceStoreService,
    private newsApi: NewsApiService,
    private toastCtrl: ToastController,
    private translate: TranslateService,
  ) {
    addIcons({ checkmarkCircle, alertCircle, openOutline });
  }

  ionViewWillEnter() {
    const c = this.store.news$.value;
    if (c) {
      this.draft = { ...c };
      if (c.key?.trim()) {
        this.apiKeyValid = true;
        this.loadSources();
      }
    }
  }

  async testApiKey() {
    if (!this.draft?.key?.trim()) return;
    this.apiKeyTesting = true;
    this.apiKeyValid = null;
    this.apiKeyValid = await this.newsApi.testApiKey(this.draft.key.trim());
    this.apiKeyTesting = false;
    if (this.apiKeyValid) {
      await this.loadSources();
    }
  }

  onApiKeyChange() {
    this.apiKeyValid = null;
    this.sources = [];
    this.filteredSources = [];
  }

  openGetApiKey() {
    window.open('https://newsapi.org/register', '_blank');
  }

  private async loadSources() {
    if (!this.draft?.key) return;
    this.loadingSources = true;
    this.sources = await this.newsApi.getSources(this.draft.key);
    this.filteredSources = this.sources;
    this.loadingSources = false;
    // Resolve name of currently selected source
    if (this.draft.src) {
      const found = this.sources.find(s => s.id === this.draft!.src);
      this.selectedSourceName = found?.name ?? this.draft.src;
    }
  }

  onSearchSource(event: any) {
    const query = (event.detail.value ?? '').toLowerCase().trim();
    if (!query) {
      this.filteredSources = this.sources;
      return;
    }
    this.filteredSources = this.sources.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query),
    );
  }

  selectSource(source: NewsSource) {
    if (!this.draft) return;
    this.draft.src = source.id;
    this.selectedSourceName = source.name;
  }

  async send() {
    if (!this.draft) return;
    this.saving = true;
    try {
      await this.store.writeNews(this.draft);
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.SUCCESS'), duration: 1500, position: 'bottom', color: 'success' });
      await toast.present();
    } catch {
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.ERROR'), duration: 2000, position: 'bottom', color: 'danger' });
      await toast.present();
    }
    this.saving = false;
  }
}
