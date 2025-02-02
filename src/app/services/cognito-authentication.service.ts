import { Injectable } from '@angular/core';
import { Amplify } from 'aws-amplify';
import { confirmSignUp, fetchAuthSession, getCurrentUser, resendSignUpCode, signIn, signOut, signUp } from 'aws-amplify/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CognitoAuthenticationService {

  constructor() {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: environment.userPoolId,
          userPoolClientId: environment.clientId
        }
      }
    });
  }

  iniciarSesion(username: string, password: string): Promise<any> {
    return signIn({ username, password });
  }

  cerrarSesion(): Promise<any> {
    return signOut();
  }

  crearCuenta(username: string, email: string, password: string): Promise<any> {
    return signUp({
      username,
      password,
      options: {
        userAttributes: {
          email
        }
      }
    });
  }

  confirmarCorreo(username: string, confirmationCode: string): Promise<any>{
    return confirmSignUp({ username, confirmationCode });
  }

  solicitarNuevoCodigoConfirmacion(username: string): Promise<any> {
    return resendSignUpCode({ username });
  }

  obtenerSesionAuth() {
    return fetchAuthSession();
  }

  obtenerUsuarioActual() {
    return getCurrentUser();
  }
}
