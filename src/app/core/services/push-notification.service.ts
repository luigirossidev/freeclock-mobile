import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    await FirebaseMessaging.addListener('tokenReceived', (event) => {
      console.log('FCM token refreshed:', event.token);
    });

    await FirebaseMessaging.addListener('notificationReceived', (event) => {
      console.log('Notification received in foreground:', event.notification);
    });

    await FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
      console.log('Notification tapped:', event.notification);
    });

    const permission = await FirebaseMessaging.requestPermissions();
    if (permission.receive !== 'granted') {
      console.warn('Push notification permission not granted');
      return;
    }

    const { token } = await FirebaseMessaging.getToken();
    console.log('FCM token:', token);
  }

  async removeListeners(): Promise<void> {
    await FirebaseMessaging.removeAllListeners();
  }
}
