import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CognitoAuthenticationService } from '../../../services/cognito-authentication.service';
import { Router, RouterModule } from '@angular/router';
import { AuthError, SignUpOutput } from 'aws-amplify/auth';
import { confirmedPasswordValidator, passwordStrengthValidator } from '../../../helpers/validators/password-confirmation';

@Component({
  selector: 'app-creacion-usuario',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './creacion-usuario.component.html',
  styleUrl: './creacion-usuario.component.css'
})
export class CreacionUsuarioComponent {
  mostrandoContrasenna: boolean = false;
  loading: boolean = false;
  mensajeErrorGeneral: string = '';

  formBuilder = inject(NonNullableFormBuilder);

  contrasennaControl = this.formBuilder.control('', {
    validators: [
      Validators.required,
      Validators.minLength(8),
      passwordStrengthValidator(/[A-Z]+/, 'mayusculasValidator'),
      passwordStrengthValidator(/[a-z]+/, 'minusculasValidator'),
      passwordStrengthValidator(/[0-9]+/, 'numerosValidator'),
      passwordStrengthValidator(/[\^\$\*\.\[\]\{\}\(\)\?\"\!\@\#\%\&\/\\\,\>\<\'\:\;\|\_\~\`\=\+\-]+/, 'simbolosValidator')
    ]
  });

  creacionForm: FormGroup = this.formBuilder.group({
      username: this.formBuilder.control('', {
        validators: [Validators.required]
      }),
      email: this.formBuilder.control('', {
        validators: [
          Validators.required,
          Validators.email
        ]
      }),
      contrasenna: this.contrasennaControl,
      confContrasenna: this.formBuilder.control('', {
        validators: [
          Validators.required,
          confirmedPasswordValidator(this.contrasennaControl)
        ]
      })
    }
  );

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

    if (this.creacionForm.invalid) {
      this.creacionForm.markAllAsTouched();
      return;
    }

    let username:string = this.creacionForm.controls['username'].value;
    let email:string = this.creacionForm.controls['email'].value;
    let contrasenna:string = this.creacionForm.controls['contrasenna'].value;

    this.loading = true;
    this.cognitoAuthenticationService.crearCuenta(username, email, contrasenna)
    .then((content:SignUpOutput) => {
      let nextStep:string = content.nextStep.signUpStep;
      if (nextStep == 'CONFIRM_SIGN_UP') {
        this.router.navigate(['/accountverification', username]);
      }
    })
    .catch((error) => {
      if (error instanceof AuthError) {
        if (error.name === 'UsernameExistsException') {
          this.mensajeErrorGeneral = 'El nombre de usuario ya está en uso...'
          return;
        } else if (error.name === 'InvalidPasswordException') {
          this.mensajeErrorGeneral = 'La contraseña es muy débil...'
          return;
        }
      }
      console.log('Ocurrió un error al crear la cuenta: ' + error);
      this.mensajeErrorGeneral = 'Ocurrió un error inesperado, intente nuevamente...';
    })
    .finally(() => {
      this.loading = false;
    });
  }
}
