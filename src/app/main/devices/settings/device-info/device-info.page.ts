import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonItem, IonLabel, IonButton, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonBadge,
  AlertController, ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { BleService } from '../../../../core/services/ble.service';
import { DeviceStoreService } from '../../../../core/services/device-store.service';
import { StorageService } from '../../../../core/services/storage.service';
import { DeviceStatus } from '../../../../core/models/device-config.model';

@Component({
  selector: 'app-device-info',
  standalone: true,
  imports: [
    CommonModule, TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonItem, IonLabel, IonButton, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonBadge,
  ],
  templateUrl: './device-info.page.html',
})
export class DeviceInfoPage implements OnDestroy {
  status: DeviceStatus | null = null;
  pin: number | null = null;
  pinVisible = false;
  private sub?: Subscription;
  private deviceId = '';

  constructor(
    private ble: BleService,
    private store: DeviceStoreService,
    private storage: StorageService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  async ionViewWillEnter() {
    this.deviceId = this.route.snapshot.paramMap.get('deviceId') ?? '';
    this.sub = this.store.status$.subscribe(s => this.status = s);
    this.pinVisible = false;
    if (this.deviceId) {
      const devices = await this.storage.getPairedDevices();
      this.pin = devices.find(d => d.id === this.deviceId)?.pin ?? null;
    }
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }

  async disconnectDevice() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('DEVICE.DISCONNECT'),
      message: this.translate.instant('DEVICE.CONFIRM_DISCONNECT'),
      buttons: [
        { text: this.translate.instant('COMMON.CANCEL'), role: 'cancel' },
        {
          text: this.translate.instant('COMMON.CONFIRM'),
          handler: async () => {
            await this.ble.disconnect();
            this.store.clear();
            this.router.navigate(['/main/devices'], { replaceUrl: true });
          },
        },
      ],
    });
    await alert.present();
  }

  async reboot() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('DEVICE.REBOOT'),
      message: this.translate.instant('DEVICE.CONFIRM_REBOOT'),
      buttons: [
        { text: this.translate.instant('COMMON.CANCEL'), role: 'cancel' },
        {
          text: this.translate.instant('COMMON.CONFIRM'),
          handler: async () => {
            try {
              await this.ble.sendCommand('reboot');
              await alert.dismiss();
              await this.showToast('DEVICE.REBOOT_SUCCESS', 'success');
            } catch {
              await alert.dismiss();
              await this.showToast('DEVICE.CMD_ERROR', 'danger');
            }
            return false;
          },
        },
      ],
    });
    await alert.present();
  }

  async factoryReset() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('DEVICE.FACTORY_RESET'),
      message: this.translate.instant('DEVICE.CONFIRM_FACTORY'),
      buttons: [
        { text: this.translate.instant('COMMON.CANCEL'), role: 'cancel' },
        {
          text: this.translate.instant('COMMON.CONFIRM'),
          cssClass: 'danger',
          handler: async () => {
            try {
              await this.ble.sendCommand('factory_reset');
              await this.ble.disconnect();
              this.store.clear();
              if (this.deviceId) {
                await this.storage.removePairedDevice(this.deviceId);
              }
              await alert.dismiss();
              await this.showToast('DEVICE.FACTORY_SUCCESS', 'success');
              this.router.navigate(['/main/devices'], { replaceUrl: true });
            } catch {
              await alert.dismiss();
              await this.showToast('DEVICE.CMD_ERROR', 'danger');
            }
            return false;
          },
        },
      ],
    });
    await alert.present();
  }

  private async showToast(key: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: this.translate.instant(key),
      duration: 3000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
