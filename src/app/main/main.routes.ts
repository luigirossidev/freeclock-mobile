import { Routes } from '@angular/router';

export const mainRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tabs/tabs.component').then(m => m.TabsComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./home/home.page').then(m => m.HomePage) },
      { path: 'home/news/:id', loadComponent: () => import('./home/news-detail/news-detail.page').then(m => m.NewsDetailPage) },
      { path: 'devices', loadChildren: () => import('./devices/devices.routes').then(m => m.devicesRoutes) },
      { path: 'info', loadComponent: () => import('./info/info.page').then(m => m.InfoPage) },
    ],
  },
];
