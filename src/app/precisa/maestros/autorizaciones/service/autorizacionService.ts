import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { API_ROUTESE } from "../../../../data/constants/routes/api.routes";
import { Autorizacion } from "../model/autorizacion";

@Injectable({
    providedIn: 'root'
})

export class AutorizacionService {
    public url = API_ROUTESE.precisa;  
    private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
    constructor(private config: AppConfig, private http:HttpClient) { }
    
    ListaAutorizacion(filtro: any) {
    return this.config.getHttp().post(`${this.urlma}ListaAutorizacion`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

    MantenimientoAutorizacion(codigo: number, Operacion: Autorizacion, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlma}MantenimientoAutorizacion/` + codigo, Operacion, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }

}