import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

export const routes: Routes = [
  { path: '', component: LoginComponent, title: 'Inicio de Sesión' },
  { path: 'login', component: LoginComponent, title: 'Inicio de Sesión' },
  { path: 'logout', component: LogoutComponent, title: 'Cerrar Sesión' }
];
