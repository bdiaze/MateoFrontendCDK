import { formatDate } from "@angular/common";

export class Entrenamiento {
    id!: number;
    idUsuario!: string;
    inicio!: Date;
    termino!: Date;
    idRequest!: string;
    idTipoEjercicio: number | undefined;
    serie: number | undefined;
    repeticiones: number | undefined;
    segundosEntrenamiento: number | undefined;
    segundosDescanso: number | undefined;
}
