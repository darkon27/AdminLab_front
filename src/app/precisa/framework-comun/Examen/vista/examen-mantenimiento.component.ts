import { Component, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { SelectItem } from 'primeng/api';
import { UsuarioAuth } from "../../../auth/model/usuario";
import { FiltroExamen, FiltroServicio } from "../dominio/filtro/FiltroExamen";
import { ExamenService } from "../servicio/Examen.service";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { MensajeController } from "../../../../../util/MensajeController";

/**
 * autor: Geampier Smc
* Tipo: ciclo de vida
* Detalle: Asigne una forma de manejar mejor la información al llamado de cada componente.
 */

@Component({
  selector: 'ngx-examen-mantenimiento',
  templateUrl: './examen-mantenimiento.component.html'
})

export class ExamenMantenimientoComponent extends ComponenteBasePrincipal {

  lstServicio: SelectItem[];
  lstEstado: SelectItem[];
  lstClasificacion: SelectItem[];
  lstTiempo: SelectItem[];
  lstSexo: SelectItem[];
  lstCentroCosto: SelectItem[];
  lstVenta: SelectItem[];

  bloquearPag: boolean;
  acciones: string;
  titulo: string;
  position: string;
  Auth: UsuarioAuth;
  filtro: FiltroExamen;
  servicio: FiltroServicio;

  constructor(
    private examenService: ExamenService) {
    super();
    this.ngOnDestroy();
  }
  ngOnDestroy(){
    this.lstServicio      = [];
    this.lstEstado        = [];
    this.lstClasificacion = [];
    this.lstTiempo        = [];
    this.lstSexo          = [];
    this.lstCentroCosto   = [];
    this.lstVenta         = [];
    this.acciones         = '';
    this.position         = 'top';
    this.Auth             = new UsuarioAuth();
    this.filtro           = new FiltroExamen();
    this.servicio         = new FiltroServicio();
  }
  coreIniciarComponentemantenimiento(mensaje: MensajeController, accionform: string, titulo: string, page: number, dtoEditExamen?: any): void {
    //console.log("Mant Exa Inicio ngOnInit");
    const p1 = this.comboCargarServicios();
    const p2 = this.listaComboEstado();
    const p3 = this.comboCargarClasificacion();
    const p4 = this.listaComboSexo();
    const p5 = this.listaComboTiempo();
    const p6 = this.listaComboCentroCosto();
    const p7 = this.listaComboVenta();
    Promise.all([p1, p2, p3, p4, p5, p6, p7]).then(resp => {
      this.mensajeController = mensaje;
      this.acciones = accionform;
      this.titulo = `${titulo}: ${accionform}`;
      this.dialog = true;
      this.puedeEditar = false;
    });

    switch (accionform) {
      case 'NUEVO':
        break;
      case 'EDITAR':

        this.filtro = dtoEditExamen;
        //console.log("Mant persona dto llegando:", this.filtro);
        break;
      case 'VER':

        this.puedeEditar = true;
        this.filtro = dtoEditExamen;
        break;
      default:
        return;
    }
  }

  comboCargarServicios() {
    this.Auth = this.getUsuarioAuth();
    var service = this.Auth.data;
    this.servicio.Estado = 1;
    this.lstServicio.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.examenService.serviciopaginado(this.servicio).then(resp => {
      resp.forEach(e => {
        this.lstServicio.push({ label: e.Nombre.toUpperCase(), value: e.ClasificadorMovimiento });
      });
      //console.log("Mant Exa combo servicio resp", resp);
    });
  }
  listaComboEstado() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstado.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo });
    });
    this.filtro.Estado = 1;
  }
  listaComboTiempo() {
    this.lstTiempo = [];
    this.lstTiempo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "TIEMPO").forEach(i => {
      this.lstTiempo.push({ label: i.Nombre.toUpperCase(), value: i.Codigo })
    });
  }
  listaComboSexo() {
    this.lstSexo = [];
    this.lstSexo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "SEXO").forEach(i => {
      this.lstSexo.push({ label: i.Nombre.toUpperCase(), value: i.Codigo })
    });
  }
  listaComboCentroCosto() {
    this.lstCentroCosto = [];
    this.lstCentroCosto.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstCentroCosto.push({ label: '2006', value: '2006' });
    this.lstCentroCosto.push({ label: '2022', value: '2022' });
    this.lstCentroCosto.push({ label: '2002', value: '2006' });
    this.lstCentroCosto.push({ label: '2001', value: '2022' });
    this.lstCentroCosto.push({ label: '600401', value: '600401' });
    //console.log("Mant Exa lstCentroCosto", this.lstCentroCosto);
  }
  listaComboVenta() {
    this.lstVenta = [];
    this.lstVenta.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstVenta.push({ label: '243', value: '243' });
    this.lstVenta.push({ label: '159', value: '159' });
    this.lstVenta.push({ label: '160', value: '160' });
    this.lstVenta.push({ label: '158', value: '158' });
    //console.log("Mant Exa listaComboVenta", this.lstVenta);
  }
  comboCargarClasificacion() {
    let clasificador = { Estado: 1 }
    this.lstClasificacion = [];
    this.lstClasificacion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.examenService.listarclasificadorcomponente(clasificador).then(resp => {
      resp.forEach(e => {
        this.lstClasificacion.push({ label: e.Nombre.toUpperCase(), value: e.IdClasificacion });
      });
    });
    //console.log("Mant Exa comboCargarClasificacion", this.lstClasificacion);
  }

  coreGuardar(){

    switch (this.acciones) {
      case 'NUEVO':

      //Esto debe ser al final de todo el proceso
      this.dialog = false;
      this.puedeEditar = true;
      this.ngOnDestroy();
        break;
      case 'EDITAR':

      //Esto debe ser al final de todo el proceso
      this.ngOnDestroy();
        break;
      case 'VER':

      //Esto debe ser al final de todo el proceso
      this.ngOnDestroy();
        break;
      default:
        //Esto debe ser al final de todo el proceso
        this.ngOnDestroy();
        return;
    }

  }
}
