import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatToolbarModule,  MatFormFieldModule, MatInputModule} from '@angular/material';
// import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import 'hammerjs';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CliViewComponent } from './cli-view/cli-view.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { CliLoginComponent } from './cli-login/cli-login.component';
import { NgxElectronModule } from 'ngx-electron';
import { HttpClientModule } from '@angular/common/http';
import { UploadModule } from './cli-view/upload/upload.module';
import { FileRightsComponent } from './cli-view/file-rights/file-rights.component';

@NgModule({
  declarations: [
    AppComponent,
    CliViewComponent,
    AdminViewComponent,
    CliLoginComponent,
    FileRightsComponent,
   ],
  imports: [
    // FormGroup, 
    // FormBuilder, 
    // FormArray, 
    // FormControl,
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
    UploadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
