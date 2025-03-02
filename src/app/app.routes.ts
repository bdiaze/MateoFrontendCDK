import { Routes } from '@angular/router';
import { LoginComponent } from './components/user-management/login/login.component';
import { LogoutComponent } from './components/user-management/logout/logout.component';
import { CreacionUsuarioComponent } from './components/user-management/creacion-usuario/creacion-usuario.component';
import { ConfirmarCorreoComponent } from './components/user-management/confirmar-correo/confirmar-correo.component';
import { RecuperarContrasennaComponent } from './components/user-management/recuperar-contrasenna/recuperar-contrasenna.component';
import { ListaEntrenamientosComponent } from './components/entrenamientos/lista-entrenamientos/lista-entrenamientos.component';

export const routes: Routes = [
  { path: '', component: LoginComponent, title: 'Inicio de Sesión' },
  { path: 'login', component: LoginComponent, title: 'Inicio de Sesión' },
  { path: 'logout', component: LogoutComponent, title: 'Cerrar Sesión' },
  { path: 'usercreation', component: CreacionUsuarioComponent, title: 'Creación de Cuenta' },
  { path: 'accountverification/:username', component: ConfirmarCorreoComponent, title: 'Verificación de Cuenta' },
  { path: 'recuperarcontrasenna', component: RecuperarContrasennaComponent, title: 'Recuperar Contraseña' },
  { path: 'listaentrenamientos', component: ListaEntrenamientosComponent, title: 'Lista Entrenamientos' },
  { path: '**', redirectTo: ''},
];
