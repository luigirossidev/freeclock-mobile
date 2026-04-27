import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonList, IonItem, IonLabel, IonItemGroup, IonItemDivider,
  IonButtons, IonButton, IonIcon, ModalController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { TimezoneService } from '../../../core/services/timezone.service';
import { TimezoneEntry } from '../../../core/constants/timezone-data';

@Component({
  selector: 'app-timezone-selector',
  standalone: true,
  imports: [
    CommonModule, TranslateModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
    IonList, IonItem, IonLabel, IonItemGroup, IonItemDivider,
    IonButtons, IonButton,
  ],
  templateUrl: './timezone-selector.component.html',
  styleUrl: './timezone-selector.component.scss',
})
export class TimezoneSelectorComponent {
  @Input() currentPosix = '';

  groupedResults: { region: string; entries: TimezoneEntry[] }[] = [];

  constructor(
    private tzService: TimezoneService,
    private modalCtrl: ModalController,
  ) {
    this.updateResults('');
  }

  onSearch(event: any) {
    const query = event.detail.value ?? '';
    this.updateResults(query);
  }

  select(tz: TimezoneEntry) {
    this.modalCtrl.dismiss(tz);
  }

  dismiss() {
    this.modalCtrl.dismiss(null);
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
