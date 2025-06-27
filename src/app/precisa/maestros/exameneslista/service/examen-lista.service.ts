import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AppConfig } from '../../../../../environments/app.config';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';
import { ExamenListaBase } from '../model/examen-lista';

@Injectable({
    providedIn: 'root'
})

export class listabasecomponentServices {
public url = API_ROUTESE.precisa;  
private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;

constructor(private config: AppConfig, private http:HttpClient) { }


ListadoBaseComponente(filtro: any) {
return this.config.getHttp().post(`${this.urlma}ListadoBaseComponente`, filtro)
  .toPromise()
  .then(response => response)
  .catch(error => error)
}


MantenimientoBaseComponente(codigo: number, Operacion: ExamenListaBase, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlma}MantenimientoBaseComponente/` + codigo, Operacion, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
}


}