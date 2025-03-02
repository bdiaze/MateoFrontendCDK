import { Entrenamiento } from "./entrenamiento";

export class SalEntrenamiento {
    desde: Date | undefined;
    hasta: Date | undefined;
    pagina: number | undefined;
    totalPaginas: number | undefined;
    cantidadElementosPorPagina: number | undefined;
    cantidadTotalEntrenamientos: number | undefined;
    entrenamientos: Entrenamiento[] | undefined;
}
