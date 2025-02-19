// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CapituloComponent } from './forms/capitulo/capitulo.component';
import { OtrosComponent } from './forms/otros/otros.component';
import { RosComponent } from './forms/ros/ros.component';
import { DdiComponent } from './forms/ddi/ddi.component';
import { SagrilaftComponent } from './forms/sagrilaft/sagrilaft.component';
import { LeyesComponent } from './forms/leyes/leyes.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'incumplimiento-capitulo', component: CapituloComponent },
  { path: 'otros-incumplimientos', component: OtrosComponent },
  { path: 'incumplimientos-ros', component: RosComponent },
  { path: 'incumplimiento-ddi', component: DdiComponent },
  { path: 'etapas-sagrilaft', component: SagrilaftComponent },
  { path: 'violacion-leyes', component: LeyesComponent },
];

