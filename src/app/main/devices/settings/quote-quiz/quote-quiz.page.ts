import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonList, IonItem, IonInput, IonLabel, IonDatetime, IonFooter, IonButton, IonSpinner, ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DeviceStoreService } from '../../../../core/services/device-store.service';
import { QuoteQuizConfig } from '../../../../core/models/device-config.model';

@Component({
  selector: 'app-quote-quiz',
  standalone: true,
  imports: [
    FormsModule, TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonList, IonItem, IonInput, IonLabel, IonDatetime, IonFooter, IonButton, IonSpinner,
  ],
  templateUrl: './quote-quiz.page.html',
})
export class QuoteQuizPage {
  draft: QuoteQuizConfig | null = null;
  saving = false;

  constructor(
    private store: DeviceStoreService,
    private toastCtrl: ToastController,
    private translate: TranslateService,
  ) {}

  get quizHourTime(): string {
    if (!this.draft) return '00:00';
    return String(this.draft.quizHour).padStart(2, '0') + ':00';
  }

  onQuizHourChange(event: CustomEvent) {
    if (!this.draft || !event.detail.value) return;
    const val = event.detail.value as string;
    const match = val.match(/(\d{2}):\d{2}/);
    if (match) {
      this.draft.quizHour = parseInt(match[1], 10);
    }
  }

  ionViewWillEnter() {
    const c = this.store.quoteQuiz$.value;
    this.draft = c ? { ...c } : null;
  }

  async send() {
    if (!this.draft) return;
    this.saving = true;
    try {
      await this.store.writeQuoteQuiz(this.draft);
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.SUCCESS'), duration: 1500, position: 'bottom', color: 'success' });
      await toast.present();
    } catch {
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.ERROR'), duration: 2000, position: 'bottom', color: 'danger' });
      await toast.present();
    }
    this.saving = false;
  }
}
