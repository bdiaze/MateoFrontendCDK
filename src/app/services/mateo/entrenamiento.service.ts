import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { EntEntrenamiento } from '@models/ent-entrenamiento';

@Injectable({
  providedIn: 'root'
})
export class EntrenamientoService {

    private http: HttpClient = inject(HttpClient);
    private apiUrl: string;

    constructor() {
        this.apiUrl = environment.mateoService.apiUrl;
    }

    listar(desde:Date, hasta:Date, num_pagina:number = 1, cant_elem_pagina:number = 25): Observable<any> {
        let parametros:HttpParams = new HttpParams()
        .set("desde", desde.toISOString())
        .set("hasta", hasta.toISOString())
        .set("numPagina", num_pagina)
        .set("cantElemPagina", cant_elem_pagina);
        return this.http.get(this.apiUrl + '/entrenamiento/listar', {params: parametros});
    }

    crear(entEntrenamiento:EntEntrenamiento) {
        return this.http.post(this.apiUrl + '/entrenamiento/crear', entEntrenamiento);
    }
}

