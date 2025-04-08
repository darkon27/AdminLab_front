import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AppConfig } from '../../../../../environments/app.config';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';
import { filtroUsuario } from '../model/filtro.usuario';
import { Usuario } from '../model/usuario';
import { UsuarioSede } from '../model/usuariosede';


@Injectable({
    providedIn: 'root'
})

export class UsuarioService {
  public url = API_ROUTESE.precisa;

   private urlseg = `${this.url}${this.config.getEnv('proxy.precisa')}api/Seguridad/`;

    constructor(private config: AppConfig, private http:HttpClient) { }
  
    listarUsuarioMast(filtro: filtroUsuario) {
    return this.config.getHttp().post(`${this.urlseg}ListaUsuario`, filtro)
      .toPromise()
      .then(response => response)
      .catch(error => error)
    }

    listarComboPerfil(filtro: any) {
        return this.config.getHttp().post(`${this.urlseg}ListarComboPerfil`, filtro)
          .toPromise()
          .then(response => response)
          .catch(error => error)
        }

    ObtenerDesencriptar(filtro: any) {
          return this.config.getHttp().post(`${this.urlseg}Desencriptar`, filtro)
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    mantenimientoUsuarioMast(codigo: number, empleados: Usuario, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlseg}MantenimientoUsuario/` + codigo, empleados, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }


    ListaUsuarioSede(filtro: any) {
      return this.config.getHttp().post(`${this.urlseg}ListaUsuarioSede`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
      }
  
      MantenimientoUsuarioSede(codigo: number, usuariosede: any, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlseg}MantenimientoUsuarioSede/` + codigo, usuariosede, { headers: headers })
          .toPromise()
          .then(response => response)
          .catch(error => error)
    }




}
