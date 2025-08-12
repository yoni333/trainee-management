import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { traineeReducer } from './app/store/trainee/trainee.reducer';
import { analysisReducer } from './app/store/analysis/analysis.reducer';
import { monitorReducer } from './app/store/monitor/monitor.reducer';
import { TraineeEffects } from './app/store/trainee/trainee.effects';
import { AnalysisEffects } from './app/store/analysis/analysis.effects';
import { MonitorEffects } from './app/store/monitor/monitor.effects';

console.log('🚀 Bootstrapping application with all reducers...');

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideStore({ 
      trainee: traineeReducer,
      analysis: analysisReducer,
      monitor: monitorReducer
    }),
    provideEffects([TraineeEffects, AnalysisEffects, MonitorEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75,
      name: 'Trainee Management App'
    })
  ]
}).catch(err => console.error('❌ Bootstrap error:', err));
