import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthError, SignInOutput } from 'aws-amplify/auth';
import { CognitoService } from '@services/cognito/cognito.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  mostrandoContrasenna: boolean = false;
  loading: boolean = false;
  mensajeErrorGeneral: string = '';
  sesionIniciada: boolean = true;

  formBuilder = inject(NonNullableFormBuilder);
  loginForm: FormGroup = this.formBuilder.group({
    username: this.formBuilder.control('', {
      validators: [Validators.required]
    }),
    contrasenna: this.formBuilder.control('', {
      validators: [Validators.required]
    })
  });

  constructor(private cognitoService: CognitoService, private router: Router) {
    this.validarSiSesionIniciada();
  }

  mostrarContrasenna() {
    this.mostrandoContrasenna = true;
  }

  ocultarContrasenna() {
    this.mostrandoContrasenna = false;
  }

  onSubmit() {
    // Se resetean variables previo a intento de inicio de sesión...
    this.mensajeErrorGeneral = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    let username:string = this.loginForm.controls['username'].value;
    let contrasenna:string = this.loginForm.controls['contrasenna'].value;

    this.loading = true;
    this.cognitoService.iniciarSesion(username, contrasenna)
    .then((content: SignInOutput) => {
      let nextStep:string = content.nextStep.signInStep;
      if (nextStep == 'DONE') {
        this.router.navigate(['/cronometro']);
      } else if (nextStep == 'CONFIRM_SIGN_UP') {
        this.router.navigate(['/accountverification', username]);
      }
    })
    .catch((error) => {
      if (error instanceof AuthError) {
        if (error.name === 'NotAuthorizedException') {
          this.mensajeErrorGeneral = 'Nombre de usuario y/o contraseña inválidos...'
          return;
        } else if (error.name === 'UserAlreadyAuthenticatedException') {
          this.mensajeErrorGeneral = 'Usted ya tiene una sesión activa...'
          return;
        }
      }
      console.log('Ocurrió un error al iniciar sesión: ' + error);
      this.mensajeErrorGeneral = 'Ocurrió un error inesperado, intente nuevamente...';
    })
    .finally(() => {
      this.loading = false;
    });
  }

  validarSiSesionIniciada() {
    // Se asume que la sesión está inicializada...
    this.sesionIniciada = true;

    // Se valida si la sesión está inicializada...
    this.cognitoService.obtenerUsuarioActual()
    .then((session) => {
      this.sesionIniciada = true;
      this.router.navigate(['/cronometro']);
    })
    .catch((error) => {
      if (error instanceof AuthError) {
        if (error.name === 'UserUnAuthenticatedException') {
          this.sesionIniciada = false;
          return;
        }
      }

      console.log('Ocurrió un error al validar si usuario tenía su sesión iniciada: ' + error);
      this.mensajeErrorGeneral = 'Ocurrió un error inesperado, intente nuevamente...';
    });
  }
}
