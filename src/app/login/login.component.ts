import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  mostrandoContrasenna: boolean = false;

  formBuilder = inject(NonNullableFormBuilder);
  loginForm: FormGroup = this.formBuilder.group({
    username: this.formBuilder.control('', {
      validators: [Validators.required]
    }),
    contrasenna: this.formBuilder.control('', {
      validators: [Validators.required]
    })
  });;

  mostrarContrasenna() {
    this.mostrandoContrasenna = true;
  }

  ocultarContrasenna() {
    this.mostrandoContrasenna = false;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    alert(this.loginForm.value.username + ' ' +  this.loginForm.value.contrasenna);
  }
}
