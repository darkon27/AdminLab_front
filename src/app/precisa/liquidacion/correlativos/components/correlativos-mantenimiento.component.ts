import { Component, OnDestroy, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { FiltroCompaniamast } from "../../../seguridad/companias/dominio/filtro/FiltroCompaniamast";
import { MaestrocompaniaMastService } from "../../../seguridad/companias/servicio/maestrocompania-mast.service";
import { dtoCorrelativo } from "../model/dtoCorrelativo";
import { filtroCorrelativo } from "../model/filtro.Correlativo";
import { CorrelativoService } from "../service/correlativo.Service";
import { forkJoin, of } from "rxjs";
import { catchError, finalize, tap } from "rxjs/operators";



@Component({
  selector: 'ngx-correlativos-mantenimiento',
  templateUrl: './correlativos-mantenimiento.component.html'
})

export class CorrelativosMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy, UIMantenimientoController {
  titulo: string = ''
  accionRealizar: string = ''
  position: string = 'top'
  bloquearPag: boolean;
  visible: boolean;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;

  lstCompania: SelectItem[] = [];
  lstEstado: SelectItem[] = [];
  lstTipoComprobante: SelectItem[] = [];

  dto: dtoCorrelativo = new dtoCorrelativo();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private CorrelativoService: CorrelativoService,
    private _MessageService: MessageService,
    private maestrocompaniaMastService: MaestrocompaniaMastService) {
    super();
  }

  ngOnInit(): void {
    this.cargarSelect();
    this.iniciarComponent();
  }

  cargarSelect(): void {
    const optTodos = { label: ConstanteAngular.COMBOTODOS, value: null };
    this.FiltroCompan.estado = "A";

    forkJoin({
      estados: this.obtenerDataMaestro('ESTLETRAS'),
      tipoComprobantes: this.obtenerDataMaestro('TIPOCOMPROBANTE'),
      companias: this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan),
    }
    ).subscribe(resp => {
      this.lstEstado = [...resp.estados];
      this.lstTipoComprobante = [...resp.tipoComprobantes];

      const dataCompania = resp.companias?.map((ele: any) => ({
        label: ele.DescripcionCorta?.trim()?.toUpperCase() || "", value: `${ele.CompaniaCodigo?.trim() || ""}00`, title: ele.Persona || ""
      }));
      this.lstCompania = [...dataCompania];

    });
  }

  coreIniciarComponentemantenimiento(mensaje: MensajeController, accionform: string, titulo: string, page: number, data?: any): void {
    this.bloquearPag = true;
    this.mensajeController = mensaje;
    this.cargarAcciones(accionform, titulo, data)
    this.bloquearPag = false;
  }

  cargarAcciones(accion: string, titulo: string, rowdata?: any) {
    this.titulo = `${titulo}: ${accion}`;
    this.accionRealizar = accion;
    this.dialog = true;

    switch (accion) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.dto = new dtoCorrelativo();
        this.dto.Estado = "A";
        this.dto.CompaniaCodigo = "00000000";
        this.dto.TipoComprobante = "BV";
        this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.dto.FechaCreacion = new Date();
        this.puedeEditar = false;

        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.fechaCreacion = new Date();
        this.fechaModificacion = null;
        break;

      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        this.dto = rowdata;
        this.puedeEditar = false;
        this.fechaModificacion = new Date();
        this.fechaCreacion = new Date(rowdata.FechaCreacion);
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

        this.dto.UltimoUsuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.dto.UltimaFechaModif = new Date();
        break;

      case ConstanteUI.ACCION_SOLICITADA_VER:
        this.dto = rowdata;
        this.puedeEditar = true;
        if (rowdata.FechaModificacion == null || rowdata.FechaModificacion == null) { this.fechaModificacion = null; }
        else { this.fechaModificacion = new Date(rowdata.FechaModificacion); }
        this.fechaCreacion = new Date(rowdata.FechaCreacion);
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        break;
    }

  }

  coreMensaje(mensage: MensajeController): void {

  }

  async coreGuardar() {
    try {


      let valorAccionServicio: number = this.accionRealizar == ConstanteUI.ACCION_SOLICITADA_NUEVO ? 1 : 2;
      this.bloquearPag = true;

      const consultaRepsonse = await this.CorrelativoService.MantenimientoCorrelativos(valorAccionServicio, this.dto, this.getUsuarioToken());
      if (consultaRepsonse.success == true) {
        this.MensajeToastComun('notification', 'success', 'Correcto', consultaRepsonse.mensaje);

        this.mensajeController.resultado = consultaRepsonse;
        this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
        this.dialog = false;

      } else {
        this.MensajeToastComun('notification', 'warn', 'Advertencia', consultaRepsonse.mensaje);
      }
    }
    catch (error) {
      console.error(error)
      this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
      this.bloquearPag = false;
    } finally {
      this.bloquearPag = false;
    }
  }

  ngOnDestroy(): void {
    // this.userInactive.unsubscribe();
  }
  MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
    this._MessageService.clear();
    this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
  }

  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }

  coreBuscar(): void {
    throw new Error('Method not implemented.');
  }

  coreExportar(): void {
    throw new Error('Method not implemented.');
  }

  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

}


