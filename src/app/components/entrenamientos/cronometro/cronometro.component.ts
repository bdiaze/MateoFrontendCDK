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
    readonly TIEMPO_DANGER: number = 10;

    // Variables del estado del cronómetro
    actividad: string = this.PREENTRENO;
    timer: number | undefined;
    interval: ReturnType<typeof setInterval> | undefined;
    entEntrenamiento: EntEntrenamiento | undefined;
    ultimoTiempoDescansoInicial: number | undefined;

    // Animación Botón de Descanso a Entrenar...
    danger: boolean = false;

    constructor(private entrenamientoService:EntrenamientoService) {
        this.actividad = this.PREENTRENO;
        this.timer = undefined;
    }

    aumentarTiempo(segundos: number) {
        this.ultimoTiempoDescansoInicial && (this.ultimoTiempoDescansoInicial += segundos);
        this.timer && (this.timer += segundos);

        // Se vuelve a activar cronometro...
        if (this.actividad != this.PREENTRENO) {
            this.activarCronometro(this.timer!, -1);
        }
    }

    activarCronometro(tiempoInicial: number, deltaTimer: number) {
        if (this.interval != undefined) {
            clearInterval(this.interval);
            this.interval = undefined;
        }

        this.timer = tiempoInicial;
        this.interval = setInterval(() => {
            this.timer! += deltaTimer;

            if (this.timer! <= 0) {
                this.cronometroClick();
            } else if (this.timer! < this.TIEMPO_DANGER && deltaTimer < 0 &&  !this.danger) {
                this.danger = true;
            }
        }, 1000);
    }

    cronometroClick() {
        this.danger = false;

        // Se cambia al nuevo estado del cronometro...
        if (this.actividad == this.ENTRENANDO) {
            this.entEntrenamiento!.segundosEntrenamiento = this.timer;

            // Se cambia al estado de descanso...
            this.actividad = this.DESCANSANDO;
        } else if (this.actividad == this.DESCANSANDO) {
            // Ya que estamos saliendo del descanso, se ejecutan tareas para grabar serie...
            this.entEntrenamiento!.segundosDescanso = this.ultimoTiempoDescansoInicial! - this.timer!;
            this.entEntrenamiento!.termino = new Date();

            this.entrenamientoService.crear(this.entEntrenamiento!)
            .subscribe({
                next: () => {},
                error: (err) => {
                    console.error("Ocurrió un error al crear un nuevo entrenamiento: " + JSON.stringify(err));
                }
            });

            // Se cambia al estado de entrenando...
            this.actividad = this.ENTRENANDO
        } else if (this.actividad == this.PREENTRENO) {
            this.entEntrenamiento = undefined;

            // Se cambia al estado de entrenando...
            this.actividad = this.ENTRENANDO;
        }

        // Según los nuevos estados, se setean variables y se activan los parámetros...
        if (this.actividad == this.ENTRENANDO) {
            this.entEntrenamiento = {
                idRequest: crypto.randomUUID(),
                inicio: new Date(),
                termino: undefined,
                idTipoEjercicio: undefined,
                serie: (this.entEntrenamiento) ? this.entEntrenamiento.serie + 1: 1,
                repeticiones: undefined,
                segundosEntrenamiento: undefined,
                segundosDescanso: undefined
            };

            this.activarCronometro(this.TIMER_DEFAULT_ENTRENANDO, 1);
        } else if (this.actividad == this.DESCANSANDO) {
            this.ultimoTiempoDescansoInicial = this.TIMER_DEFAULT_DESCANSANDO

            this.activarCronometro(this.TIMER_DEFAULT_DESCANSANDO, -1);
        } else {
            this.timer = undefined;

            if (this.interval != undefined) {
                clearInterval(this.interval);
                this.interval = undefined;
            }
        }
    }

    timerToString():string | undefined {
        if (this.timer == undefined) return undefined;
        let minutos: number = Math.floor(this.timer / 60);
        let segundos: number = this.timer - minutos * 60;

        return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }
}
