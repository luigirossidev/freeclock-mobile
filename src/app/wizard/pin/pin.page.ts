import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonSpinner,
  IonText, IonBackButton, IonButtons, IonInput, IonItem,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { BleService } from '../../core/services/ble.service';
import { StorageService } from '../../core/services/storage.service';

type Phase = 'idle' | 'connecting' | 'pin' | 'verifying';

@Component({
  selector: 'app-pin',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonSpinner,
    IonText, IonBackButton, IonButtons, IonInput, IonItem,
  ],
  templateUrl: './pin.page.html',
})
export class PinPage {
  phase: Phase = 'idle';
  pinValue = '';
  pinError = false;
  error = '';
  private deviceId = '';
  private deviceName = '';
  private navigatingForward = false;

  constructor(
    private ble: BleService,
    private storage: StorageService,
    private router: Router,
  ) {
    const nav = this.router.getCurrentNavigation();
    this.deviceId = nav?.extras?.state?.['deviceId'] || '';
    this.deviceName = nav?.extras?.state?.['deviceName'] || 'FreeClock';
  }

  ionViewWillEnter() {
    this.navigatingForward = false;
    this.phase = 'idle';
    this.pinValue = '';
    this.pinError = false;
    this.error = '';
    this.connectDevice();
  }

  ionViewWillLeave() {
    if (!this.navigatingForward) {
      this.ble.disconnect();
    }
  }

  async connectDevice() {
    if (!this.deviceId) {
      this.error = 'No device selected';
      return;
    }
    this.phase = 'connecting';
    this.error = '';
    this.pinError = false;
    try {
      await this.ble.connect(this.deviceId);
      this.phase = 'pin';
    } catch (e: any) {
      this.phase = 'idle';
      this.error = e.message || 'Connection failed';
    }
  }

  async verifyPin() {
    this.pinError = false;
    this.phase = 'verifying';
    try {
      const pin = parseInt(this.pinValue, 10);
      const ok = await this.ble.authenticate(pin);
      if (ok) {
        this.navigatingForward = true;
        await this.storage.addPairedDevice({
          id: this.deviceId,
          name: this.deviceName || 'FreeClock',
          pin,
        });
        this.router.navigate(['/wizard/wifi-setup']);
      } else {
        this.pinError = true;
        this.pinValue = '';
        this.phase = 'pin';
      }
    } catch (e: any) {
      this.error = e.message || 'Verification failed';
      this.phase = 'pin';
    }
  }
}
