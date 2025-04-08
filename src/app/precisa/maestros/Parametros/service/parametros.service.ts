import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AppConfig } from '../../../../../environments/app.config';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';
import { filtroParametros } from '../model/filtro.Parametros';
import { Parametros } from '../model/Parametros';

@Injectable({
    providedIn: 'root'
})

export class ParametrosService {
    public url = API_ROUTESE.precisa;  
  private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
    //private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;
    constructor(private config: AppConfig, private http:HttpClient) { }
  
    listarParametros(filtro: filtroParametros) {
    return this.config.getHttp().post(`${this.urlma}ListaParametros`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

    mantenimientoParametros(codigo: number, parametros: Parametros, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlma}MantenimientoParametro/` + codigo, parametros, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }

}