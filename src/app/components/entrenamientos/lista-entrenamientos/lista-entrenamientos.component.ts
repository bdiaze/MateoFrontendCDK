import { Component, inject } from '@angular/core';
import { EntrenamientoService } from '../../../services/mateo/entrenamiento.service';
import { SalEntrenamiento } from '../../../models/sal-entrenamiento';
import { TarjetaEntrenamientoComponent } from '../tarjeta-entrenamiento/tarjeta-entrenamiento.component';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-entrenamientos',
  imports: [TarjetaEntrenamientoComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './lista-entrenamientos.component.html',
  styleUrl: './lista-entrenamientos.component.css'
})
export class ListaEntrenamientosComponent {
    numPagina: number;
    cantElemPagina: number;
    cargando: boolean = true;

    formBuilder = inject(NonNullableFormBuilder);

    desdeHastaForm: FormGroup = this.formBuilder.group({
        desde: this.formBuilder.control('', {
            validators: [
                Validators.required,
                //Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0,1,2])\/(19|20)\d{2}$/)
            ]
        }),
        hasta: this.formBuilder.control('', {
            validators: [
                Validators.required,
                //Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0,1,2])\/(19|20)\d{2}$/)
            ]
        }),
    });

    salEntrenamientos:SalEntrenamiento | undefined;
    paginas: number[] | undefined;

    constructor(private entrenamientoService:EntrenamientoService) {
        // "Hasta": Fecha actual y "Desde": Día anterior...
        let hastaDate = new Date();
        this.desdeHastaForm.controls['hasta'].setValue(`${hastaDate.getFullYear().toString().padStart(4, "0")}-${(hastaDate.getMonth() + 1).toString().padStart(2, "0")}-${hastaDate.getDate().toString().padStart(2, "0")}`);
        // Desde: El día anterior...
        let desdeDate = new Date(hastaDate.getTime() - (1 * 24 * 60 * 60 * 1000));
        this.desdeHastaForm.controls['desde'].setValue(`${desdeDate.getFullYear().toString().padStart(4, "0")}-${(desdeDate.getMonth() + 1).toString().padStart(2, "0")}-${desdeDate.getDate().toString().padStart(2, "0")}`);

        this.numPagina = 1;
        this.cantElemPagina = 10;

        this.obtenerEntrenamientos();
    }

    obtenerEntrenamientos() {
        if (this.desdeHastaForm.invalid) {
            return;
        }

        let desdeArray: string[] = this.desdeHastaForm.controls['desde'].value.split("-");
        let hastaArray: string[] = this.desdeHastaForm.controls['hasta'].value.split("-");

        let desdeDate: Date = new Date(Date.UTC(parseInt(desdeArray[0]), parseInt(desdeArray[1]) - 1, parseInt(desdeArray[2])));
        let hastaDate: Date = new Date((new Date(Date.UTC(parseInt(hastaArray[0]), parseInt(hastaArray[1]) - 1, parseInt(hastaArray[2])))).getTime() + (1 * 24 * 60 * 60 * 1000));
        this.cargando = true;
        this.entrenamientoService.listar(desdeDate, hastaDate, this.numPagina, this.cantElemPagina)
        .subscribe((response:SalEntrenamiento) => {
            this.salEntrenamientos = response
            this.paginas = new Array(this.salEntrenamientos.totalPaginas).fill(0).map((n, index) => index + 1);
            this.cargando = false;
        });
    }

    cambiarPagina(nuevaPagina: number) {
        if (nuevaPagina < 1 || nuevaPagina > this.salEntrenamientos?.totalPaginas!) {
            return;
        }
        this.numPagina = nuevaPagina;
        this.obtenerEntrenamientos();
    }
}
