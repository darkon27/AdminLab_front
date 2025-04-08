import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { API_ROUTESE } from "../../../../data/constants/routes/api.routes";
import { FiltroCobranza } from "../model/filtro.Cobranza";
import { ModalCobranza } from "../model/ModalCobranza";

@Injectable({
    providedIn: 'root'
})

export class CobranzaService {
  public url = API_ROUTESE.precisa;  
  private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
  private urlfa = `${this.url}${this.config.getEnv('proxy.precisa')}api/Facturacion/`;

  constructor(private config: AppConfig, private http:HttpClient) { }
  
  ListarCobranza(filtro: FiltroCobranza) {
      return this.config.getHttp().post(`${this.urlfa}ListarCobranza`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }

  ListarCobranzaDetalle(filtro: FiltroCobranza) {
    return this.config.getHttp().post(`${this.urlfa}ListarCobranzaDetalle`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

  ListarExpedienteParticulares(filtro: FiltroCobranza) {
      return this.config.getHttp().post(`${this.urlfa}ListarCobranzaDetalle`, filtro)
            .toPromise()
            .then(response => response)
            .catch(error => error)
      }


MantenimientoCobranza(codigo: number, empleados: ModalCobranza, token: string) {
          const headers = new HttpHeaders().set("Authorization", token)
          return this.config.getHttp().post(`${this.urlfa}MantenimientoCobranza/${codigo}`, empleados, { headers: headers })
            .toPromise()
            .then(response => response)
            .catch(error => error)
      }

}