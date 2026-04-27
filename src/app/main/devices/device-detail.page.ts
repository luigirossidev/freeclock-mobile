import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonList, IonItem, IonLabel, IonIcon, IonItemDivider, ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import {
  settingsOutline, timeOutline, newspaperOutline, pricetagOutline,
  chatbubblesOutline, contrastOutline, wifiOutline,
  hardwareChipOutline, chevronForward, cloudDownloadOutline, musicalNotesOutline,
} from 'ionicons/icons';
import { BleService } from '../../core/services/ble.service';
import { DeviceStoreService } from '../../core/services/device-store.service';
import { StorageService } from '../../core/services/storage.service';
import { ConnectionStatusComponent } from '../../shared/components/connection-status/connection-status.component';

interface SettingEntry {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [
    TranslateModule, ConnectionStatusComponent,
    IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonList, IonItem, IonLabel, IonIcon, IonItemDivider,
  ],
  templateUrl: './device-detail.page.html',
})
export class DeviceDetailPage {
  deviceName = '';
  deviceId = '';

  readonly mainSettings: SettingEntry[] = [
    { label: 'SETTINGS.GENERAL',     icon: 'settings-outline',       path: 'general' },
    { label: 'SETTINGS.WIFI',        icon: 'wifi-outline',           path: 'wifi' },
    { label: 'SETTINGS.DISPLAY',     icon: 'contrast-outline',       path: 'display' },
    { label: 'DEVICE.UPDATE',        icon: 'cloud-download-outline', path: 'update' },
    { label: 'SETTINGS.JUKEBOX',     icon: 'musical-notes-outline',  path: 'jukebox' },
  ];

  readonly featureSettings: SettingEntry[] = [
    { label: 'SETTINGS.TIME_WEATHER',icon: 'time-outline',           path: 'time-weather' },
    { label: 'SETTINGS.NEWS',        icon: 'newspaper-outline',      path: 'news' },
    { label: 'SETTINGS.BRAND',       icon: 'pricetag-outline',       path: 'brand' },
    { label: 'SETTINGS.QUOTE_QUIZ',  icon: 'chatbubbles-outline',    path: 'quote-quiz' },
  ];

  private reconnectSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ble: BleService,
    private store: DeviceStoreService,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private storage: StorageService,
  ) {
    addIcons({
      settingsOutline, timeOutline, newspaperOutline, pricetagOutline,
      chatbubblesOutline, contrastOutline, wifiOutline,
      hardwareChipOutline, chevronForward, cloudDownloadOutline, musicalNotesOutline,
    });
  }

  async ionViewWillEnter() {
    this.deviceId = this.route.snapshot.paramMap.get('deviceId') ?? '';
    if (history.state?.deviceName) {
      this.deviceName = history.state.deviceName;
    } else {
      const devices = await this.storage.getPairedDevices();
      const paired = devices.find(d => d.id === this.deviceId);
      this.deviceName = paired?.alias ?? paired?.name ?? this.deviceId;
    }

    this.reconnectSub = this.ble.reconnectFailed$.subscribe(async () => {
      const toast = await this.toastCtrl.create({
        message: this.translate.instant('COMMON.BLE_DISCONNECTED'),
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
      await toast.present();
      this.store.clear();
      this.router.navigate(['/main/devices'], { replaceUrl: true });
    });
  }

  ionViewWillLeave() {
    this.reconnectSub?.unsubscribe();
  }

  navigate(path: string) {
    this.router.navigate([path], { relativeTo: this.route });
  }
}
