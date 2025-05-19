import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MessageService, SelectItem } from "primeng/api";
import { TipoTrabajadorService } from "../Service/tipoTrabajador.service";
import { TipoTrabajador } from "../model/TipoTrabajador";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { forkJoin } from "rxjs";
import { MensajeController } from "../../../../../util/MensajeController";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";



@Component({
  selector: 'ngx-tipo-trabajador-mantenimiento',
  templateUrl: './tipo-trabajador-mantenimiento.component.html'
})
export class TipoTrabajadorMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {

  titulo: string = ''
  accionRealizar: string = ''
  position: string = 'top'
  bloquearPag: boolean;
  visible: boolean;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;

  lstEstado: SelectItem[] = [];
  dto: TipoTrabajador = new TipoTrabajador();


  constructor(
    private _MessageService: MessageService,
    private _InsumoService: TipoTrabajadorService,


  ) {
    super();
  }
  ngOnInit(): void {
    this.cargarSelect();
    this.iniciarComponent();
  }
  cargarSelect(): void {
    const optTodos = { label: ConstanteAngular.COMBOTODOS, value: null };
    forkJoin({
      estados: this.obtenerDataMaestro('ESTLETRAS'),
    }
    ).subscribe(resp => {
      this.lstEstado = [...resp.estados];
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
        this.dto = new TipoTrabajador();
        this.dto.Estado = 'A';
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
        this.fechaCreacion = new Date(this.dto.UltimaFechaModif);
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

        this.dto.UltimoUsuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.dto.UltimaFechaModif = new Date();
        break;

      case ConstanteUI.ACCION_SOLICITADA_VER:
        this.dto = rowdata;

        this.puedeEditar = true;
        if (rowdata.UltimaFechaModif == null || rowdata.UltimaFechaModif == null) { this.fechaModificacion = null; }
        else { this.fechaModificacion = new Date(rowdata.UltimaFechaModif); }
        this.fechaCreacion = new Date(rowdata.UltimaFechaModif);
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        break;
    }

  }

  async coreGuardar() {
    try {

      if (this.estaVacio(this.dto.DescripcionLocal)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'ingrese una descripción válida'); return; }
      if (this.estaVacio(this.dto.Estado)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Seleccione una estado válido'); return; }

      let valorAccionServicio: number = this.accionRealizar == ConstanteUI.ACCION_SOLICITADA_NUEVO ? 1 : 2;
      this.bloquearPag = true;

      const consultaRepsonse = await this._InsumoService.mantenimiento(valorAccionServicio, this.dto, this.getUsuarioToken());
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
