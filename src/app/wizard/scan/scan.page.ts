import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonIcon, IonSpinner, IonButton, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';
import { BleService } from '../../core/services/ble.service';
import { BleDevice } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonIcon, IonSpinner, IonButton, IonBackButton, IonButtons, TranslateModule],
  templateUrl: './scan.page.html',
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
export class ScanPage {
  scanning = false;
  devices: BleDevice[] = [];

  constructor(private ble: BleService, private router: Router) {
    addIcons({ searchOutline });
  }

  async ionViewWillEnter() {
    await this.scan();
  }

  async scan() {
    this.scanning = true;
    this.devices = [];
    try {
      await this.ble.initialize();
      this.devices = await this.ble.scanForDevices();
    } catch (e) {
      console.error('Scan error:', e);
    }
    this.scanning = false;
  }

  selectDevice(device: BleDevice) {
    this.router.navigate(['/wizard/pin'], { state: { deviceId: device.deviceId, deviceName: device.name } });
  }
}
