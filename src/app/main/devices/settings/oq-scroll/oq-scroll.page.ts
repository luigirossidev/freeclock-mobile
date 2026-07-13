import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonList, IonItem, IonLabel, IonInput, IonToggle, IonSelect, IonSelectOption,
  IonItemDivider, IonFooter, IonButton, IonSpinner, ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DeviceStoreService } from '../../../../core/services/device-store.service';
import { OqScrollConfig } from '../../../../core/models/device-config.model';

@Component({
  selector: 'app-oq-scroll',
  standalone: true,
  imports: [
    FormsModule, TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonList, IonItem, IonLabel, IonInput, IonToggle, IonSelect, IonSelectOption,
    IonItemDivider, IonFooter, IonButton, IonSpinner,
  ],
  templateUrl: './oq-scroll.page.html',
})
export class OqScrollPage {
  draft: OqScrollConfig | null = null;
  saving = false;

  constructor(
    private store: DeviceStoreService,
    private toastCtrl: ToastController,
    private translate: TranslateService,
  ) {}

  ionViewWillEnter() {
    const c = this.store.oqScroll$.value;
    this.draft = c ? { ...c } : null;
  }

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
      await this.store.writeOqScroll(this.draft);
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.SUCCESS'), duration: 1500, position: 'bottom', color: 'success' });
      await toast.present();
    } catch {
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.ERROR'), duration: 2000, position: 'bottom', color: 'danger' });
      await toast.present();
    }
    this.saving = false;
  }
}
