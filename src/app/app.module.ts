// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CapituloComponent } from './forms/capitulo/capitulo.component';
import { OtrosComponent } from './forms/otros/otros.component';
import { RosComponent } from './forms/ros/ros.component';
import { DdiComponent } from './forms/ddi/ddi.component';
import { SagrilaftComponent } from './forms/sagrilaft/sagrilaft.component';
import { LeyesComponent } from './forms/leyes/leyes.component';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import {MatDialogModule} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';


// Importa tus rutas definidas en app.routes.ts
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FileModalComponent } from './forms/file-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CapituloComponent,
    OtrosComponent,
    RosComponent,
    DdiComponent,
    SagrilaftComponent,
    LeyesComponent,
    FileModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    MatDialogModule,
    CommonModule
  ],
  bootstrap: [AppComponent],
  providers: [
    provideAnimationsAsync()
  ]
})
export class AppModule { }
