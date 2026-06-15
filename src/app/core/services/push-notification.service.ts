import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      await FirebaseMessaging.addListener('tokenReceived', (event) => {
        console.log('FCM token refreshed:', event.token);
      });

      await FirebaseMessaging.addListener('notificationReceived', (event) => {
        console.log('Notification received in foreground:', event.notification);
      });

      await FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
        console.log('Notification tapped:', event.notification);
      });

      // iOS mostra il prompt solo se lo stato è 'prompt' (non ancora deciso):
      // se l'utente ha gia' risposto in passato, requestPermissions non
      // ripropone il dialog. Logghiamo lo stato per diagnosticare.
      const current = await FirebaseMessaging.checkPermissions();
      console.log('Push permission status (check):', current.receive);

      const permission = await FirebaseMessaging.requestPermissions();
      console.log('Push permission status (request):', permission.receive);
      if (permission.receive !== 'granted') {
        console.warn('Push notification permission not granted');
        return;
      }

      const { token } = await FirebaseMessaging.getToken();
      console.log('FCM token:', token);
    } catch (error) {
      console.error('Push notification initialization failed:', error);
    }
  }

  async removeListeners(): Promise<void> {
    await FirebaseMessaging.removeAllListeners();
  }
}
