import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmedPasswordValidator, passwordStrengthValidator } from '../../../helpers/validators/password-confirmation';
import { CognitoService } from '../../../services/cognito/cognito.service';
import { Router, RouterModule } from '@angular/router';
import { AuthError, ResetPasswordOutput } from 'aws-amplify/auth';

@Component({
  selector: 'app-recuperar-contrasenna',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recuperar-contrasenna.component.html',
  styleUrl: './recuperar-contrasenna.component.css'
})
export class RecuperarContrasennaComponent {
  loadingEnvioCodigo = false;
  deshabilitarEnvioCodigo: boolean = false;
  textoBotonEnviar: string = 'Enviar código';
  segundosEspera: number = 10;
  mensajeGeneralEnvio: string = '';

  mostrarFormularioCodigo = false;
  mostrandoContrasenna: boolean = false;
  loading: boolean = false;
  mensajeGeneral: string = '';
  mensajeErrorGeneral: string = '';

  formBuilder = inject(NonNullableFormBuilder);

  enviarCodigoForm: FormGroup = this.formBuilder.group({
    username: this.formBuilder.control('', {
      validators: [Validators.required]
    })
  });

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

  recuperacionForm: FormGroup = this.formBuilder.group({
    username: this.formBuilder.control('', {
      validators: [Validators.required]
    }),
    confirmationCode: this.formBuilder.control('', {
      validators: [Validators.required]
    }),
    contrasenna: this.contrasennaControl,
    confContrasenna: this.formBuilder.control('', {
      validators: [
        Validators.required,
        confirmedPasswordValidator(this.contrasennaControl)
      ]
    })
  });

  constructor(private cognitoService: CognitoService, private router: Router) {

  }

  onSubmitEnviarCodigo() {
    // Se resetean variables...
    this.mensajeGeneralEnvio = '';
    this.mensajeGeneral = '';
    this.mensajeErrorGeneral = '';
    this.mostrarFormularioCodigo = false;
    this.recuperacionForm.controls['username'].setValue('');
    this.recuperacionForm.controls['confirmationCode'].setValue('');
    this.recuperacionForm.controls['contrasenna'].setValue('');
    this.recuperacionForm.controls['confContrasenna'].setValue('');

    if (this.enviarCodigoForm.invalid) {
      this.enviarCodigoForm.markAllAsTouched();
      return;
    }

    let username:string = this.enviarCodigoForm.controls['username'].value;

    this.loadingEnvioCodigo = true;
    this.cognitoService.solicitarCodigoRecuperacionContrasenna(username)
    .then((content:ResetPasswordOutput) => {
      let nextStep:string = content.nextStep.resetPasswordStep;
      if (nextStep == 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        this.mostrarFormularioCodigo = true;
        this.recuperacionForm.controls['username'].setValue(username);
        this.mensajeGeneralEnvio = 'Código de recuperación de contraseña enviado a su correo';
        this.deshabilitarBotonEnviar();
      }
    })
    .catch((error) => {
      if (error instanceof AuthError) {
        if (error.name === 'LimitExceededException') {
          this.mensajeErrorGeneral = 'Has superado la cantidad de envíos, intente más tarde...'
          return;
        }
      }
      console.log('Ocurrió un error al enviar código de recuperación: ' + error);
      this.mensajeErrorGeneral = 'Ocurrió un error inesperado, intente nuevamente...';
    })
    .finally(() =>{
      this.loadingEnvioCodigo = false;
    });
  }

  deshabilitarBotonEnviar() {
    this.segundosEspera = 10;
    this.deshabilitarEnvioCodigo = true;
    this.textoBotonEnviar = `[${this.segundosEspera.toString().padStart(2, '0')} seg.] Enviar código`;

    let interval = setInterval(() => {
      this.segundosEspera--;
      this.textoBotonEnviar = `[${this.segundosEspera.toString().padStart(2, '0')} seg.] Enviar código`;

      if (this.segundosEspera <= 0) {
        clearInterval(interval);
        this.deshabilitarEnvioCodigo = false;
        this.textoBotonEnviar = 'Enviar código';
      }
    }, 1000);
  }

  mostrarContrasenna() {
    this.mostrandoContrasenna = true;
  }

  ocultarContrasenna() {
    this.mostrandoContrasenna = false;
  }

  onSubmit() {
    // Se resetean variables...
    this.mensajeGeneral = '';
    this.mensajeErrorGeneral = '';

    if (this.recuperacionForm.invalid) {
      this.recuperacionForm.markAllAsTouched();
      return;
    }

    let username:string = this.recuperacionForm.controls['username'].value;
    let confirmationCode:string = this.recuperacionForm.controls['confirmationCode'].value;
    let contrasenna:string = this.recuperacionForm.controls['contrasenna'].value;

    this.loading = true;
    this.cognitoService.recuperarContrasenna(username, confirmationCode, contrasenna)
    .then(() => {
      this.router.navigate(['/login']);
    })
    .catch((error) => {
      if (error instanceof AuthError) {
        if (error.name === 'InvalidPasswordException') {
          this.mensajeErrorGeneral = 'La contraseña es muy débil...'
          return;
        } else if (error.name === 'CodeMismatchException') {
          this.mensajeErrorGeneral = 'El código de recuperación es inválido...'
          return;
        }
      }
      console.log('Ocurrió un error al recuperar la contraseña: ' + error);
      this.mensajeErrorGeneral = 'Ocurrió un error inesperado, intente nuevamente...';
    })
    .finally(() => {
      this.loading = false;
    });
  }
}
