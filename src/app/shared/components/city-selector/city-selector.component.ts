import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonList, IonItem, IonLabel, IonButtons, IonButton, IonSpinner,
  IonNote, ModalController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { WeatherService, GeoCity } from '../../../core/services/weather.service';

@Component({
  selector: 'app-city-selector',
  standalone: true,
  imports: [
    CommonModule, TranslateModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
    IonList, IonItem, IonLabel, IonButtons, IonButton, IonSpinner, IonNote,
  ],
  templateUrl: './city-selector.component.html',
  styleUrl: './city-selector.component.scss',
})
export class CitySelectorComponent {
  @Input() apiKey = '';

  results: GeoCity[] = [];
  searching = false;
  resolving = false;
  searched = false;

  constructor(
    private weatherService: WeatherService,
    private modalCtrl: ModalController,
  ) {}

  async onSearch(event: any) {
    const query = (event.detail.value ?? '').trim();
    if (query.length < 2) {
      this.results = [];
      this.searched = false;
      return;
    }
    this.searching = true;
    this.searched = true;
    try {
      this.results = await this.weatherService.searchCities(query, this.apiKey);
    } catch {
      this.results = [];
    }
    this.searching = false;
  }

  async select(city: GeoCity) {
    this.resolving = true;
    const result = await this.weatherService.getCityId(city.lat, city.lon, this.apiKey);
    this.resolving = false;
    if (result) {
      this.modalCtrl.dismiss({
        cityId: result.id,
        cityName: city.localName,
        country: city.country,
      });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss(null);
  }
}
