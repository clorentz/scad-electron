import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CliViewComponent} from './cli-view/cli-view.component'
import {AdminViewComponent} from './admin-view/admin-view.component'
import { CliLoginComponent } from './cli-login/cli-login.component';


const routes: Routes = [
  { path: 'cli/home', component: CliViewComponent },
  { path: 'admin', component: AdminViewComponent },
  {path:'cli/login', component: CliLoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
