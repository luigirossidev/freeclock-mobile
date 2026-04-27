import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonList, IonItem, IonInput, IonItemDivider, IonLabel, IonFooter,
  IonButton, IonSpinner, IonIcon, ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  timeOutline, calendarOutline, cloudOutline, newspaperOutline,
  pricetagOutline, chatbubbleEllipsesOutline, helpCircleOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { DeviceStoreService } from '../../../../core/services/device-store.service';
import { GeneralConfig } from '../../../../core/models/device-config.model';
import { ModuleToggleComponent } from '../../../../shared/components/module-toggle/module-toggle.component';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [
    FormsModule, TranslateModule, ModuleToggleComponent,
    IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonList, IonItem, IonInput, IonItemDivider, IonLabel, IonFooter,
    IonButton, IonSpinner, IonIcon,
  ],
  templateUrl: './general.page.html',
  styles: [`
    .info-note {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
      padding: 14px 16px;
      background: var(--ion-color-warning-tint, rgba(255, 196, 9, 0.12));
      border-radius: 12px;
      border-left: 3px solid var(--ion-color-tertiary);

      ion-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
        margin-top: 1px;
      }

      p {
        font-size: 0.85rem;
        color: var(--ion-color-medium-shade);
        line-height: 1.5;
        margin: 0;
      }
    }
  `],
})
export class GeneralPage {
  draft: GeneralConfig | null = null;
  saving = false;
  weatherConfigured = false;
  newsConfigured = false;

  constructor(
    private store: DeviceStoreService,
    private toastCtrl: ToastController,
    private translate: TranslateService,
  ) {
    addIcons({
      timeOutline, calendarOutline, cloudOutline, newspaperOutline,
      pricetagOutline, chatbubbleEllipsesOutline, helpCircleOutline,
      informationCircleOutline,
    });
  }

  ionViewWillEnter() {
    const c = this.store.general$.value;
    this.draft = c ? { ...c } : null;

    const tw = this.store.timeWeather$.value;
    this.weatherConfigured = !!(tw?.wKey?.trim() && tw?.city);
    // Force weather off if not configured
    if (!this.weatherConfigured && this.draft) {
      this.draft.wea = false;
      this.draft.weaAS = false;
    }

    const nw = this.store.news$.value;
    this.newsConfigured = !!(nw?.key?.trim() && nw?.src?.trim());
    // Force news off if not configured
    if (!this.newsConfigured && this.draft) {
      this.draft.news = false;
      this.draft.newsAS = false;
    }
  }

  async send() {
    if (!this.draft) return;
    this.saving = true;
    try {
      await this.store.writeGeneral(this.draft);
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.SUCCESS'), duration: 1500, position: 'bottom', color: 'success' });
      await toast.present();
    } catch {
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.ERROR'), duration: 2000, position: 'bottom', color: 'danger' });
      await toast.present();
    }
    this.saving = false;
  }
}
