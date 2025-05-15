import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../../../../environments/app.config';
import { Cliente, ConsultaDetalleAdmision, Sede, TraerXAdmisionServicio } from '../dominio/dto/DtoConsultaAdmision';
import { FiltroCliente, FiltroConsultaAdmision, FiltroListarXAdmision, FiltroTipoOAdmision, FiltroTipoOperacion } from '../dominio/filtro/FiltroConsultaAdmision';
import { Observable } from 'rxjs';
import { API_ROUTESE } from '../../../../data/constants/routes/api.routes';

@Injectable({
  providedIn: 'root'
})
export class ConsultaAdmisionService {

  public url = API_ROUTESE.precisa;
  private urladm = `${this.url}${this.config.getEnv('proxy.precisa')}api/Admision/`;
  private urlma = `${this.url}${this.config.getEnv('proxy.precisa')}api/Maestro/`;
  private urlseg = `${this.url}${this.config.getEnv('proxy.precisa')}api/Seguridad/`;
  private urlReporte = `${this.url}${this.config.getEnv('proxy.reporte')}`;

/* 
  private urladm = `${this.config.getEnv('proxy.precisa')}api/Admision/`;
  private urlma = `${this.config.getEnv('proxy.precisa')}api/Maestro/`;
  private urlseg = `${this.config.getEnv('proxy.precisa')}api/Seguridad/`;
  private urlReporte = `${this.config.getEnv('proxy.reporte')}`; */

  constructor(private http: HttpClient, private config: AppConfig, private route: ActivatedRoute,) { }

  listarXadmision(xadmision: FiltroListarXAdmision) {
    return this.config.getHttp().post(`${this.urladm}TraerXAdmisionServicio`, xadmision)
      .toPromise()
      .then(response => response as TraerXAdmisionServicio[])
      .catch(error => error)
  }

  listarDetalleAdmision(filtro: FiltroConsultaAdmision) {
    return this.config.getHttp().post(`${this.urladm}ListadoAdmisionConstancia`, filtro)
      .toPromise()
      .then(response => response as ConsultaDetalleAdmision[])
      .catch(error => error)
  }
  
  ListadoConstancia(filtro: FiltroConsultaAdmision) {
    return this.config.getHttp().post(`${this.urladm}ListadoConstancia`, filtro)
      .toPromise()
      .then(response => response as ConsultaDetalleAdmision[])
      .catch(error => error)
  }

  listarpaginado(filtro: FiltroConsultaAdmision) {

    return this.config.getHttp().post(`${this.urladm}ListarAdmision`, filtro)
      .toPromise()
      .then(response => response as FiltroConsultaAdmision[])
      .catch(error => error)
  }

  listarcombocliente(cliente: FiltroCliente) {
    // return this.config.getHttp().post('/api/Admision/ListarTipoOperacionCliente', cliente)
    return this.config.getHttp().post(`${this.urladm}ListarTipoOperacionCliente`, cliente)
      .toPromise()
      .then(response => response as Cliente[])
      .catch(error => error)
  }

  listarcomboclientexcodigo(cliente: FiltroCliente) {
    // return this.config.getHttp().post('/api/Admision/ListarTipoOperacionCliente', cliente)
    return this.config.getHttp().post(`${this.urladm}ListaTipoOperacionxCodigo`, cliente)
      .toPromise()
      .then(response => response as Cliente[])
      .catch(error => error)
  }

  listarcombotipooperacion(operacion: FiltroTipoOperacion) {
    // return this.config.getHttp().post('/api/Admision/ListarTipoOperacion', operacion)
    return this.config.getHttp().post(`${this.urladm}ListarTipoOperacion`, operacion)
      .toPromise()
      .then(response => response as FiltroTipoOperacion[])
      .catch(error => error)
  }


  ListarTipoOperacionTipoPaciente(operacion: FiltroTipoOperacion) {
    // return this.config.getHttp().post('/api/Admision/ListarTipoOperacion', operacion)
    return this.config.getHttp().post(`${this.urladm}ListarTipoOperacionTipoPaciente`, operacion)
      .toPromise()
      .then(response => response as FiltroTipoOperacion[])
      .catch(error => error)
  }
   

  ListarTipoOperacionSede(operacion: FiltroTipoOperacion) {
    // return this.config.getHttp().post('/api/Admision/ListarTipoOperacion', operacion)
    return this.config.getHttp().post(`${this.urladm}ListarTipoOperacionClienteSede`, operacion)
      .toPromise()
      .then(response => response as FiltroTipoOperacion[])
      .catch(error => error)
  }

  listarModeloServicio(operacion: FiltroTipoOperacion) {
    // const headers = new HttpHeaders().set("Authorization", token)
    return this.config.getHttp().post(`${this.urladm}ListarModeloServicio`, operacion)
        .toPromise()
        .then(response => response as FiltroTipoOperacion[])
        .catch(error => error)
  }

