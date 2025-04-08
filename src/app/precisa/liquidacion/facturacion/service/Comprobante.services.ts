import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { API_ROUTESE } from "../../../../data/constants/routes/api.routes";
import { dtoComprobante } from "../model/dtoComprobante";
import { dtoComprobanteDetalle } from "../model/dtoComprobanteDetalle";
import { filtroComprobante } from "../model/filtro.Comprobante";

@Injectable({
    providedIn: 'root'
})

export class ComprobanteService {
  public url = API_ROUTESE.precisa;  
  private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
  private urlfa = `${this.url}${this.config.getEnv('proxy.precisa')}api/Facturacion/`;

  constructor(private config: AppConfig, private http:HttpClient) { }
  
  
  ListarTipoPago(filtro: any) {
    return this.config.getHttp().post(`${this.urlfa}ListarTipoPago`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

  ListarBanco(filtro: any) {
    return this.config.getHttp().post(`${this.urlfa}ListarBanco`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

  ListarSucursalCompSerie(filtro: any) {
    return this.config.getHttp().post(`${this.urlfa}ListarSucursalCompSerie`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

    ListarSedeSucursalNegocio(filtro: any) {
      return this.config.getHttp().post(`${this.urlfa}ListarSedeSucursalNegocio`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }

  ListarComprobante(filtro: any) {
    return this.config.getHttp().post(`${this.urlfa}ListarComprobante`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

  ListarComprobanteDetalle(filtro: any) {
    return this.config.getHttp().post(`${this.urlfa}ListarComprobanteDetalle`, filtro)
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }

 MantenimientoComprobante(codigo: number, empleados: dtoComprobante, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlfa}MantenimientoComprobante/${codigo}`, empleados, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }

  MantenimientoHomologacionCliente(codigo: number, Homologacion: any, token: string) {
      const headers = new HttpHeaders().set("Authorization", token)
      return this.config.getHttp().post(`${this.urlfa}MantenimientoHomologacionCliente/${codigo}`, Homologacion, { headers: headers })
        .toPromise()
        .then(response => response)
        .catch(error => error)
  }

}