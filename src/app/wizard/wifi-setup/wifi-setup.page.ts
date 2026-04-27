import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonIcon, IonInput, IonInputPasswordToggle, IonButton, IonSpinner, IonBackButton, IonButtons, IonText } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { wifiOutline } from 'ionicons/icons';
import { Subscription, firstValueFrom, filter, timeout } from 'rxjs';
import { BleService } from '../../core/services/ble.service';
import { WifiNetwork } from '../../core/models/device-config.model';

@Component({
  selector: 'app-wifi-setup',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonIcon, IonInput, IonInputPasswordToggle, IonButton, IonSpinner, IonBackButton, IonButtons, IonText, TranslateModule],
  templateUrl: './wifi-setup.page.html',
  styles: [`
    .scan-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 4rem 2rem;
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
export class WifiSetupPage implements OnDestroy {
  scanning = false;
  connecting = false;
  wifiError = false;
  networks: WifiNetwork[] = [];
  selectedNetwork: WifiNetwork | null = null;
  password = '';
  private sub?: Subscription;

  constructor(private ble: BleService, private router: Router) {
    addIcons({ wifiOutline });
  }

  async ionViewWillEnter() {
    this.sub = this.ble.wifiScanResults$.subscribe(result => {
      this.networks = result.n.sort((a, b) => b.r - a.r);
      this.scanning = false;
    });
    await this.startScan();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  async startScan() {
    this.scanning = true;
    this.networks = [];
    await this.ble.triggerWifiScan();
  }

  wifiLevel(rssi: number): number {
    if (rssi >= -50) return 4;
    if (rssi >= -65) return 3;
    if (rssi >= -75) return 2;
    return 1;
  }

  selectNetwork(net: WifiNetwork) {
    this.selectedNetwork = net;
    this.password = '';
    this.wifiError = false;
  }

  async connectWifi() {
    if (!this.selectedNetwork) return;
    this.connecting = true;
    this.wifiError = false;
    try {
      await this.ble.writeWifiConfig(this.selectedNetwork.s, this.password);

      // Wait for a status notify confirming WiFi connected (timeout 15s)
      const status = await firstValueFrom(
        this.ble.deviceStatus$.pipe(
          filter(s => s.wifi === true || s.wifi === false),
          timeout(15000)
        )
      );

      if (status.wifi) {
        this.router.navigate(['/wizard/timezone']);
      } else {
        this.wifiError = true;
      }
    } catch (e) {
      console.error('WiFi config error:', e);
      this.wifiError = true;
    }
    this.connecting = false;
  }
}
