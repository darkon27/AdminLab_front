import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { PersonaBuscarComponent } from '../../../framework-comun/Persona/components/persona-buscar.component';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { AprobadoresMantenimientoComponent } from '../components/aprobadores-mantenimiento.component';
import { Aprobadores } from '../model/Aprobadores';
import { AprobadoresService } from '../service/AprobadoresService';
import { forkJoin } from 'rxjs';
import { ConsultaAdmisionService } from '../../../admision/consulta/servicio/consulta-admision.service';

@Component({
  selector: 'ngx-aprobadores',
  templateUrl: './aprobadores.component.html',
  styleUrls: ['./aprobadores.component.scss']
})
export class AprobadoresComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(AprobadoresMantenimientoComponent, { static: false }) aprobadoresMantenimientoComponent: AprobadoresMantenimientoComponent;
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;

  bloquearPag: boolean;
  filtro: Aprobadores = new Aprobadores();
  editarCampo1: boolean = false;
  editarCampoAutorizador: boolean = true;
  editarCampo2: boolean = false;
  editarCampoPaciente: boolean = true;

  lstModelo: any[] = [];
  lstEstado: SelectItem[] = [];
  verMantPersona: boolean = false;
  validarAccion: string;
  acciones: string = ''
  position: string = 'top'
  titulo: string;
  registroSeleccionado: any;
  loading: boolean;

  constructor(
    private _MessageService: MessageService,
    private _ExportarService: ExportarService,
    private _PersonaService: PersonaService,
    private _AprobadoresService: AprobadoresService,
    private _ConfirmationService: ConfirmationService,
    private _ConsultaAdmisionService: ConsultaAdmisionService,
    private _ToastrService: NbToastrService) {
    super();
  }
  btnEliminar?: boolean;

  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    this.cargarSelect();
  }

  cargarSelect(): void {
    const optTodos = { label: ConstanteAngular.COMBOTODOS, value: null };
    forkJoin({
      estados: this.obtenerDataMaestro('ESTGEN'),
    }
    ).subscribe(resp => {
      const dataEstados = resp.estados?.map((ele: any) => ({
        label: ele.label?.trim()?.toUpperCase() || "", value: Number.parseInt(ele.value)
      }));
      this.lstEstado = [optTodos, ...dataEstados];
    });
  }

  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }
  coreNuevo(): void {
    this.aprobadoresMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_NUEVO + 'APROBADORES', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO, this.objetoTitulo.menuSeguridad.titulo, 0, {});
  }
  coreVer(row: any) {
    this.aprobadoresMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_VER + 'APROBADORES', ''), ConstanteUI.ACCION_SOLICITADA_VER, this.objetoTitulo.menuSeguridad.titulo, 0, row);
  }
  coreEditar(row: any) {
    this.aprobadoresMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_EDITAR + 'APROBADORES', ''), ConstanteUI.ACCION_SOLICITADA_EDITAR, this.objetoTitulo.menuSeguridad.titulo, 0, row)
  }

  verSelectorAutorizador(): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_SELECCION_EMPLEADO, 'BUSCAR'), 'BUSCAR ', "E");
  }
  limpiarAutorizador() {
    this.filtro.IdUsuario = null;
    this.filtro.NombreCompleto = null;
    this.editarCampoAutorizador = false;
  }

  coreMensaje(mensage: MensajeController): void {
    const dataDevuelta = mensage.resultado;

    switch (mensage.componente.toUpperCase()) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO + 'APROBADORES':
      case ConstanteUI.ACCION_SOLICITADA_EDITAR + 'APROBADORES':
        this.coreBuscar();
        break;

      case ConstanteUI.ACCION_SOLICITADA_SELECCION_EMPLEADO:
        this.filtro.IdUsuario = dataDevuelta.Documento.trim();
        this.filtro.NombreCompleto = dataDevuelta.NombreCompleto.trim();
        break;
      default:
        break;
    }
  }

  coreBuscar(): void {
    this.bloquearPag = true;
    this._AprobadoresService.ListarAprobadores(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
        element.Estado = element.Estado == null ? 2 : element.Estado
      });
      this.lstModelo = res;
      //console.log("coreBuscar listado:", res);
    });
  }

  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }

  coreExportar(): void {
    /*    if (this.lstModelo == null || this.lstModelo == undefined || this.lstModelo.length == 0) {
         this.messageService.add({
           key: "bcaur",
           severity: "warn",
           summary: "Warning",
           detail: "Realice Busqueda primero",
         });
       } else {
         var col = [[
           "NRO",
           "AUTORIZADOR",
           "PACIENTE",
           "FECHA_INI",
           "FECHA_FIN",
           "OBSERVACION",
           "AplicaTitular",
           "AplicaMonto",
           "AplicaFormula",
           "Monto",
           "ESTADO"
         ]];
         var rows = [];
         let contador: number = 0;
         let fechaCreacion: string;
         this.lstModelo.forEach(function (e: Autorizacion) {
           contador += 1;
           let fechaInicio = new Date(e.FechaInicio);
           let dd = ("0" + fechaInicio.getDate()).slice(-2);
           let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2); let yyyy = fechaInicio.getFullYear()
           fechaCreacion = dd + "/" + mm + "/" + yyyy;
   
           let itemExportar = [
             contador.toString(),
             fechaCreacion,
             e.Persona?.toUpperCase() || '',
             e.Paciente?.toUpperCase() || '',
             e.EstadoDesc.toString()
           ];
           rows.push(itemExportar);
         });
   
         this.exportarService.ExportPdf(this.lstModelo, col, rows, "Autorizaciones.pdf", "l");
         this.messageService.add({
           key: "bc",
           severity: "success",
           summary: "Success",
           detail: "Archivo PDF Generado.",
         });
       } */
    throw new Error('Method not implemented.');
  }

  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  coreInactivar(dtoInactivar) {
    this._ConfirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "AutoDialog",
      accept: async () => {
        /**AUDITORIA*/
        dtoInactivar.UltimoUsuario = this.getUsuarioAuth().data[0].Documento;
        dtoInactivar.UltimaFechaModif = new Date();
        dtoInactivar.IpModificacion = this.getIp();
        dtoInactivar.Estado = 2;
        //console.log("llego coreinactivar  ", dtoInactivar);
        const respInactivar = await this._AprobadoresService.MantenimientoAprobadores(ConstanteUI.SERVICIO_SOLICITUD_INACTIVAR, dtoInactivar, this.getUsuarioToken());
        if (respInactivar != null) {
          if (respInactivar.success) {
            this.MensajeToastComun('notification', 'success', 'success', this.getMensajeInactivo());
            this.coreBuscar();
          } else {
            this.MensajeToastComun('notification', 'warn', 'Advertencia', this.getMensajeErrorinactivar());
          }
        } else {
          this.MensajeToastComun('notification', 'warn', 'Advertencia', this.getMensajeErrorinactivar());
        }
      },
    });
  }

  MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
    this._MessageService.clear();
    this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
  }
}