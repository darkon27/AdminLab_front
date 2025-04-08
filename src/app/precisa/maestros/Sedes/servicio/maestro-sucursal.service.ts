import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { DtoWcoSede } from '../dominio/dto/DtoWcoSede';
import { FiltroWcoSede } from '../dominio/filtro/FiltroWcoSede';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';

@Injectable({
  providedIn: 'root'
})
export class MaestroSucursalService {
  public url = API_ROUTESE.precisa;  
  private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
  constructor(private config: AppConfig, private http:HttpClient) { }

  
  ListaSede(filtro: FiltroWcoSede) {
    return this.config.getHttp().post(`${this.urlma}ListaSede`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

    mantenimientoMaestro(codigo: number, dto: DtoWcoSede, token: string) {
      const headers = new HttpHeaders().set("Authorization", token)
      return this.config.getHttp().post(`${this.urlma}MantenimientoSede/` + codigo, dto, { headers: headers })
        .toPromise()
        .then(response => response)
        .catch(error => error)
    }

    ListarSedeCliente(filtro: any) {
      return this.config.getHttp().post(`${this.urlma}ListarSedeCliente`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }

    ListarSucursal(filtro: any) {
        return this.config.getHttp().post(`${this.urlma}WCO_ListarSucursal`, filtro)
          .toPromise()
          .then(response => response)
          .catch(error => error)
        }
        

    ListaSedeCompartida(filtro: any) {
        return this.config.getHttp().post(`${this.urlma}ListaSedeCompartida`, filtro)
            .toPromise()
            .then(response => response)
            .catch(error => error)
        }

    MantenimientoSedeCompartida(codigo: number, dto: any, token: string) {
          const headers = new HttpHeaders().set("Authorization", token)
          return this.config.getHttp().post(`${this.urlma}MantenimientoSedeCompartida/` + codigo, dto, { headers: headers })
            .toPromise()
            .then(response => response)
            .catch(error => error)
        }
        
}
