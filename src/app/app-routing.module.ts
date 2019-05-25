import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ConfigureSamComponent } from './configure-sam/configure-sam.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './_guards/auth.guard';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DesignComponent } from './design/design.component';
import { CustomBoardComponent } from './custom-board/custom-board.component';
import { CanDeactivateGuard } from './can-deactivate/can-deactivate.guard';

const routes: Routes = [
  { path: 'customboard', component: CustomBoardComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  // { path: '', component: ConfigureSamComponent },
  { path: 'login', component: LoginComponent },
  { path: 'ConfigureSamComponent', component: ConfigureSamComponent, canActivate: [AuthGuard] },
  // { path: 'homex', component: HomeComponent },
  { path: 'Dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'design/:id', component: DesignComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
