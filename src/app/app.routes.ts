import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { CreacionUsuarioComponent } from './creacion-usuario/creacion-usuario.component';
import { ConfirmarCorreoComponent } from './confirmar-correo/confirmar-correo.component';

export const routes: Routes = [
  { path: '', component: LoginComponent, title: 'Inicio de Sesión' },
  { path: 'login', component: LoginComponent, title: 'Inicio de Sesión' },
  { path: 'logout', component: LogoutComponent, title: 'Cerrar Sesión' },
  { path: 'usercreation', component: CreacionUsuarioComponent, title: 'Creación de Cuenta' },
  { path: 'accountverification/:username', component: ConfirmarCorreoComponent, title: 'Verificación de Cuenta' },
];
