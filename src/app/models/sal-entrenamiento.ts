import { Entrenamiento } from "./entrenamiento";

export class SalEntrenamiento {
    desde!: Date;
    hasta!: Date;
    pagina!: number;
    totalPaginas!: number;
    cantidadElementosPorPagina!: number;
    cantidadTotalEntrenamientos!: number;
    entrenamientos: Entrenamiento[] | undefined;
}
