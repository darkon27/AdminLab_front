import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AppConfig } from '../../../../../environments/app.config';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';
import { tipoAdmision } from "../model/TipoAdmision";

@Injectable({
    providedIn: 'root'
})

export class TipoAdmisionService {
    public url = API_ROUTESE.precisa;  
    private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
    constructor(private config: AppConfig, private http:HttpClient) { }
    
    ListaTipoAdmision(filtro: any) {
    return this.config.getHttp().post(`${this.urlma}ListaTipoAdmision`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

    MantenimientoTipoAdmision(codigo: number, Operacion: tipoAdmision, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlma}MantenimientoTipoAdmision/` + codigo, Operacion, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }

}