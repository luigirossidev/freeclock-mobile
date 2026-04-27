import { Routes } from '@angular/router';

export const wizardRoutes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', loadComponent: () => import('./welcome/welcome.page').then(m => m.WelcomePage) },
  { path: 'scan', loadComponent: () => import('./scan/scan.page').then(m => m.ScanPage) },
  { path: 'pin', loadComponent: () => import('./pin/pin.page').then(m => m.PinPage) },
  { path: 'wifi-setup', loadComponent: () => import('./wifi-setup/wifi-setup.page').then(m => m.WifiSetupPage) },
  { path: 'timezone', loadComponent: () => import('./timezone/timezone.page').then(m => m.WizardTimezonePage) },
  { path: 'done', loadComponent: () => import('./done/done.page').then(m => m.DonePage) },
];
