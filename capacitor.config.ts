import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.luigirossi.freeclock',
  appName: 'FreeClock',
  webDir: 'www',
  "plugins": {
    "SystemBars": {
      "insetsHandling": "disable"
    },
    "Keyboard": {
      "resizeOnFullScreen": false
    },
    "FirebaseMessaging": {
      "presentationOptions": ["alert", "badge", "sound"]
    }
  }
};

export default config;
