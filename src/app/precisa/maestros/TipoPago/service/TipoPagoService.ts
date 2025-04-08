import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { API_ROUTESE } from "../../../../data/constants/routes/api.routes";
import { TipoPago } from "../model/TipoPago";

@Injectable({
    providedIn: 'root'
})

export class TipoPagoService {
    public url = API_ROUTESE.precisa;  
    private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
    constructor(private config: AppConfig, private http:HttpClient) { }

    ListarTipoPago(filtro: any) {
      return this.config.getHttp().post(`${this.urlma}ListaTipoPago`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }

      MantenimientoTipoPago(codigo: number, Operacion: TipoPago, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlma}MantenimientoTipoPago/` + codigo, Operacion, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }

}