import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonText } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-done',
  standalone: true,
  imports: [IonContent, IonButton, IonText, TranslateModule],
  templateUrl: './done.page.html',
  styleUrl: './done.page.scss',
})
export class DonePage {
  constructor(private router: Router) {}

  goToApp() {
    this.router.navigate(['/main/devices'], { replaceUrl: true });
  }
}
