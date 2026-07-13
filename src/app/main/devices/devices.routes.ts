import { Routes } from '@angular/router';

export const devicesRoutes: Routes = [
  { path: '', loadComponent: () => import('./devices-list.page').then(m => m.DevicesListPage) },
  { path: ':deviceId', loadComponent: () => import('./device-detail.page').then(m => m.DeviceDetailPage) },
  { path: ':deviceId/general', loadComponent: () => import('./settings/general/general.page').then(m => m.GeneralPage) },
  { path: ':deviceId/time-weather', loadComponent: () => import('./settings/time-weather/time-weather.page').then(m => m.TimeWeatherPage) },
  { path: ':deviceId/news', loadComponent: () => import('./settings/news/news.page').then(m => m.NewsPage) },
  { path: ':deviceId/brand', loadComponent: () => import('./settings/brand/brand.page').then(m => m.BrandPage) },
  { path: ':deviceId/jukebox', loadComponent: () => import('./settings/jukebox/jukebox.page').then(m => m.JukeboxPage) },
  { path: ':deviceId/quote-quiz', loadComponent: () => import('./settings/quote-quiz/quote-quiz.page').then(m => m.QuoteQuizPage) },
  { path: ':deviceId/display', loadComponent: () => import('./settings/display/display.page').then(m => m.DisplayPage) },
{ path: ':deviceId/wifi', loadComponent: () => import('./settings/wifi/wifi.page').then(m => m.WifiPage) },
  { path: ':deviceId/update', loadComponent: () => import('./settings/update/update.page').then(m => m.UpdatePage) },
  { path: ':deviceId/device-info', loadComponent: () => import('./settings/device-info/device-info.page').then(m => m.DeviceInfoPage) },
  // Pagine specifiche dei dispositivi Oraquadra
  { path: ':deviceId/oq-clock', loadComponent: () => import('./settings/oq-clock/oq-clock.page').then(m => m.OqClockPage) },
  { path: ':deviceId/oq-scroll', loadComponent: () => import('./settings/oq-scroll/oq-scroll.page').then(m => m.OqScrollPage) },
  { path: ':deviceId/oq-digital', loadComponent: () => import('./settings/oq-digital/oq-digital.page').then(m => m.OqDigitalPage) },
  { path: ':deviceId/oq-timezone', loadComponent: () => import('./settings/oq-timezone/oq-timezone.page').then(m => m.OqTimezonePage) },
];
