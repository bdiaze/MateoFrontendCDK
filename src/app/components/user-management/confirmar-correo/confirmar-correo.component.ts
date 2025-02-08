import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CognitoAuthenticationService } from '../../../services/cognito-authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthError } from 'aws-amplify/auth';

@Component({
  selector: 'app-confirmar-correo',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './confirmar-correo.component.html',
  styleUrl: './confirmar-correo.component.css'
})
export class ConfirmarCorreoComponent implements OnInit {
  loading: boolean = false;
  mensajeGeneral: string = '';
  mensajeErrorGeneral: string = '';

  loadingReenviarCodigo: boolean = false;
  deshabilitarReenvioCodigo: boolean = false;
  textoBotonReenviar: string = 'Reenviar código';
  segundosEspera: number = 10;

  formBuilder = inject(NonNullableFormBuilder);

  confirmarForm: FormGroup =  this.formBuilder.group({
    username: this.formBuilder.control('', {
      validators: [Validators.required]
    }),
    confirmationCode: this.formBuilder.control('', {
      validators: [Validators.required]
    })
  });

  constructor(private cognitoAuthenticationService: CognitoAuthenticationService, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.confirmarForm.controls['username'].setValue(this.activatedRoute.snapshot.paramMap.get('username'));
    this.deshabilitarBotonReenviar();
  }

  onSubmit() {
    // Se resetean variables previo a intento de inicio de sesión...
    this.mensajeGeneral = '';
    this.mensajeErrorGeneral = '';

    if (this.confirmarForm.invalid) {
      this.confirmarForm.markAllAsTouched();
      return;
    }

    let usename:string = this.confirmarForm.controls['username'].value;
    let confirmationCode:string = this.confirmarForm.controls['confirmationCode'].value;

    this.loading = true;
    this.cognitoAuthenticationService.confirmarCorreo(usename, confirmationCode)
    .then(() => {
      this.router.navigate(['/login']);
    })
    .catch((error) => {
      if (error instanceof AuthError) {
        if (error.name === 'CodeMismatchException') {
          this.mensajeErrorGeneral = 'El código de verificación ingresado es erróneo...'
          return;
        } else if (error.name === 'ExpiredCodeException') {
          this.mensajeErrorGeneral = 'El código de verificación ha expirado, solicite uno nuevo...'
          return;
        } else if (error.name === 'AliasExistsException') {
          this.mensajeErrorGeneral = 'No es posible activar la cuenta dado que ya existe otro usuario activo con el mismo correo...'
          return;
        }
      }
      console.log('Ocurrió un error al confirmar correo: ' + error);
      this.mensajeErrorGeneral = 'Ocurrió un error inesperado, intente nuevamente...';
    })
    .finally(() => {
      this.loading = false;
    });
  }

  reenviarCodigoVerificacion() {
    this.mensajeGeneral = '';
    this.mensajeErrorGeneral = '';

    let username:string = this.confirmarForm.controls['username'].value;

    this.loadingReenviarCodigo = true;
    this.cognitoAuthenticationService.solicitarNuevoCodigoConfirmacion(username)
    .then(() => {
      this.mensajeGeneral = 'Código de verificación reenviado';
    })
    .catch((error) => {
      if (error instanceof AuthError) {
        if (error.name === 'LimitExceededException') {
          this.mensajeErrorGeneral = 'Has superado la cantidad de reenvíos, intenta más tarde...'
          return;
        }
      }
      console.log('Ocurrió un error al reenviar código de verificación: ' + error);
      this.mensajeErrorGeneral = 'Ocurrió un error inesperado, intente nuevamente...';
    })
    .finally(() => {
      this.loadingReenviarCodigo = false;
      this.deshabilitarBotonReenviar();
    });
  }

  deshabilitarBotonReenviar() {
    this.segundosEspera = 10;
    this.deshabilitarReenvioCodigo = true;
    this.textoBotonReenviar = `[${this.segundosEspera.toString().padStart(2, '0')} seg.] Reenviar código`;

    let interval = setInterval(() => {
      this.segundosEspera--;
      this.textoBotonReenviar = `[${this.segundosEspera.toString().padStart(2, '0')} seg.] Reenviar código`;

      if (this.segundosEspera <= 0) {
        clearInterval(interval);
        this.deshabilitarReenvioCodigo = false;
        this.textoBotonReenviar = 'Reenviar código';
      }
    }, 1000);
  }
}
