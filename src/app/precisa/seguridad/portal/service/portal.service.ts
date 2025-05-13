import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AppConfig } from '../../../../../environments/app.config';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';


@Injectable({
    providedIn: 'root'
})

export class PortalService {
    public url = API_ROUTESE.precisa;

    private urlseg = `${this.url}${this.config.getEnv('proxy.precisa')}api/Seguridad/`;

    constructor(private config: AppConfig, private http: HttpClient) { }

    listarPortal(filtro: any) {
        return this.config.getHttp().post(`${this.urlseg}ListaPortal`, filtro)
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    mantenimientoPortal(codigo: number, data: any, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(`${this.urlseg}MantenimientoPortal/` + codigo, data, { headers: headers })
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }
}
