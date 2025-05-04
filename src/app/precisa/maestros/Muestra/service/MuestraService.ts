import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { API_ROUTESE } from "../../../../data/constants/routes/api.routes";
import { MuestraModel } from "../model/Muestra";

@Injectable({
    providedIn: 'root'
})

export class MuestraService {
    public url = API_ROUTESE.precisa;  
    private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
    constructor(private config: AppConfig, private http:HttpClient) { }
    

    ListadoMuestra(filtro: any) {
      return this.config.getHttp().post(`${this.urlma}ListadoMuestra`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }  


    MantenimientoMuestra(codigo: number, Operacion: MuestraModel, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlma}MantenimientoMuestra/` + codigo, Operacion, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }

}