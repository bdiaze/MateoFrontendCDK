import { Component } from '@angular/core';
import { AuthError } from 'aws-amplify/auth';
import { CognitoAuthenticationService } from '../services/cognito-authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  mensajeCierreSesion: string = '';

  constructor(private cognitoAuthenticationService: CognitoAuthenticationService, private router: Router) {
    this.cerrarSesion();
  }

  cerrarSesion() {
    this.mensajeCierreSesion = 'Estamos cerrando su sesión, espere unos segundos...';

    this.cognitoAuthenticationService.cerrarSesion()
    .then(() => {
      this.mensajeCierreSesion = 'Sesión finalizada. Será redireccionado en 5 segundos...';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 5000);
    })
    .catch(() => {
        this.mensajeCierreSesion = 'Ocurrió un error inesperado, intente nuevamente...';
    });
  }
}
