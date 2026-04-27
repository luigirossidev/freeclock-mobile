import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton,
  AlertController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom, filter, timeout, catchError, EMPTY } from 'rxjs';
import { BleService } from '../../../../core/services/ble.service';
import { DeviceStoreService } from '../../../../core/services/device-store.service';

interface OtaVersionResponse {
  latest: number;
  notes: string;
}

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [
    CommonModule, TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton,
  ],
  templateUrl: './update.page.html',
})
export class UpdatePage {
  isLoading = false;
  hasUpdate = false;
  checkFailed = false;
  safeNotes: SafeHtml = '';

  constructor(
    private ble: BleService,
    private store: DeviceStoreService,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
  ) {}

  async ionViewWillEnter() {
    this.isLoading = true;
    this.hasUpdate = false;
    this.checkFailed = false;

    const status = await firstValueFrom(
      this.store.status$.pipe(
        filter(s => s != null),
        timeout({ first: 5000 }),
        catchError(() => EMPTY),
      )
    ).catch(() => null);

    if (!status) {
      this.checkFailed = true;
      this.isLoading = false;
      return;
    }

    const { fwCode, serverUrl, deviceType } = status;

    try {
      const lang = this.translate.currentLang ?? 'it';
      const res = await fetch(`${serverUrl}/api/fw/ver_mobile?device=${deviceType}&lang=${lang}`);
      const text = await res.text();

      if (text.trim() === 'No firmware found') {
        this.hasUpdate = false;
      } else {
        const data: OtaVersionResponse = JSON.parse(text);
        if (data.latest > fwCode) {
          this.hasUpdate = true;
          this.safeNotes = this.sanitizer.bypassSecurityTrustHtml(data.notes);
        } else {
          this.hasUpdate = false;
        }
      }
    } catch {
      this.checkFailed = true;
    } finally {
      this.isLoading = false;
    }
  }

  async startUpdate() {
    await this.ble.sendCommand('ota_update');
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('UPDATE.IN_PROGRESS_TITLE'),
      message: this.translate.instant('UPDATE.IN_PROGRESS_MSG'),
      buttons: [{ text: 'OK', role: 'cancel' }],
    });
    await alert.present();
  }
}
