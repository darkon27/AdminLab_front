import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { DtoTabla } from '../../../../../util/DtoTabla';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';
import { dtoPersona } from '../dominio/dto/dtoPersona';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  public url = API_ROUTESE.precisa;
  private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;

/*   private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`; */

  constructor(private config: AppConfig, private http: HttpClient) { }


  mantenimientoMaestro(codigo: number, dtoPersona: dtoPersona, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlma}MantenimientoPersona/` + codigo, dtoPersona, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }
  
  UnificarPersonaMast(codigo: number, dtoPersona: dtoPersona, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlma}UnificarPersonaMast/` + codigo, dtoPersona, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  mantenimientoUsuarioWeb(codigo: number, dtoPersona: dtoPersona, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urlma}MantenimientoUsuarioWebExternos/` + codigo, dtoPersona, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

    listarUbigeo(ubigeo: any): Promise<DtoTabla[]> {
      return this.config.getHttp().post(`${this.urlma}ListaUbigeo`, ubigeo)
          .toPromise()
          .then(response => response as DtoTabla[])
          .catch(error => []);
    }

  listarpaginado(dto: any) {
       return this.config.getHttp().post(`${this.urlma}ListaPersona`, dto)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  listarXPersona(dto: any) {
    return this.config.getHttp().post(`${this.urlma}TraerXPersonaId`, dto)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  listarUsuarioWeb(dto: any) {
    return this.config.getHttp().post(`${this.urlma}ListaUsuarioWeb`, dto)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  listadoSedeHistoria(dto: any) {
    return this.config.getHttp().post(`${this.urlma}ListadoSedeHistoria`, dto)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  listaPersonaUsuario(dto: any) {
    return this.config.getHttp().post(`${this.urlma}ListaPersonaUsuario`, dto)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    
  }

  listaConsentimiento(dto: any) {
    return this.config.getHttp().post(`${this.urlma}ListarConsentimiento`, dto)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }


}
