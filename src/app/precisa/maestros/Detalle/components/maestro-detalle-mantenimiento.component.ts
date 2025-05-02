import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { FiltroMaestro } from '../../FormMaestro/model/Filtro.Maestro';
import { MaestroService } from '../../FormMaestro/service/maestro.service';
import { NbToastrService } from '@nebular/theme';
import { Dtomaestrodetalle } from "../dominio/dto/Dtomaestrodetalle";
import { MaestrodetalleService } from "../servicio/maestrodetalle.service";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Filtromaestrodetalle } from "../dominio/filtro/Filtromaestrodetalle";
import { MensajeController } from '../../../../../util/MensajeController';
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";
import { forkJoin } from "rxjs";



@Component({
  selector: 'ngx-maestro-detalle-mantenimiento',
  templateUrl: './maestro-detalle-mantenimiento.component.html'
})
export class MaestroDetalleMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {

  titulo: string = ''
  accionRealizar: string = ''
  position: string = 'top'
  bloquearPag: boolean;
  visible: boolean;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;

  lstEstados: SelectItem[] = [];
  lstTablaMaestro: SelectItem[] = [];
  filtroMaestro: FiltroMaestro = new FiltroMaestro();
  dto: Dtomaestrodetalle = new Dtomaestrodetalle();
  validarform: string = null;
  filtro: Filtromaestrodetalle = new Filtromaestrodetalle();

  constructor(
    private _MessageService: MessageService,
    private maestroService: MaestroService,
    private maestrodetalleService: MaestrodetalleService,
    private confirmationService: ConfirmationService,
    private toastrService: NbToastrService) {
    super();
  }



  ngOnInit(): void {
    this.cargarSelect();
    this.iniciarComponent();
  }
  cargarSelect(): void {
    const optTodos = { label: ConstanteAngular.COMBOSELECCIONE, value: null };
    this.filtroMaestro.Estado = 1;
    forkJoin({
      estados: this.obtenerDataMaestro('ESTGEN'),
      maestros: this.maestroService.listarMaestro(this.filtroMaestro)
    }
    ).subscribe(resp => {
      const dataEstados = resp.estados?.map((ele: any) => ({
        label: ele.label?.trim()?.toUpperCase() || "", value: Number.parseInt(ele.value)
      }));
      this.lstEstados = [...dataEstados];

      const dataMaestros = resp.maestros?.map((ele: any) => ({
        label: ele.Nombre?.trim()?.toUpperCase() || "", value: ele.IdTablaMaestro
      }));

      this.lstTablaMaestro = [...dataMaestros];
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
        this.dto = new Dtomaestrodetalle();
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

    if (this.estaVacio(this.dto.Codigo)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Ingrese un código válido'); return; }
    if (this.estaVacio(this.dto.Nombre)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Ingrese una descripción válida'); return; }
    if (this.estaVacio(this.dto.IdTablaMaestro)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Seleccione un maestro válido'); return; }
    if (this.estaVacio(this.dto.Estado)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Seleccione una estado válido'); return; }
    if (this.esNumeroVacio(this.dto.IdTablaMaestro)) {
      this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Debe Seleccionar un maestro'); return;
    }

    try {
      let valorAccionServicio: number = this.accionRealizar == ConstanteUI.ACCION_SOLICITADA_NUEVO ? 1 : 2;
      this.bloquearPag = true;

      const consultaRepsonse = await this.maestrodetalleService.mantenimientoMaestro(valorAccionServicio, this.dto, this.getUsuarioToken());
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

  MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
    this._MessageService.clear();
    this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
  }

}
