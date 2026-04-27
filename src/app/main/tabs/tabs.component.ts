import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { home, bluetooth, informationCircle } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, TranslateModule],
  templateUrl: './tabs.component.html',
})
export class TabsComponent {
  constructor() {
    addIcons({ home, bluetooth, informationCircle });
  }
}
