import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonFooter,
  IonSearchbar, IonList, IonItem, IonLabel, IonItemGroup, IonItemDivider,
  IonButton, IonButtons, IonBackButton, IonSpinner, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
import { TranslateModule } from '@ngx-translate/core';
import { BleService } from '../../core/services/ble.service';
import { TimezoneService } from '../../core/services/timezone.service';
import { TimezoneEntry } from '../../core/constants/timezone-data';
import { CHAR_TIMEWEATHER_UUID } from '../../core/constants/ble-uuids';

const DEFAULT_IANA = 'Europe/Rome';

@Component({
  selector: 'app-wizard-timezone',
  standalone: true,
  imports: [
    CommonModule, TranslateModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonFooter,
    IonSearchbar, IonList, IonItem, IonLabel, IonItemGroup, IonItemDivider,
    IonButton, IonButtons, IonBackButton, IonSpinner, IonIcon,
  ],
  templateUrl: './timezone.page.html',
  styleUrl: './timezone.page.scss',
})
export class WizardTimezonePage {
  groupedResults: { region: string; entries: TimezoneEntry[] }[] = [];
  selectedIana = DEFAULT_IANA;
  selectedEntry: TimezoneEntry;
  saving = false;

  constructor(
    private ble: BleService,
    private tzService: TimezoneService,
    private router: Router,
  ) {
    addIcons({ checkmarkCircle });
    this.selectedEntry = this.tzService.getAllTimezones().find(tz => tz.iana === DEFAULT_IANA)!;
    this.updateResults('');
  }

  onSearch(event: any) {
    this.updateResults(event.detail.value ?? '');
  }

  select(tz: TimezoneEntry) {
    this.selectedIana = tz.iana;
    this.selectedEntry = tz;
  }

  async confirm() {
    const posix = this.tzService.ianaToPosix(this.selectedIana);
    this.saving = true;
    if (posix) {
      try {
        await this.ble.writeCharacteristic(CHAR_TIMEWEATHER_UUID, { tz: posix });
      } catch {
        // Non bloccante: si procede comunque al passo successivo
      }
    }
    try {
      await this.ble.sendCommand('reboot');
    } catch {
      // Non bloccante: si procede comunque al passo successivo
    }
    this.saving = false;
    this.router.navigate(['/wizard/done']);
  }

  private updateResults(query: string) {
    const results = this.tzService.search(query);
    const map = new Map<string, TimezoneEntry[]>();
    for (const tz of results) {
      const list = map.get(tz.region) ?? [];
      list.push(tz);
      map.set(tz.region, list);
    }
    this.groupedResults = Array.from(map.entries()).map(([region, entries]) => ({ region, entries }));
  }
}
