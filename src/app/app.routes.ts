import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'wizard',
    loadChildren: () => import('./wizard/wizard.routes').then(m => m.wizardRoutes),
  },
  {
    path: 'main',
    loadChildren: () => import('./main/main.routes').then(m => m.mainRoutes),
  },
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
];
