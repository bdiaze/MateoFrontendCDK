import { formatDate } from "@angular/common";

export class Entrenamiento {
    id: number | undefined;
    idUsuario: string | undefined;
    inicio: Date | undefined;
    termino: Date | undefined;
    idTipoEjercicio: number | undefined;
    serie: number | undefined;
    repeticiones: number | undefined;
    segundosEntrenamiento: number | undefined;
    segundosDescanso: number | undefined;

    inicioToString(): string {
        if (this.inicio) {
            return formatDate(this.inicio, "dd MM", "en-US");
        }

        return '';
    }
}
