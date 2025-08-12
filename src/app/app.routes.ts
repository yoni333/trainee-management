import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/data', 
    pathMatch: 'full' 
  },
  { 
    path: 'data', 
    loadComponent: () => import('./features/data/containers/data-page/data-page.component')
      .then(c => c.DataPageComponent),
    title: 'Data Management'
  },
  { 
    path: 'analysis', 
    loadComponent: () => import('./features/analysis/analysis.component')
      .then(c => c.AnalysisComponent),
    title: 'Performance Analysis'
  },
  { 
    path: 'monitor', 
    loadComponent: () => import('./features/monitor/monitor.component')
      .then(c => c.MonitorComponent),
    title: 'Monitoring Dashboard'
  },
  {
    path: '**',
    redirectTo: '/data'
  }
];
