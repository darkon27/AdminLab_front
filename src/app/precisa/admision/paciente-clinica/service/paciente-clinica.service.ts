import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../environments/app.config';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';
import { DtoCombosPacienteCliini } from '../dominio/dto/DtoCombosPacienteCliini';
import { DtoAdmisionprueba, DtoPacienteClinica } from '../dominio/dto/DtoPacienteClinica';
import { ExamenConsultarOA, FiltroPacienteClinica } from '../dominio/filtro/FiltroPacienteClinica';

@Injectable({
    providedIn: 'root'
})
export class PacienteClinicaService {

    public url = API_ROUTESE.precisa;
    
    private urlWSSanna = `${this.url}${this.config.getEnv('proxy.precisa')}api/WSSanna/`;
    private urladm = `${this.url}${this.config.getEnv('proxy.precisa')}api/Admision/`;

    constructor(private config: AppConfig, private http: HttpClient) { }
    

    listarConsultaOa() {

        const headers = new HttpHeaders()
            .append("SOAPAction", "http://tempuri.org/ConsultaOARest")
            .append('Content-Type', 'text/xml;charset=UTF-8')
            .append('Content-Length', 'length');

        var body = "<soap:Envelope  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema/\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n" +
            "   <soap:Body>\r\n" +
            "      <ConsultaOAFerrer xmlns=\"http://tempuri.org/\">\r\n" +
            "           <TipoOrdenAtencion>" + 5 + "</TipoOrdenAtencion>\r\n" +
            "           <Sucursal>" + "CSF" + "</Sucursal>\r\n" +
            "           <CodigoOA>" + "1672294" + "</CodigoOA>\r\n" +
            "           <Documento>" + "" + "</Documento>\r\n" +
            "           <NombreCompleto>" + "" + "</NombreCompleto>\r\n" +
            "      </ConsultaOAFerrer>\r\n" +
            "   </soap:Body>\r\n" +
            "</soap:Envelope>"
        console.log("BODY aqui:", body);
        console.log("url:", this.urlWSSanna);
        console.log("heder:", headers);
        return this.config.getHttp().post(this.urlWSSanna, body, { headers: headers })
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    public listarpaginado(filtro: FiltroPacienteClinica): Promise<any> {
        filtro.paginacion.paginacionListaResultado = null;
        return this.config.getHttp().post(this.urlWSSanna + 'ListarConsultaOA', filtro)
            .toPromise()
            .then(response => response as ExamenConsultarOA[])
            .catch(error => new ExamenConsultarOA());
    }

    listarComboCliente(filtro: FiltroPacienteClinica): Promise<any> {
        return this.config.getHttp().post(this.urladm + 'ListarTipoOperacionCliente', filtro)
            .toPromise()
            .then(response => response as any[])
            .catch(error => new DtoCombosPacienteCliini());
    }


    listarCombosedeCliente(filtro: FiltroPacienteClinica): Promise<any> {
        return this.config.getHttp().post(this.urladm + 'ListarSedeCliente', filtro)
            .toPromise()
            .then(response => response as any[])
            .catch(error => new DtoCombosPacienteCliini());
    }



    listarTipoPaciente(filtro: FiltroPacienteClinica): Promise<any> {
        return this.config.getHttp().post(this.urladm + 'ListarTipoOperacion', filtro)
            .toPromise()
            .then(response => response as any[])
            .catch(error => new DtoCombosPacienteCliini());
    }

    listarcomboTipoServicio(filtro: FiltroPacienteClinica): Promise<any> {
        return this.config.getHttp().post(this.urladm + 'ListaClasificadorMovimiento', filtro)
            .toPromise()
            .then(response => response as any[])
            .catch(error => new DtoCombosPacienteCliini());
    }

    ValidarComponentePerfil(codigo: number, Admision: any, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        console.log("REPITIENDO N VECES", headers)
        return this.config.getHttp().post(`${this.urladm}ValidarComponentePerfil/` + codigo, Admision, { headers: headers })
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    mantenimientoAdmisionClinica(codigo: number, Admision: any, token: string) {     
        const headers = new HttpHeaders().set("Authorization", token)
        console.log("REPITIENDO N VECES", headers)
        return this.config.getHttp().post(`${this.urladm}RegistrarAdmision/` + codigo, Admision, { headers: headers })
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    cambioContratoTipoPaciente(codigo: number, Admision: DtoAdmisionprueba, token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(this.urladm + 'CambioContratoTipoPaciente/' + codigo, Admision)
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }

    anularAdmisionDetalle(codigo: number, lista: DtoPacienteClinica[], token: string) {
        const headers = new HttpHeaders().set("Authorization", token)
        return this.config.getHttp().post(this.urladm + 'AnularAdmisionDetalle/' + codigo, lista)
            .toPromise()
            .then(response => response)
            .catch(error => error)
    }





}
