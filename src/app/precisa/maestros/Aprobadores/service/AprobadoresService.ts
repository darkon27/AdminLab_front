import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { API_ROUTESE } from "../../../../data/constants/routes/api.routes";
import { Aprobadores } from "../model/Aprobadores";

@Injectable({
    providedIn: 'root'
})

export class AprobadoresService {
    public url = API_ROUTESE.precisa;  
    private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
    constructor(private config: AppConfig, private http:HttpClient) { }
    
    ListarAprobadores(filtro: any) {
    return this.config.getHttp().post(`${this.urlma}ListarAprobadores`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

    MantenimientoAprobadores(codigo: number, Operacion: Aprobadores, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlma}MantenimientoAprobadores/` + codigo, Operacion, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }
}