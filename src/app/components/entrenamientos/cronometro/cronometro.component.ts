import { Component } from '@angular/core';
import { EntEntrenamiento } from '@models/ent-entrenamiento';
import { EntrenamientoService } from '@services/mateo/entrenamiento.service';

@Component({
  selector: 'app-cronometro',
  templateUrl: './cronometro.component.html',
  styleUrl: './cronometro.component.css'
})
export class CronometroComponent {
    readonly PREENTRENO: string = 'preentreno';
    readonly ENTRENANDO: string = 'entrenando';
    readonly DESCANSANDO: string = 'descansando';

    readonly TIMER_DEFAULT_DESCANSANDO: number = 120;
    readonly TIMER_DEFAULT_ENTRENANDO: number = 0;

    readonly IMAGE_PATH_DESCANSANDO: string = 'zzz.png';
    readonly IMAGE_PATH_ENTRENANDO: string = 'musculo.png';

    readonly TIEMPO_ADICIONAL: number = 15;

    // Variables del estado del cronómetro
    actividad: string = this.PREENTRENO;
    timer: number | undefined;
    deltaTimer: number | undefined;
    interval: ReturnType<typeof setInterval> | undefined;
    imagePath: string | undefined;

    // Variables de la serie...
    serie: number | undefined;
    guid: string | undefined;
    inicio: Date | undefined;
    termino: Date | undefined;

    ultimoTiempoEntrenamiento: number | undefined;
    ultimoTiempoDescanso: number | undefined;

    constructor(private entrenamientoService:EntrenamientoService) {
        this.actividad = this.PREENTRENO;
        this.timer = undefined;
        this.deltaTimer = undefined;
        this.imagePath = this.IMAGE_PATH_ENTRENANDO;
    }

    aumentarTiempo(segundos: number) {
        this.timer && (this.timer += segundos);

        // Se vuelve a setear interval para que cambios en timer no sean tan abruptos visualmente...
        if (this.interval != undefined) {
            clearInterval(this.interval);
            this.interval = undefined;
        }

        if (this.actividad != this.PREENTRENO) {
            this.interval = setInterval(() => {
                this.timer! += this.deltaTimer!;

                if (this.timer! <= 0) {
                    this.cronometroClick();
                }
            }, 1000);
        }
    }

    cronometroClick() {
        // Se cambia al nuevo estado del cronometro...
        if (this.actividad == this.ENTRENANDO) {
            this.actividad = this.DESCANSANDO;
            this.ultimoTiempoEntrenamiento = this.timer;
        } else if (this.actividad == this.DESCANSANDO) {
            // Ya que estamos saliendo del descanso, se ejecutan tareas para grabar serie...
            this.ultimoTiempoDescanso = this.TIMER_DEFAULT_DESCANSANDO - this.timer!;
            this.termino = new Date();

            let entEntrenamiento:EntEntrenamiento = {
                idRequest: this.guid!,
                inicio: this.inicio!,
                termino: this.termino!,
                idTipoEjercicio: undefined,
                serie: this.serie!,
                repeticiones: undefined,
                segundosEntrenamiento: this.ultimoTiempoEntrenamiento,
                segundosDescanso: this.ultimoTiempoDescanso
            };
            this.entrenamientoService.crear(entEntrenamiento)
            .subscribe({
                next: () => {},
                error: (err) => {
                    console.error("Ocurrió un error al crear un nuevo entrenamiento: " + JSON.stringify(err));
                }
            });

            // Se cambia el estado de entrenando...
            this.actividad = this.ENTRENANDO
            this.serie!++;
        } else if (this.actividad == this.PREENTRENO) {
            this.actividad = this.ENTRENANDO;
            this.serie = 1;
        }

        // Se modifica el timer e imagen según la actividad que se está iniciando...
        if (this.actividad == this.ENTRENANDO) {
            this.timer = this.TIMER_DEFAULT_ENTRENANDO;
            this.deltaTimer = 1;
            this.imagePath = this.IMAGE_PATH_ENTRENANDO;
            this.guid = crypto.randomUUID();
            this.inicio = new Date();
        } else if (this.actividad == this.DESCANSANDO) {
            this.timer = this.TIMER_DEFAULT_DESCANSANDO;
            this.deltaTimer = -1;
            this.imagePath = this.IMAGE_PATH_DESCANSANDO;
        } else if (this.actividad == this.PREENTRENO) {
            this.timer = undefined;
            this.deltaTimer = undefined;
            this.imagePath = this.IMAGE_PATH_ENTRENANDO;
            this.guid = undefined;
        }

        // Se setea interval según actividad...
        if (this.interval != undefined) {
            clearInterval(this.interval);
            this.interval = undefined;
        }

        if (this.actividad != this.PREENTRENO) {
            this.interval = setInterval(() => {
                this.timer! += this.deltaTimer!;

                if (this.timer! <= 0) {
                    this.cronometroClick();
                }
            }, 1000);
        }
    }

    timerToString():string | undefined {
        if (this.timer == undefined) return undefined;
        let minutos: number = Math.floor(this.timer / 60);
        let segundos: number = this.timer - minutos * 60;

        return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }
}
