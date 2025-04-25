import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { DtoTabla } from '../../../../../util/DtoTabla';
import { FiltroTipoOperacion } from '../../../admision/consulta/dominio/filtro/FiltroConsultaAdmision';
import { FiltroExamen, FiltroServicio } from '../dominio/filtro/FiltroExamen';
import { Examen } from '../dominio/dto/DtoExamen';
import { DtoComponentePerfil } from '../dominio/dto/DtoComponentePerfil';
import { DtoComponenteHomologacion } from '../dominio/dto/DtoComponenteHomologacion';
import { DtoComponenteMuestra } from '../dominio/dto/DtoComponenteMuestra';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';



@Injectable({
    providedIn: 'root'
  })

export class ExamenService {
    
    public url = API_ROUTESE.precisa;
    private urladm = `${this.url}${this.config.getEnv('proxy.precisa')}api/Admision/`;
    private urlmae = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;

    constructor(private http: HttpClient, private config: AppConfig) { } 

/*     private urladm = `${this.config.getEnv('proxy.precisa')}api/Admision/`;  
    private urlmae = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;   */

    serviciopaginado(servicio: any) {
        return this.config.getHttp().post(`${this.urladm}ListaClasificadorMovimiento`, servicio)        
            .toPromise()
            .then(response => response as DtoTabla[])
            .catch(error => error)
    }

    examenpaginado(examen: FiltroExamen) {   
        return this.config.getHttp().post(`${this.urladm}ListaComponente`, examen)         
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    listarModeloServicio(filtro: FiltroTipoOperacion) {        
        return this.config.getHttp().post(`${this.urladm}ListarModeloServicio`, filtro)         
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    listarclasificadorcomponente(filtro: any) {      
        return this.config.getHttp().post(`${this.urladm}ListarClasificadorComponente`, filtro)         
            .toPromise()
            .then(response => response)
            .catch(error => error)
    } 
    
    listarexamenmaestro(examen: FiltroExamen) {   
        return this.config.getHttp().post(`${this.urladm}ListadoComponenteMaestro`, examen)         
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    mantenimientomaestro(codigo: number, dtoexamen: Examen, token: string) {
        const headers = new HttpHeaders().set("Authorization", token) 
        return this.config.getHttp().post(`${this.urladm}MantenimientoComponente/` + codigo, dtoexamen, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
      }

    listadocomponentemuestra(filtro: any) {   
        return this.config.getHttp().post(`${this.urladm}ListadoComponenteMuestra`, filtro)         
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }
    
    MantenimientoComponenteMuestra(codigo: number, dtoexamen: DtoComponenteMuestra, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urladm}MantenimientoComponenteMuestra/` + codigo, dtoexamen, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
      }


    listadomuestra(filtro: any) {   
        return this.config.getHttp().post(`${this.urlmae}ListadoMuestra`, filtro)         
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    MantenimientoMuestra(codigo: number, dtoexamen: Examen, token: string) {
        const headers = new HttpHeaders().set("Authorization", token) 
        return this.config.getHttp().post(`${this.urlmae}MantenimientoMuestra/` + codigo, dtoexamen, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
      }   

    ListadoComponenteHomologacion(filtro: any) {       
        return this.config.getHttp().post(`${this.urladm}ListadoComponenteHomologacion`, filtro)         
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    MantenimientoHomologacion(codigo: number, dtoexamen: DtoComponenteHomologacion, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)    
        return this.config.getHttp().post(`${this.urladm}MantenimientoHomologacion/` + codigo, dtoexamen, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
      }

    ListadoComponentePerfil(filtro: any) {   
        return this.config.getHttp().post(`${this.urladm}ListadoComponentePerfil`, filtro)         
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    MantenimientoComponentePerfil(codigo: number, dtoexamen: DtoComponentePerfil, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)    
        return this.config.getHttp().post(`${this.urladm}MantenimientoComponentePerfil/` + codigo, dtoexamen, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
      }
    
    ListadoBaseComponente(filtro: any) {   
        return this.config.getHttp().post(`${this.urlmae}ListadoBaseComponente`, filtro)         
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    MantenimientoBaseComponente(codigo: number, dtoexamen: any, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)    
        return this.config.getHttp().post(`${this.urlmae}MantenimientoBaseComponente/` + codigo, dtoexamen, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
      }

}

