import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { API_ROUTESE } from "../../../../data/constants/routes/api.routes";
import { dtoExpediente } from "../model/dtoExpediente";
import { dtoExpedienteDetalle } from "../model/dtoExpedienteDetalle";
import { ExpedienteModal } from "../model/ExpedienteModal";
import { filtroExpediente } from "../model/filtro.Expediente";

@Injectable({
    providedIn: 'root'
})

export class LiquidacionService {
  public url = API_ROUTESE.precisa;  
  private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
  private urlfa = `${this.url}${this.config.getEnv('proxy.precisa')}api/Facturacion/`;

  constructor(private config: AppConfig, private http:HttpClient) { }
  
  ListarExpediente(filtro: filtroExpediente) {
      return this.config.getHttp().post(`${this.urlfa}ListarExpediente`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }

  ListarExpedienteParticulares(filtro: filtroExpediente) {
      return this.config.getHttp().post(`${this.urlfa}ListarExpedienteParticulares`, filtro)
            .toPromise()
            .then(response => response)
            .catch(error => error)
      }

  ListarExpedienteDetalle(filtro: dtoExpedienteDetalle) {
      return this.config.getHttp().post(`${this.urlfa}ListarExpedienteDetalle`, filtro)
            .toPromise()
            .then(response => response)
            .catch(error => error)
      }

  MantenimientoExpediente(codigo: number, modal: ExpedienteModal, token: string) {
          const headers = new HttpHeaders().set("Authorization", token)
          return this.config.getHttp().post(`${this.urlfa}MantenimientoExpediente/${codigo}`, modal, { headers: headers })
            .toPromise()
            .then(response => response)
            .catch(error => error)
      }

}