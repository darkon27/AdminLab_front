import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { map } from 'rxjs/operators';
import { AppConfig } from '../../../../../environments/app.config';
import { listarPerfilesIndex } from '../../../../../util/funcionesGlogales';
import { Perfil } from '../model/perfil';
import { PerfilUsuiario } from '../model/perfil-usuario';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';

@Injectable()
export class PerfilUserService {
    public url = API_ROUTESE.precisa;
    private urlseg = `${this.url}${this.config.getEnv('proxy.precisa')}api/Seguridad/`;

    constructor(private config: AppConfig, private http: HttpClient) { }
  
    listarPerfilMaster(filtro: Perfil) {
      return this.config.getHttp().post(`${this.urlseg}ListarPerfil`, filtro)
        .toPromise()
        .then(response => response)
        .catch(error => error)
    }
  
    listarPerfiles() {
      const usuario = { Usuario: "47205307" }
      return this.http.post(`${this.urlseg}ListarPerfil`, usuario)
        .pipe(
          map(resp => <PerfilUsuiario[]>listarPerfilesIndex(resp))
        )
    }
  
    getFiles() {
      return this.http.get<any>('assets/files.json')
        .pipe(
          map(resp => <TreeNode[]>resp['data'])
        );
    }
  
    mantenimientoPerfi(codigo: number, dto: Perfil, token: string) {
          const headers = new HttpHeaders().set("Authorization", token);
          //console.log("mantenimientoPerfi", codigo, headers);
          return this.config.getHttp().post(`${this.urlseg}MantenimientoPerfil/` + codigo, dto, { headers: headers })
            .toPromise()
            .then(response => response)
            .catch(error => error)
      }
  
}