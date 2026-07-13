import { Component } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonList, IonItem, IonLabel, IonNote, IonIcon, IonFooter, IonButton,
  IonSpinner, ModalController, ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { globeOutline, chevronForward } from 'ionicons/icons';
import { DeviceStoreService } from '../../../../core/services/device-store.service';
import { TimezoneService } from '../../../../core/services/timezone.service';
import { TimezoneSelectorComponent } from '../../../../shared/components/timezone-selector/timezone-selector.component';

@Component({
  selector: 'app-oq-timezone',
  standalone: true,
  imports: [
    TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonList, IonItem, IonLabel, IonNote, IonIcon, IonFooter, IonButton, IonSpinner,
  ],
  templateUrl: './oq-timezone.page.html',
})
export class OqTimezonePage {
  tz = '';
  tzLabel = '';
  saving = false;

  constructor(
    private store: DeviceStoreService,
    private tzService: TimezoneService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private translate: TranslateService,
  ) {
    addIcons({ globeOutline, chevronForward });
  }

  ionViewWillEnter() {
    this.tz = this.store.oqTime$.value?.tz ?? '';
    this.tzLabel = this.tzService.posixToLabel(this.tz) ?? this.tz;
  }

  async openTimezoneSelector() {
    const modal = await this.modalCtrl.create({
      component: TimezoneSelectorComponent,
      componentProps: { currentPosix: this.tz },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.tz = data.posix;
      this.tzLabel = `${data.label} (${data.iana})`;
    }
  }

  async send() {
    if (!this.tz) return;
    this.saving = true;
    try {
      await this.store.writeOqTime({ tz: this.tz });
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.SUCCESS'), duration: 1500, position: 'bottom', color: 'success' });
      await toast.present();
    } catch {
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.ERROR'), duration: 2000, position: 'bottom', color: 'danger' });
      await toast.present();
    }
    this.saving = false;
  }
}
