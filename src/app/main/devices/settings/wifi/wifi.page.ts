import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonList, IonItem, IonLabel, IonIcon, IonInput, IonButton, IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { wifiOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { BleService } from '../../../../core/services/ble.service';
import { DeviceStoreService } from '../../../../core/services/device-store.service';
import { WifiNetwork } from '../../../../core/models/device-config.model';

@Component({
  selector: 'app-wifi',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonList, IonItem, IonLabel, IonIcon, IonInput, IonButton, IonSpinner,
  ],
  templateUrl: './wifi.page.html',
  styles: [`
    .scan-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3rem 2rem;
      opacity: 0.85;

      ion-spinner {
        width: 3.5rem;
        height: 3.5rem;
        margin-bottom: 1rem;
      }

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
  `],
})
export class WifiPage implements OnDestroy {
  currentSsid = '';
  scanning = false;
  scanDone = false;
  saving = false;
  networks: WifiNetwork[] = [];
  selectedNetwork: WifiNetwork | null = null;
  password = '';
  private subs: Subscription[] = [];

  constructor(
    private ble: BleService,
    private store: DeviceStoreService,
    private toastCtrl: ToastController,
    private translate: TranslateService,
  ) {
    addIcons({ wifiOutline });
  }

  ionViewWillEnter() {
    this.scanDone = false;
    this.subs.push(
      this.store.status$.subscribe(s => { if (s) this.currentSsid = s.ssid; }),
      this.ble.wifiScanResults$.subscribe(result => {
        this.networks = result.n.sort((a, b) => b.r - a.r);
        this.scanning = false;
        this.scanDone = true;
      }),
    );
  }

  ionViewWillLeave() {
    this.subs.forEach(s => s.unsubscribe());
    this.subs = [];
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  async scanNetworks() {
    this.scanning = true;
    this.networks = [];
    this.selectedNetwork = null;
    await this.ble.triggerWifiScan();
  }

  selectNetwork(net: WifiNetwork) {
    this.selectedNetwork = net;
    this.password = '';
  }

  async saveWifi() {
    if (!this.selectedNetwork) return;
    this.saving = true;
    try {
      await this.store.updateWifi(this.selectedNetwork.s, this.password);
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.SUCCESS'), duration: 1500, position: 'bottom', color: 'success' });
      await toast.present();
      this.selectedNetwork = null;
      this.networks = [];
    } catch {
      const toast = await this.toastCtrl.create({ message: this.translate.instant('COMMON.ERROR'), duration: 2000, position: 'bottom', color: 'danger' });
      await toast.present();
    }
    this.saving = false;
  }
}
