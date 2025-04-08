import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AppConfig } from '../../../../../environments/app.config';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';
import { listabase } from '../model/listabase';

@Injectable({
    providedIn: 'root'
})

export class listabaseServices {
public url = API_ROUTESE.precisa;  
private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;

constructor(private config: AppConfig, private http:HttpClient) { }


ListadoBase(filtro: any) {
return this.config.getHttp().post(`${this.urlma}ListadoBase`, filtro)
  .toPromise()
  .then(response => response)
  .catch(error => error)
}


MantenimientoBase(codigo: number, Operacion: listabase, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlma}MantenimientoBase/` + codigo, Operacion, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
}


}