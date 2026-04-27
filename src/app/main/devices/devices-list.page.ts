import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonList, IonItem, IonLabel, IonIcon, IonFab, IonFabButton,
  IonSpinner, AlertController, ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { add, bluetooth, bluetoothOutline, trashOutline, pencilOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { BleService } from '../../core/services/ble.service';
import { DeviceStoreService } from '../../core/services/device-store.service';
import { StorageService } from '../../core/services/storage.service';
import { PairedDevice } from '../../core/models/paired-device.model';

@Component({
  selector: 'app-devices-list',
  standalone: true,
  imports: [
    CommonModule, TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonList, IonItem, IonLabel, IonIcon, IonFab, IonFabButton,
    IonSpinner,
  ],
  templateUrl: './devices-list.page.html',
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 4rem 2rem;
      opacity: 0.85;

      ion-icon {
        font-size: 4.5rem;
        margin-bottom: 1rem;
      }

      h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
      }

      p {
        font-size: 0.95rem;
        color: var(--ion-color-medium);
        max-width: 280px;
        line-height: 1.5;
      }
    }

    .permissions-note {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin: 0 1.5rem;
      padding: 14px 16px;
      background: var(--ion-color-warning-tint, rgba(255, 196, 9, 0.12));
      border-radius: 12px;
      border-left: 3px solid var(--ion-color-warning);

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
export class DevicesListPage implements OnDestroy {
  devices: PairedDevice[] = [];
  connecting = false;
  private devicesSub: Subscription;

  constructor(
    private storage: StorageService,
    private ble: BleService,
    private store: DeviceStoreService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private translate: TranslateService,
  ) {
    addIcons({ add, bluetooth, bluetoothOutline, trashOutline, pencilOutline, shieldCheckmarkOutline });
    this.devicesSub = this.storage.pairedDevices$.subscribe(devices => {
      this.devices = devices;
    });
  }

  ngOnDestroy() {
    this.devicesSub.unsubscribe();
  }

  async ionViewWillEnter() {
    // Disconnetti eventuale connessione precedente quando si torna alla lista
    if (this.ble.connectionState$.value !== 'disconnected') {
      await this.ble.disconnect();
      this.store.clear();
    }
  }

  async connectDevice(device: PairedDevice) {
    this.connecting = true;
    try {
      await this.ble.initialize();
      await this.ble.connect(device.id);
      await this.ble.authenticate(device.pin);
      await this.store.loadAllFromDevice();
      this.router.navigate(['/main/devices', device.id]);
    } catch (e: any) {
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('DEVICES.CONNECT_FAILED'),
        message: e?.message || this.translate.instant('DEVICES.CONNECT_FAILED'),
        buttons: [
          { text: this.translate.instant('COMMON.CANCEL'), role: 'cancel' },
          { text: this.translate.instant('COMMON.RETRY'), handler: () => this.connectDevice(device) },
        ],
      });
      await alert.present();
    }
    this.connecting = false;
  }

  async removeDevice(event: Event, device: PairedDevice) {
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('DEVICES.REMOVE_DEVICE'),
      message: this.translate.instant('DEVICES.CONFIRM_REMOVE'),
      buttons: [
        { text: this.translate.instant('COMMON.CANCEL'), role: 'cancel' },
        {
          text: this.translate.instant('COMMON.CONFIRM'),
          cssClass: 'danger',
          handler: async () => {
            await this.storage.removePairedDevice(device.id);
          },
        },
      ],
    });
    await alert.present();
  }

  async editAlias(event: Event, device: PairedDevice) {
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('DEVICES.EDIT_ALIAS'),
      inputs: [
        {
          name: 'alias',
          type: 'text',
          value: device.alias ?? '',
          placeholder: this.translate.instant('DEVICES.ALIAS_PLACEHOLDER'),
        },
      ],
      buttons: [
        { text: this.translate.instant('COMMON.CANCEL'), role: 'cancel' },
        {
          text: this.translate.instant('COMMON.SAVE'),
          handler: async (data) => {
            await this.storage.updateDeviceAlias(device.id, data.alias ?? '');
          },
        },
      ],
    });
    await alert.present();
  }

  addDevice() {
    this.router.navigate(['/wizard/scan']);
  }
}
