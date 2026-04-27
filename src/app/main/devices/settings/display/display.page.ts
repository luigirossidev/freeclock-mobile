import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonList, IonItem, IonLabel, IonInput, IonRange, IonItemDivider, IonFooter,
  IonButton, IonSpinner, ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DeviceStoreService } from '../../../../core/services/device-store.service';
import { DisplayConfig } from '../../../../core/models/device-config.model';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [
    FormsModule, TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonList, IonItem, IonLabel, IonInput, IonRange, IonItemDivider, IonFooter,
    IonButton, IonSpinner,
  ],
  templateUrl: './display.page.html',
})
export class DisplayPage {
  draft: DisplayConfig | null = null;
  saving = false;

  constructor(
    private store: DeviceStoreService,
    private toastCtrl: ToastController,
    private translate: TranslateService,
  ) {}

  ionViewWillEnter() {
    const c = this.store.display$.value;
    this.draft = c ? { ...c } : null;
  }

  async send() {
    if (!this.draft) return;
    this.saving = true;
    try {
      await this.store.writeDisplay(this.draft);
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.SUCCESS'), duration: 1500, position: 'bottom', color: 'success' });
      await toast.present();
    } catch {
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.ERROR'), duration: 2000, position: 'bottom', color: 'danger' });
      await toast.present();
    }
    this.saving = false;
  }
}
