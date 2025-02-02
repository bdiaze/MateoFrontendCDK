import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthError } from 'aws-amplify/auth';
import { CognitoAuthenticationService } from '../services/cognito-authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  mostrandoContrasenna: boolean = false;
  loading: boolean = false;
  mensajeErrorGeneral: string = '';

  formBuilder = inject(NonNullableFormBuilder);
  loginForm: FormGroup = this.formBuilder.group({
    username: this.formBuilder.control('', {
      validators: [Validators.required]
    }),
    contrasenna: this.formBuilder.control('', {
      validators: [Validators.required]
    })
  });

  constructor(private cognitoAuthenticationService: CognitoAuthenticationService, private router: Router) {

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

    this.loading = true;
    this.cognitoAuthenticationService.iniciarSesion(this.loginForm.controls['username'].value, this.loginForm.controls['contrasenna'].value)
    .then(() => {
      this.router.navigate(['/logout']);
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
}
