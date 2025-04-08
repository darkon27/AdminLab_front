import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { API_ROUTESE } from "../../../../data/constants/routes/api.routes";
import { dtoCorrelativo } from "../model/dtoCorrelativo";

@Injectable({
    providedIn: 'root'
})

export class CorrelativoService {
    public url = API_ROUTESE.precisa;  
    private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
    private urlfa = `${this.url}${this.config.getEnv('proxy.precisa')}api/Facturacion/`;
  
    constructor(private config: AppConfig, private http:HttpClient) { } 
  
  ListarCorrelativos(filtro: any) {
      return this.config.getHttp().post(`${this.urlfa}ListarCorrelativos`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }  
  
   MantenimientoCorrelativos(codigo: number, empleados: dtoCorrelativo, token: string) {
          const headers = new HttpHeaders().set("Authorization", token)
          return this.config.getHttp().post(`${this.urlfa}MantenimientoCorrelativos/${codigo}`, empleados, { headers: headers })
            .toPromise()
            .then(response => response)
            .catch(error => error)
      }
  
  }