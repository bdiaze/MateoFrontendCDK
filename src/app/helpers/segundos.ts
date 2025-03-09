export class Segundos {
    static obtenerMinutos(segundos: number) {
        return this.descomponerEnMinutosSegundos(segundos)[0];
    }

    static obtenerSegundosRestantes(segundos: number) {
        return this.descomponerEnMinutosSegundos(segundos)[1];
    }

    static descomponerEnMinutosSegundos(segundos: number): number[] {
        let minutos: number = Math.floor(segundos / 60);
        let segundosRestantes: number = segundos - minutos * 60;

        return [minutos, segundosRestantes];
    }

    static segundosATexto(segundos: number) {
        let texto: string = '';

        let minutosSegundos: number[] = this.descomponerEnMinutosSegundos(segundos);

        if (minutosSegundos[0] > 0) {
            texto += `${ minutosSegundos[0] } min.`;
        }

        if (minutosSegundos[1] > 0) {
            if (texto.length > 0) texto += ' ';
            texto += `${ minutosSegundos[1] } seg.`;
        }

        if (texto.length == 0) {
            texto = '0 seg.';
        }

        return texto;
    }
}
