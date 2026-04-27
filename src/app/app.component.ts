import { Component, OnDestroy } from '@angular/core';
import { IonApp, IonRouterOutlet, AlertController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { PushNotificationService } from './core/services/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnDestroy {
  constructor(
    private translate: TranslateService,
    private alertCtrl: AlertController,
    private pushNotification: PushNotificationService,
  ) {
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang === 'it' ? 'it' : 'en');

    const applyTheme = (theme: 'light' | 'dark') => {
      document.body.classList.toggle('ion-palette-dark', theme === 'dark');
    };
    applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    if (!Capacitor.isNativePlatform()) {
      (window as any).setLang = (lang: string) => {
        this.translate.use(lang);
        console.log(`Language set to: ${lang}`);
      };
      (window as any).setTheme = (theme: 'light' | 'dark') => {
        applyTheme(theme);
        console.log(`Theme set to: ${theme}`);
      };
      console.log('%c🎛 Dev tools available:', 'font-weight:bold', 'setLang("en") | setLang("it") — setTheme("light") | setTheme("dark")');
    }

    if (Capacitor.isNativePlatform()) {
      App.addListener('backButton', async ({ canGoBack }) => {
        if (!canGoBack) {
          await this.confirmExit();
        }
      });
      this.pushNotification.initialize();
    }
  }

  private async confirmExit(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('COMMON.EXIT_TITLE'),
      message: this.translate.instant('COMMON.EXIT_MESSAGE'),
      buttons: [
        { text: this.translate.instant('COMMON.CANCEL'), role: 'cancel' },
        { text: this.translate.instant('COMMON.EXIT'), handler: () => App.exitApp() },
      ],
    });
    await alert.present();
  }

  ngOnDestroy() {
    if (Capacitor.isNativePlatform()) {
      App.removeAllListeners();
      this.pushNotification.removeListeners();
    }
  }
}
