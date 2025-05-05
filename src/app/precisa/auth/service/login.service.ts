import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AppConfig } from '../../../../environments/app.config';
import { API_ROUTESE } from '../../../data/constants/routes/api.routes';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class LoginService {
    public url = API_ROUTESE.precisa;

    private urlseg = `${this.url}${this.config.getEnv('proxy.precisa')}api/Seguridad/`;
    private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;

    // private urlseg = `${this.config.getEnv('proxy.precisa')}api/Seguridad/`;
    // private urladm = `${this.config.getEnv('proxy.precisa')}api/Admision/`;
    // private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;
    // private url2 = `${this.config.getEnv('proxy.precisa')}api/Items`//"http://104.211.62.150/SPRING_RestServer_Olano/api/Items"

    constructor(private config: AppConfig, private _http: HttpClient) {

    }

    prueba() {
        const resultado = {
            CompaniaSocio: "00000000",
            FechaInicio: "2021-05-28",
            FechaFin: "2021-05-28"
        }

        return this.config.getHttp().post('/api/Items', resultado)
            .toPromise()
            .then(response => response)
            .catch(err => console.error(err))

    }

    login(usuario: any) {
        // const headers = new HttpHeaders()
        //     .append('Content-Type', 'application/json')
        //     .append('Access-Control-Allow-Headers', 'Content-Type')
        //     .append('Access-Control-Allow-Credentials', 'true')
        //     .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
        //     .append('Access-Control-Allow-Origin', '*');;
        return this.config.getHttp().post(`${this.urlseg}ListaLogin`, usuario)
            .toPromise()
            .then(response => response)
            .catch(error => null);
    }

    login2(usuario: any) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Access-Control-Allow-Origin': 'https://precisa.pe',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                'Access-Control-Allow-Credentials': 'true'
                //Authorization: 'my-auth-token'

            })
        };
        //console.log("::::::httpOptions::::", httpOptions);
        //console.log("")
        // return this.config.getHttp().post('/api/Admision/ListaLogin', usuario)
        return this.config.getHttp().post(`${this.urlseg}ListaLogin`, usuario, httpOptions)
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    iniciarSesion(usuario: any): Observable<any> {
        return from(this.config.getEnv('proxy.precisa')).pipe(
            switchMap(apiUrl => {
                const url = `${this.url}${apiUrl}api/Maestro/ListaLogin`;

                return this._http.post<any>(url, usuario);
            }),
            catchError(error => {
                console.error(`Error al iniciar sesión. ${error}`);
                return throwError(error);
            })
        )
    }

    usuarioAuth(): any {
        let resultado = null
        resultado = JSON.parse(sessionStorage.getItem('access_user'))
        if (resultado != null) {
            resultado = resultado.success ? resultado.success : false
        } else {
            resultado = false
        }
        return resultado
    }

    usuarioGetToken(): any {
        let resultado = null
        resultado = JSON.parse(sessionStorage.getItem('access_user_token'))
        return resultado
    }

    listarPortal(portal: any): Promise<any> {
        //console.log('/api/Seguridad/ListaPortal')
        return this.config.getHttp().post(`${this.urlseg}ListaPortal`, portal)
            .toPromise()
            .then(response => response as any)
            .catch(error => error);
    }

    listarSedes(sede: any): Promise<any> {
        //console.log("listarSedes", this.urlma);
        return this.config.getHttp().post(`${this.urlma}ListaSede`, sede)
            .toPromise()
            .then(response => response as any)
            .catch(error => error);
    }

    listarSedesMaestro(sede: any) {
        //console.log("listarSedesMaestro", this.urlma);
        return this.config.getHttp().post(`${this.urlma}ListaSede`, sede)
            .toPromise()
            .then(response => response as any)
            .catch(error => error);
    }


    listarMiscelaneos(miscelaneos: any): Promise<any> {
        return this.config.getHttp().post(`${this.urlma}ListaTablaMaestroDetalle`, miscelaneos)
            .toPromise()
            .then(response => response as any)
            .catch(error => error);
    }

    listarMenu(usuario: any, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlseg}ListarMenu`, usuario, { headers: headers })
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    mostrarIp(ip: any) {
        return this.config.getHttp().post(`${this.urlseg}ObtenerIP`, ip)
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    listarEspecialidad(especialidad: any) {
        return this.config.getHttp().post(`${this.urlma}ListaEspecialidad`, especialidad)
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }




}