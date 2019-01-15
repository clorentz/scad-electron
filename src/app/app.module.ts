import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatToolbarModule,  MatFormFieldModule, MatInputModule} from '@angular/material';
import 'hammerjs';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CliViewComponent } from './cli-view/cli-view.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { CliLoginComponent } from './cli-login/cli-login.component';
// import { AppendInitVectComponent } from './cli-view/append-init-vect/append-init-vect.component';
import { NgxElectronModule } from 'ngx-electron';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    CliViewComponent,
    AdminViewComponent,
    CliLoginComponent,
    // AppendInitVectComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule, 
    MatCheckboxModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule, 
    NgxElectronModule, 
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
