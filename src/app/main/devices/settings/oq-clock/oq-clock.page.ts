import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonList, IonItem, IonLabel, IonInput, IonRange, IonToggle, IonSelect,
  IonSelectOption, IonItemDivider, IonFooter, IonButton, IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DeviceStoreService } from '../../../../core/services/device-store.service';
import { OqClockConfig } from '../../../../core/models/device-config.model';
import { OQ_PRESETS } from '../../../../core/constants/oraquadra-presets';

@Component({
  selector: 'app-oq-clock',
  standalone: true,
  imports: [
    FormsModule, TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonList, IonItem, IonLabel, IonInput, IonRange, IonToggle, IonSelect,
    IonSelectOption, IonItemDivider, IonFooter, IonButton, IonSpinner,
  ],
  templateUrl: './oq-clock.page.html',
})
export class OqClockPage {
  draft: OqClockConfig | null = null;
  saving = false;
  readonly presets = OQ_PRESETS;

  constructor(
    private store: DeviceStoreService,
    private toastCtrl: ToastController,
    private translate: TranslateService,
  ) {}

  ionViewWillEnter() {
    const c = this.store.oqClock$.value;
    this.draft = c ? { ...c } : null;
  }

  // <input type="color"> lavora con '#RRGGBB', il firmware con 'RRGGBB'
  get colorHex(): string {
    return '#' + (this.draft?.color ?? 'FFFFFF');
  }

  set colorHex(value: string) {
    if (!this.draft) return;
    this.draft.color = value.replace('#', '').toUpperCase();
    this.draft.rainbow = false;
  }

  async send() {
    if (!this.draft) return;
    this.saving = true;
    try {
      await this.store.writeOqClock(this.draft);
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.SUCCESS'), duration: 1500, position: 'bottom', color: 'success' });
      await toast.present();
    } catch {
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.ERROR'), duration: 2000, position: 'bottom', color: 'danger' });
      await toast.present();
    }
    this.saving = false;
  }
}
