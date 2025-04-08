import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';
import { dtoaseguradora } from '../dominio/dto/dtoaseguradora';

@Injectable({
  providedIn: 'root'
})
export class AseguradoraService {
  public url = API_ROUTESE.precisa;
  private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
/*   private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`; */
  constructor(private config: AppConfig, private http: HttpClient) { }


  mantenimientoMaestro(codigo: number, dtoasegura: dtoaseguradora, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlma}MantenimientoAseguradora/` + codigo, dtoasegura, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  listarpaginado(filtro: any) {
    return this.config.getHttp().post(`${this.urlma}ListaAseguradora`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }


}
