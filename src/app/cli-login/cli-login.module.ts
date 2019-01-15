import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatButtonModule, MatInputModule } from '@angular/material';
import { AppRoutingModule } from '../app-routing.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    AppRoutingModule,
    MatInputModule
  ],
  exports:[]
})
export class CliLoginModule { }
