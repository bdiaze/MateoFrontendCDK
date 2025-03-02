import { Component } from '@angular/core';
import { EntrenamientoService } from '../../../services/mateo/entrenamiento.service';
import { SalEntrenamiento } from '../../../models/sal-entrenamiento';
import { TarjetaEntrenamientoComponent } from '../tarjeta-entrenamiento/tarjeta-entrenamiento.component';
import { Entrenamiento } from '../../../models/entrenamiento';

@Component({
  selector: 'app-lista-entrenamientos',
  imports: [TarjetaEntrenamientoComponent],
  templateUrl: './lista-entrenamientos.component.html',
  styleUrl: './lista-entrenamientos.component.css'
})
export class ListaEntrenamientosComponent {
    desde: Date;
    hasta: Date;
    numPagina: number;
    cantElemPagina: number;

    salEntrenamientos:SalEntrenamiento | undefined;

    constructor(private entrenamientoService:EntrenamientoService) {
        this.hasta = new Date()
        this.desde = new Date(this.hasta.getTime() - (7 * 24 * 60 * 60 * 1000));
        this.numPagina = 1;
        this.cantElemPagina = 25;

        this.obtenerEntrenamientos();
    }

    private getTime(date?: Date) {
        return date != null ? date.getTime() : 0;
    }

    private obtenerEntrenamientos() {
        this.entrenamientoService.listar(this.desde, this.hasta, this.numPagina, this.cantElemPagina)
        .subscribe((response:SalEntrenamiento) => {
            this.salEntrenamientos = response
        });
    }
}
