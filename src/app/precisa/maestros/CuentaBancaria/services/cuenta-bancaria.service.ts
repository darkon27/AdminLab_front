import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';

@Injectable({
  providedIn: 'root'
})
export class CuentaBancariaService {
  public url = API_ROUTESE.precisa;
  private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
  constructor(private config: AppConfig, private http: HttpClient) { }


  Listacuentabancariaa(filtro: any) {
    return this.config.getHttp().post(`${this.urlma}ListarCuentaBancaria`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  mantenimientoCuentaBancaria(codigo: number, dto: any, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlma}MantenimientoInsumos/` + codigo, dto, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }
}
