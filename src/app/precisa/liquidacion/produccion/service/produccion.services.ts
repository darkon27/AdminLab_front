import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { API_ROUTESE } from "../../../../data/constants/routes/api.routes";
import { dtoPeriodo } from "../model/dtoPeriodo";
import { dtoProduccion } from "../model/dtoProduccion";
import { filtroProduccion } from "../model/filtro.produccion";

@Injectable({
    providedIn: 'root'
})

export class ProduccionService {

  
  public url = API_ROUTESE.precisa;  
  private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
  private urlfa = `${this.url}${this.config.getEnv('proxy.precisa')}api/Facturacion/`;

  constructor(private config: AppConfig, private http:HttpClient) { }
  
ListarProduccion(filtro: filtroProduccion) {
    return this.config.getHttp().post(`${this.urlfa}ListarProduccion`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

ListarPeriodoEmision(filtro: any) {
    return this.config.getHttp().post(`${this.urlfa}ListarPeriodoEmision`, filtro)
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }

ListarProduccionGeneral(filtro: filtroProduccion) {
        return this.config.getHttp().post(`${this.urlfa}ListarProduccionGeneral`, filtro)
          .toPromise()
          .then(response => response)
          .catch(error => error)
        }

 MantenimientoProduccion(codigo: number, empleados: dtoProduccion, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlfa}MantenimientoProduccion/${codigo}`, empleados, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }

}