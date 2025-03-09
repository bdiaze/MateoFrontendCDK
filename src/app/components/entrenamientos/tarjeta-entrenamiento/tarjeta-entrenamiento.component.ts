import { Component, Input } from '@angular/core';
import { Entrenamiento } from '../../../models/entrenamiento';
import { DatePipe } from '@angular/common';
import { Segundos } from '@helpers/segundos';

@Component({
  selector: 'app-tarjeta-entrenamiento',
  imports: [ DatePipe ],
  templateUrl: './tarjeta-entrenamiento.component.html',
  styleUrl: './tarjeta-entrenamiento.component.css'
})
export class TarjetaEntrenamientoComponent {
    @Input() entrenamiento!: Entrenamiento;

    segundosATexto(segundos: number) {
        return Segundos.segundosATexto(segundos);
    }
}
