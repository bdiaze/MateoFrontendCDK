export class EntEntrenamiento {
    idRequest!: string;
    inicio!: Date;
    termino: Date | undefined;
    idTipoEjercicio: number | undefined;
    serie: number = 1;
    repeticiones: number | undefined;
    segundosEntrenamiento: number | undefined;
    segundosDescanso: number | undefined;
}
