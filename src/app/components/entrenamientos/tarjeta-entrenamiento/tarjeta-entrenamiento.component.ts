import { Component, Input } from '@angular/core';
import { Entrenamiento } from '../../../models/entrenamiento';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tarjeta-entrenamiento',
  imports: [ DatePipe ],
  templateUrl: './tarjeta-entrenamiento.component.html',
  styleUrl: './tarjeta-entrenamiento.component.css'
})
export class TarjetaEntrenamientoComponent {
    @Input() entrenamiento!: Entrenamiento;
}
