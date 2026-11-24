import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonList, IonItem, IonInput, IonSelect, IonSelectOption,
  IonFooter, IonButton, IonSpinner, IonNote, ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DeviceStoreService } from '../../../../core/services/device-store.service';
import { BleService } from '../../../../core/services/ble.service';
import { CHAR_MELODY_UUID } from '../../../../core/constants/ble-uuids';
import { MelodyItem } from '../../../../core/models/device-config.model';

const FALLBACK_MELODIES: MelodyItem[] = [
  { i:  0, n: 'Baby Elephant Walk' },
  { i:  1, n: 'Brahms Lullaby' },
  { i:  2, n: 'Doom E1M1' },
  { i:  3, n: 'Fur Elise' },
  { i:  4, n: 'Game of Thrones' },
  { i:  5, n: 'Happy Birthday' },
  { i:  6, n: 'Harry Potter Theme' },
  { i:  7, n: 'Imperial March' },
  { i:  8, n: 'Keyboard Cat' },
  { i:  9, n: 'Merry Christmas' },
  { i: 10, n: 'Minuet in G' },
  { i: 11, n: 'Never Gonna Give You Up' },
  { i: 12, n: 'Nokia Ringtone' },
  { i: 13, n: 'Ode to Joy' },
  { i: 14, n: 'Pac-Man' },
  { i: 15, n: 'Pink Panther' },
  { i: 16, n: 'Silent Night' },
  { i: 17, n: 'Star Trek Intro' },
  { i: 18, n: 'Star Wars Theme' },
  { i: 19, n: 'Super Mario Bros' },
  { i: 20, n: 'Take On Me' },
  { i: 21, n: 'Tetris Theme' },
  { i: 22, n: 'The Godfather' },
  { i: 23, n: 'Zelda Lullaby' },
  { i: 24, n: 'Zelda Theme' },
  { i: 25, n: 'Rose Rosse' },
  { i: 26, n: 'The Flintstones' },
  { i: 27, n: 'Berverly Hills Cop Jingle' },
];

@Component({
  selector: 'app-jukebox',
  standalone: true,
  imports: [
    FormsModule, TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonList, IonItem, IonInput, IonSelect, IonSelectOption,
    IonFooter, IonButton, IonSpinner, IonNote,
  ],
  templateUrl: './jukebox.page.html',
})
export class JukeboxPage {
  melodies: MelodyItem[] = [];
  selectedId = 0;
  message = '';
  repeatCount = 1;
  sending = false;
  loading = false;

  constructor(
    private ble: BleService,
    private store: DeviceStoreService,
    private toastCtrl: ToastController,
    private translate: TranslateService,
  ) {}

  async ionViewWillEnter() {
    this.loading = true;
    try {
      const result = await this.ble.readCharacteristic<{ m: MelodyItem[] }>(CHAR_MELODY_UUID);
      this.melodies = result.m?.length ? result.m : FALLBACK_MELODIES;
    } catch {
      this.melodies = FALLBACK_MELODIES;
    }
    this.selectedId = this.melodies[0].i;
    this.loading = false;
  }

  async play() {
    const rep = Math.min(1000, Math.max(1, Math.round(this.repeatCount)));
    this.sending = true;
    try {
      await this.store.writeMelody({ id: this.selectedId, msg: (this.message ?? '').trim(), rep });
      const toast = await this.toastCtrl.create({
        message: this.translate.instant('JUKEBOX.SENT'),
        duration: 1500,
        position: 'bottom',
        color: 'success',
      });
      await toast.present();
    } catch {
      const toast = await this.toastCtrl.create({
        message: this.translate.instant('COMMON.ERROR'),
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    }
    this.sending = false;
  }
}
