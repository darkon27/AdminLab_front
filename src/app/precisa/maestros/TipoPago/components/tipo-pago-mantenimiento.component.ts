import { Component, OnInit } from "@angular/core";
import { MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { ConsultaAdmisionService } from "../../../admision/consulta/servicio/consulta-admision.service";
import { TipoPago } from "../model/TipoPago";
import { TipoPagoService } from "../service/TipoPagoService";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";
import { forkJoin } from "rxjs";

@Component({
  selector: 'ngx-tipo-pago-mantenimiento',
  templateUrl: './tipo-pago-mantenimiento.component.html'
})

export class TipoPagoMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  titulo: string = ''
  accionRealizar: string = ''
  position: string = 'top'
  bloquearPag: boolean;
  visible: boolean;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;


  lstEstado: SelectItem[] = [];
  validarform: string = null;
  dto: TipoPago = new TipoPago();
  filtro: TipoPago = new TipoPago();

  acciones: string = '';

  constructor(
    private _MessageService: MessageService,
    private _TipoPagoService: TipoPagoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarSelect();
    this.iniciarComponent();
  }

  cargarSelect(): void {
    const optSeleccione = { label: ConstanteAngular.COMBOSELECCIONE, value: null };
    forkJoin({
      estados: this.obtenerDataMaestro('ESTGEN'),
    }
    ).subscribe(resp => {
      const dataEstados = resp.estados?.map((ele: any) => ({
        label: ele.label?.trim()?.toUpperCase() || "", value: Number.parseInt(ele.value)
      }));
      this.lstEstado = [...dataEstados];
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
        this.dto = new TipoPago();
        this.dto.Estado = 1;
        this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.dto.FechaCreacion = new Date();
        this.puedeEditar = false;

        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.fechaCreacion = new Date();
        this.fechaModificacion = null;
        break;

      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        this.dto = rowdata;
        this.dto.FlagBanco = this.dto.FlagBanco == 1 ? true : false;
        this.dto.FlagReferencia = this.dto.FlagReferencia == 1 ? true : false;
        this.dto.Visible = this.dto.Visible == 1 ? true : false;
        this.puedeEditar = false;
        this.fechaModificacion = new Date();
        this.fechaCreacion = new Date(rowdata.FechaCreacion);
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

        this.dto.UsuarioModificacion = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.dto.FechaModificacion = new Date();
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

  async coreGuardar() {
    try {
      if (this.estaVacio(this.dto.Descripcion)) { this.messageShow('warn', 'Advertencia', 'Ingrese un código válido'); return; }
      if (this.estaVacio(this.dto.Nombre)) { this.messageShow('warn', 'Advertencia', 'Ingrese un nombre válido'); return; }
      if (this.estaVacio(this.dto.Estado)) { this.messageShow('warn', 'Advertencia', 'Seleccione una estado válido'); return; }

      let valorAccionServicio: number = this.accionRealizar == ConstanteUI.ACCION_SOLICITADA_NUEVO ? 1 : 2;
      this.bloquearPag = true;

      this.dto.FlagBanco = this.dto.FlagBanco == true ? 1 : 0;
      this.dto.FlagReferencia = this.dto.FlagReferencia == true ? 1 : 0;
      this.dto.Visible = this.dto.Visible == true ? 1 : 0;
      const consultaRepsonse = await this._TipoPagoService.MantenimientoTipoPago(valorAccionServicio, this.dto, this.getUsuarioToken());
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

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this._MessageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
    this._MessageService.clear();
    this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
  }

}
