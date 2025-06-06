import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';

@Injectable({
  providedIn: 'root'
})
export class CambioComercialService {
  public url = API_ROUTESE.precisa;
  private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
  constructor(private config: AppConfig, private http: HttpClient) { }


  ListaBusqueda(filtro: any) {
    return this.config.getHttp().post(`${this.urlma}ListarCambioComercial`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  mantenimiento(codigo: number, dto: any, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlma}MantenimientoCambioComercial/` + codigo, dto, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }
}
