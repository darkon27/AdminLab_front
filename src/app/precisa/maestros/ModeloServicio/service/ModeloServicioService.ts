import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { API_ROUTESE } from "../../../../data/constants/routes/api.routes";

@Injectable({
    providedIn: 'root'
})

export class ModeloServicioService {
    public url = API_ROUTESE.precisa;  
    private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
    constructor(private config: AppConfig, private http:HttpClient) { }
    
  ListarModeloServicio(filtro: any) {
    return this.config.getHttp().post(`${this.urlma}ListarModeloServicio`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }  

  MantenimientoModeloServicio(codigo: number, dto: any, token: string) {
      const headers = new HttpHeaders().set("Authorization", token)
      return this.config.getHttp().post(`${this.urlma}MantenimientoModeloServicio/` + codigo, dto, { headers: headers })
        .toPromise()
        .then(response => response)
        .catch(error => error)
  }
}