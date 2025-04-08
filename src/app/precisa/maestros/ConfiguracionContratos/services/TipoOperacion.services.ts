import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AppConfig } from '../../../../../environments/app.config';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';
import { filtroTipoOperacion } from '../model/Filtro.TipoOperacion';
import { tipoOperacion } from '../model/TipoOperacion';

@Injectable({
    providedIn: 'root'
})

export class TipoOperacionService {
    public url = API_ROUTESE.precisa;  
    private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Admision/`;

    constructor(private config: AppConfig, private http:HttpClient) { }
  
    ListarTipoOperacion(filtro: filtroTipoOperacion) {
    return this.config.getHttp().post(`${this.urlma}ListarTipoOperacion`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

    MantenimientoTipoOperacion(codigo: number, Operacion: tipoOperacion, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlma}MantenimientoTipoOperacion/` + codigo, Operacion, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }

}