  listarcombotipoadmision(tipoadmin: any) {
    tipoadmin.AdmEstado = 1;
    // return this.config.getHttp().post('/api/Maestro/ListaTipoAdmision', tipoadmin)
    return this.config.getHttp().post(`${this.urlma}ListaTipoAdmision`, tipoadmin)
      .toPromise()
      .then(response => response as FiltroTipoOAdmision[])
      .catch(error => error)
  }



  listarAdmisionSede(idEmpresa: number) {
    let IdEmpresa = { IdEmpresa: idEmpresa }
    // return this.config.getHttp().post('/api/Admision/ListaSede', IdEmpresa)
    return this.config.getHttp().post(`${this.urladm}ListaSede`, IdEmpresa)
      .toPromise()
      .then(response => response as Sede)
      .catch(error => error)
  }



  sendCorreo(parametros: any) {
    return this.config.getHttp().post(`${this.urlseg}EnviarCorreo/1`, parametros)
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  printListadoReporte(payload: any): any {
    return this.config.getHttp().post(`${this.urladm}ListadoReporte`, payload)
      .toPromise()
      .then(response => response as any)
      .catch(error => error)
  }

  MantenimientoUnificarAtencionPaciente(codigo: number, Unificar: any, token: string) {
    // mantenimientoAdmisionClinica(codigo: number, Admision: DtoAdmisionprueba, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    //console.log("REPITIENDO N VECES", headers)
    return this.config.getHttp().post(`${this.urladm}MantenimientoUnificarAtencionPaciente/` + codigo, Unificar, { headers: headers })
        .toPromise()
        .then(response => response)
        .catch(error => error)

}
 

  getPrintConstaciaZenit(IdAdmision, NroPeticion) {

    return this.config.getHttp().get(`${this.urlReporte}CO_ReporteConstancia.aspx?IdAdmision=${IdAdmision}&NroPeticion=${NroPeticion}`)
      .toPromise()
      .then(response => response as any)
      .catch(error => error)
  }

  //soap
  getPrintReporteConstanciaSoap(IdAdmision, NroPeticion): any {
    const headers = new HttpHeaders()
      .append("SOAPAction", "http://tempuri.org/ListadoImpresion")
      .append('Content-Type', 'text/xml;charset=UTF-8')
    //      .append('Content-Length', 'length');

    var body = "<soapenv:Envelope  xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">\r\n" +
      "   <soapenv:Header/>\r\n" +
      "   <soapenv:Body>\r\n" +
      "      <tem:ListadoImpresion>\r\n" +
      "         <tem:ObjDetalle>\r\n" +
      "             <tem:IdReporte>" + 1 + "</tem:IdReporte>\r\n" +
      "             <tem:IdAdmision>" + IdAdmision + "</tem:IdAdmision>\r\n" +
      "             <tem:NroPeticion>" + NroPeticion + "</tem:NroPeticion>\r\n" +
      "         <tem:ObjDetalle>\r\n" +
      "      </tem:ListadoImpresion>\r\n" +
      "   </soapenv:Body>\r\n" +
      "</soapenv:Envelope>"

    //console.log("heder:", headers);
    //console.log("BODY aqui:", body);
    return this.config.getHttp().post(`${this.urlReporte}WServiceReporte.asmx?op=ListadoImpresion`, body, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(error => error)
  }

  MantenimientoTransaccion(codigo: number, Transaccion: any, token: string) {
    // mantenimientoAdmisionClinica(codigo: number, Admision: DtoAdmisionprueba, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    //console.log("REPITIENDO N VECES", headers)
    return this.config.getHttp().post(`${this.urladm}MantenimientoTransaccion/` + codigo, Transaccion, { headers: headers })
        .toPromise()
        .then(response => response)
        .catch(error => error)
  }

  MantenimientoAdmision(codigo: number, Admision: any, token: string) {
    // mantenimientoAdmisionClinica(codigo: number, Admision: DtoAdmisionprueba, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    //console.log("REPITIENDO N VECES", headers)
    return this.config.getHttp().post(`${this.urladm}MantenimientoAdmision/` + codigo, Admision, { headers: headers })
        .toPromise()
        .then(response => response)
        .catch(error => error)
  }

  MantenimientoAdmisionDetalle(codigo: number, AdmisionDetalle: any, token: string) {
    // mantenimientoAdmisionClinica(codigo: number, Admision: DtoAdmisionprueba, token: string) {
    const headers = new HttpHeaders().set("Authorization", token)
    //console.log("REPITIENDO N VECES", headers)
    return this.config.getHttp().post(`${this.urladm}MantenimientoAdmisionDetalle/` + codigo, AdmisionDetalle, { headers: headers })
        .toPromise()
        .then(response => response)
        .catch(error => error)
  }

}

