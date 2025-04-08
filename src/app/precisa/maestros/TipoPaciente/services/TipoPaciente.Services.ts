import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AppConfig } from '../../../../../environments/app.config';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';
import { tipoPaciente } from '../model/TipoPaciente';

@Injectable({
    providedIn: 'root'
})

export class TipoPacienteService {
    public url = API_ROUTESE.precisa;  
    private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;

    constructor(private config: AppConfig, private http:HttpClient) { }
  
    ListaTipoPaciente(filtro: any) {
    return this.config.getHttp().post(`${this.urlma}ListaTipoPaciente`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

    MantenimientoTipoPaciente(codigo: number, Operacion: tipoPaciente, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlma}MantenimientoTipoPaciente/` + codigo, Operacion, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }

}