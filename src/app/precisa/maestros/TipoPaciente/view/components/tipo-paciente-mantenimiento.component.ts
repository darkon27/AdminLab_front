import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../../util/MensajeController";
import { tipoPaciente } from "../../model/TipoPaciente";
import { ConstanteUI } from "../../../../../../util/Constantes/Constantes";
import { MessageService } from "primeng/api";
import { forkJoin } from "rxjs";
import { TipoAdmisionService } from "../../../TipoAdmision/services/TipoAdmision.services";
import { ConstanteAngular } from "../../../../../@theme/ConstanteAngular";
import { TipoPacienteService } from "../../services/TipoPaciente.Services";



@Component({
  selector: 'ngx-tipo-paciente-mantenimiento',
  templateUrl: './tipo-paciente-mantenimiento.component.html'
})
export class TipoPacienteMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  titulo: string = ''
  accionRealizar: string = ''
  position: string = 'top'
  bloquearPag: boolean;
  visible: boolean;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  dto: tipoPaciente = new tipoPaciente();

  lstEstado: any = [];
  lstTipoAdmision: any = [];

  constructor(private _MessageService: MessageService,
    private _TipoAdmisionService: TipoAdmisionService,
    private _TipoPacienteService: TipoPacienteService,


  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarSelect();
    this.iniciarComponent();
  }
  cargarSelect(): void {
    const optTodos = { label: ConstanteAngular.COMBOSELECCIONE, value: null };
    const filtroAdmision = { AdmEstado: 1 }

    forkJoin({
      estados: this.obtenerDataMaestro('ESTGEN'),
      tipoAdmision: this._TipoAdmisionService.ListaTipoAdmision(filtroAdmision)
    }
    ).subscribe(resp => {
      const dataEstados = resp.estados?.map((ele: any) => ({
        label: ele.label?.trim()?.toUpperCase() || "", value: Number.parseInt(ele.value)
      }));
      this.lstEstado = [...dataEstados];

      const dataTipoAdmision = resp.tipoAdmision?.map((ele: any) => ({
        label: ele.AdmDescripcion?.trim()?.toUpperCase() || "", value: ele.TipoAdmisionId
      }));
      this.lstTipoAdmision = [...dataTipoAdmision];
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
        this.dto = new tipoPaciente();
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
    if (this.estaVacio(this.dto.Descripcion)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Ingrese una descripción válida'); return; }
    if (this.estaVacio(this.dto.Estado)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Seleccione un estado válido'); return; }
    if (this.estaVacio(this.dto.TipoAdmisionId)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Seleccione un tipo de admisión válido'); return; }

    try {
      let valorAccionServicio: number = this.accionRealizar == ConstanteUI.ACCION_SOLICITADA_NUEVO ? 1 : 2;
      this.bloquearPag = true;

      const consultaRepsonse = await this._TipoPacienteService.MantenimientoTipoPaciente(valorAccionServicio, this.dto, this.getUsuarioToken());
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


