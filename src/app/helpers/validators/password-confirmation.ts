import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function confirmedPasswordValidator(controlPassword: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valorPassword = controlPassword.value;
    const valorConfirmacion = control.value;

    if (!valorConfirmacion) {
      return null;
    }

    return valorPassword !== valorConfirmacion ? { passwordConfirmation: true }: null;
  };
}

export function passwordStrengthValidator(regex: RegExp, nombreValidacion: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const passwordValid = regex.test(value);
    return !passwordValid ? { [nombreValidacion]: true }: null;
  };
}
