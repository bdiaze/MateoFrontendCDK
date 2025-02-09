import { Component } from '@angular/core';
import { AuthError } from 'aws-amplify/auth';
import { CognitoAuthenticationService } from '../../../services/cognito-authentication.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [RouterModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  mensajeCierreSesion: string = '';
  mensajeErrorCierreSesion: string = '';
  loading: boolean = false;
  sesionIniciada: boolean = false;
  sesionIniciadaPrincipio: boolean = false;

  constructor(private cognitoAuthenticationService: CognitoAuthenticationService, private router: Router) {
    this.validarSiSesionIniciada(true);
  }

  validarSiSesionIniciada(llamadaInicial:boolean = false) {
    // Se asume que la sesión no está inicializada...
    this.sesionIniciada = false;

    // Se valida si la sesión está inicializada...
    this.cognitoAuthenticationService.obtenerUsuarioActual()
    .then((session) => {
      this.sesionIniciada = true;
    })
    .catch((error) => {
      if (error instanceof AuthError) {
        if (error.name === 'UserUnAuthenticatedException') {
          this.sesionIniciada = false;
          return;
        }
      }

      console.log('Ocurrió un error al validar si usuario tenía su sesión iniciada: ' + error);
      this.mensajeErrorCierreSesion = 'Ocurrió un error inesperado, intente nuevamente...';
    })
    .finally(() =>{
        if (llamadaInicial) {
            this.sesionIniciadaPrincipio = this.sesionIniciada;
        }
    });
  }

  cerrarSesion() {
    this.mensajeCierreSesion = '';
    this.mensajeErrorCierreSesion = '';
    let segundosEspera = 5;

    this.loading = true;
    this.cognitoAuthenticationService.cerrarSesion()
    .then(() => {
      this.mensajeCierreSesion = `Sesión finalizada. Será redireccionado en ${segundosEspera} segundos...`;
      let interval = setInterval(() => {
        segundosEspera--;
        this.mensajeCierreSesion = `Sesión finalizada. Será redireccionado en ${segundosEspera} segundos...`;

        if (segundosEspera <= 0) {
          clearInterval(interval);
          this.router.navigate(['/login']);
        }
      }, 1000);
    })
    .catch(() => {
        this.mensajeErrorCierreSesion = 'Ocurrió un error inesperado, intente nuevamente...';
    })
    .finally(() => {
      this.loading = false;
      // Una vez se termina de llamar al método para cerrar sesión, se vuelve a validar estado de la sesión...
      this.validarSiSesionIniciada();
    });
  }
}
