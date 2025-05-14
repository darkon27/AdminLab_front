import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Filtrotipodecambio } from '../dominio/filtro/Filtrotipodecambio';
import { DtoTipocambiomast } from '../dominio/dto/DtoTipocambiomast';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';

@Injectable({
  providedIn: 'root'
})
export class MaestrotipocambioService {

  public url = API_ROUTESE.precisa;
  private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
  private urlad = `${this.url}${this.config.getEnv('proxy.precisa')}api/Admision/`;
  //private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;

  constructor(private config: AppConfig, private http: HttpClient) { }

  // listarmaestroTipoCambio(filtro: Filtrotipodecambio) {
  // return this.config.getHttp().post(`${this.urlma}ListadoTipoCambio`, filtro)
  //   .toPromise()
  //   .then(response => response)
  //   .catch(error => error)
  // }


  listarmaestroTipoCambio(filtro: any): Promise<any[]> {
    return this.config.getHttp().post(`${this.urlad}ListadoTipoCambio`, filtro)
      .toPromise()
      .then(response => response as DtoTipocambiomast[])
      .catch(error => []);
  }
  listarMonedas(filtro: any): Promise<DtoTipocambiomast[]> {
    return this.config.getHttp().post(`${this.urlma}ListarMoneda`, filtro)
      .toPromise()
      .then(response => response as DtoTipocambiomast[])
      .catch(error => []);
  }

  MantenimientoTipoCambio(codigo: number, data: any, token: string) {
    //console.log(data)
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlad}MantenimientoTipoCambio/${codigo}`, data, { headers: headers }).toPromise()
      .then(response => response)
      .catch(error => error)

  }
}
