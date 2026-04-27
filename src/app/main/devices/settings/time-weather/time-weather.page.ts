import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonList, IonItem, IonLabel, IonToggle, IonInput, IonItemDivider, IonFooter,
  IonButton, IonSpinner, IonNote, IonIcon, IonCard, IonCardContent,
  IonCardHeader, IonCardTitle, ModalController, ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { checkmarkCircle, alertCircle, search, openOutline } from 'ionicons/icons';
import { DeviceStoreService } from '../../../../core/services/device-store.service';
import { TimezoneService } from '../../../../core/services/timezone.service';
import { WeatherService } from '../../../../core/services/weather.service';
import { TimeWeatherConfig } from '../../../../core/models/device-config.model';
import { TimezoneSelectorComponent } from '../../../../shared/components/timezone-selector/timezone-selector.component';
import { CitySelectorComponent } from '../../../../shared/components/city-selector/city-selector.component';

@Component({
  selector: 'app-time-weather',
  standalone: true,
  imports: [
    FormsModule, TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonList, IonItem, IonLabel, IonToggle, IonInput, IonItemDivider, IonFooter,
    IonButton, IonSpinner, IonNote, IonIcon, IonCard, IonCardContent,
    IonCardHeader, IonCardTitle,
  ],
  templateUrl: './time-weather.page.html',
})
export class TimeWeatherPage {
  draft: TimeWeatherConfig | null = null;
  currentTzLabel = '';
  saving = false;

  // Weather wizard state
  apiKeyTesting = false;
  apiKeyValid: boolean | null = null; // null = not tested
  cityName = '';

  constructor(
    private store: DeviceStoreService,
    private tzService: TimezoneService,
    private weatherService: WeatherService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private translate: TranslateService,
  ) {
    addIcons({ checkmarkCircle, alertCircle, search, openOutline });
  }

  ionViewWillEnter() {
    const c = this.store.timeWeather$.value;
    if (c) {
      this.draft = { ...c };
      this.currentTzLabel = this.tzService.posixToLabel(c.tz) ?? c.tz;
      // If key exists, mark as already valid (user previously saved)
      if (c.wKey?.trim()) {
        this.apiKeyValid = true;
      }
    }
  }

  async openTimezoneSelector() {
    const modal = await this.modalCtrl.create({
      component: TimezoneSelectorComponent,
      componentProps: { currentPosix: this.draft?.tz ?? '' },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data && this.draft) {
      this.draft.tz = data.posix;
      this.currentTzLabel = `${data.label} (${data.iana})`;
    }
  }

  async testApiKey() {
    if (!this.draft?.wKey?.trim()) return;
    this.apiKeyTesting = true;
    this.apiKeyValid = null;
    this.apiKeyValid = await this.weatherService.testApiKey(this.draft.wKey.trim());
    this.apiKeyTesting = false;
  }

  onApiKeyChange() {
    // Reset validation when key changes
    this.apiKeyValid = null;
  }

  openGetApiKey() {
    window.open('https://home.openweathermap.org/users/sign_up', '_blank');
  }

  async openCitySelector() {
    if (!this.draft?.wKey) return;
    const modal = await this.modalCtrl.create({
      component: CitySelectorComponent,
      componentProps: { apiKey: this.draft.wKey },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data && this.draft) {
      this.draft.city = data.cityId;
      this.cityName = `${data.cityName}, ${data.country}`;
    }
  }

  async send() {
    if (!this.draft) return;
    this.saving = true;
    try {
      await this.store.writeTimeWeather(this.draft);
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.SUCCESS'), duration: 1500, position: 'bottom', color: 'success' });
      await toast.present();
    } catch {
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.ERROR'), duration: 2000, position: 'bottom', color: 'danger' });
      await toast.present();
    }
    this.saving = false;
  }
}
