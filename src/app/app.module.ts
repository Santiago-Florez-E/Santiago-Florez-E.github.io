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


// Importa tus rutas definidas en app.routes.ts
import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CapituloComponent,
    OtrosComponent,
    RosComponent,
    DdiComponent,
    SagrilaftComponent,
    LeyesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,                  // <-- IMPORTANTE para que funcione ngModel
    RouterModule.forRoot(routes)  // <-- Carga las rutas
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
