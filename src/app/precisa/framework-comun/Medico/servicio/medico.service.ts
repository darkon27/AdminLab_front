import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { DtoTabla } from '../../../../../util/DtoTabla';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';
import { FiltroPacienteClinica } from '../../../admision/paciente-clinica/dominio/filtro/FiltroPacienteClinica';
import { DtoMedico } from '../../../maestros/Medico/dominio/dto/DtoMedico';
import { FiltroMedico } from '../../../maestros/Medico/dominio/filtro/Filtromedico';
import { dtoMedico } from '../dominio/dto/dtomedico';


@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  public url = API_ROUTESE.precisa;
  private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;

/*   private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`; */

  constructor(private config: AppConfig, private http: HttpClient) { }

  mantenimientoMaestro(codigo: number, dtomedico: dtoMedico, token: string) {
    const headers = new HttpHeaders().set("Authorization", token) 
    return this.config.getHttp().post(`${this.urlma}MantenimientoMedico/` + codigo, dtomedico, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  especialidadpaginado(especialidad: dtoMedico) {
    especialidad.Estado = 1;
    return this.config.getHttp().post(`${this.urlma}ListaEspecialidad`, especialidad)
      .toPromise()
      .then(response => response as DtoTabla[])
      .catch(error => error)
  }

 
  listarpaginado(filtro: any) {
    return this.config.getHttp().post(`${this.urlma}ListaMedico`, filtro)
      .toPromise()
      .then(response => response as DtoMedico[])
      .catch(error => error)
  }

}
