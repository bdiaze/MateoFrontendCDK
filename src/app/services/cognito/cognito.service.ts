import { Injectable } from '@angular/core';
import { Amplify } from 'aws-amplify';
import { confirmSignUp, fetchAuthSession, getCurrentUser, resendSignUpCode, signIn, signOut, signUp, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor() {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: environment.cognitoService.userPoolId,
          userPoolClientId: environment.cognitoService.clientId
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

  solicitarCodigoRecuperacionContrasenna(username:string) {
    return resetPassword({ username });
  }

  recuperarContrasenna(username:string, confirmationCode:string, newPassword:string) {
    return confirmResetPassword({ username, confirmationCode, newPassword });
  }
}

