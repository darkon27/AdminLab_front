import { Component, OnInit } from "@angular/core";
import { MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { FiltroTipoOAdmision } from "../../../admision/consulta/dominio/filtro/FiltroConsultaAdmision";
import { ConsultaAdmisionService } from "../../../admision/consulta/servicio/consulta-admision.service";
import { TipoPacienteService } from "../../TipoPaciente/services/TipoPaciente.Services";
import { ModeloServicio } from "../model/ModeloServicio";
import { ModeloServicioService } from "../service/ModeloServicioService";

@Component({
    selector: 'ngx-modelo-servicio-mantenimiento',
    templateUrl: './modelo-servicio-mantenimiento.component.html'
  })
export class ModeloServicioMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  lstEstados: SelectItem[] = [];
  lsttipoadmision: SelectItem[] = [];
  lstTipoPaciente: SelectItem[] = [];


  bloquearPag: boolean;
  validarform: string = null;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  dto:  ModeloServicio = new ModeloServicio();
  filtro:  ModeloServicio = new ModeloServicio();
  tipoadmision: FiltroTipoOAdmision = new FiltroTipoOAdmision();
  acciones: string = '';
  position: string = 'top';

  constructor(
    private messageService: MessageService,
    private consultaAdmisionService: ConsultaAdmisionService,
    private ModeloServicioService: ModeloServicioService,
    private TipoPacienteService: TipoPacienteService
  ) {
    super();
  }

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any): void {
    console.log("EDITAR MensajeController :",  msj );
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    const p1 = this.cargarEstados();
    const p2 = this.comboTipoAdmision();
    this.fechaModificacion = undefined;
    Promise.all([p1,p2]).then((resp) => {
      if (this.validarform == "NUEVO") {
        this.dto.MosEstado = 1;
        this.puedeEditar = false;
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.fechaCreacion = new Date();
      } else if (this.validarform == "EDITAR") {
        console.log("EDITAR FILA :", rowdata);
        this.filtro.ModeloServicioId = rowdata.ModeloServicioId;
        this.bloquearPag = true;
        this.ModeloServicioService.ListarModeloServicio(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.dto = res[0];
          console.log("EDITAR this.dto :",   this.dto );
          this.puedeEditar = false;
          this.fechaModificacion = new Date();
          this.fechaCreacion = new Date(res[0].FechaCreacion);
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
          this.filtro.TIPOADMISIONID =this.dto.TIPOADMISIONID;
          this.cargarTipoPaciente();
          this.filtro.TipoPacienteId = this.dto.TipoPacienteId
        });

      } else if (this.validarform == "VER") {
        console.log("VER FILA :", rowdata);
        this.filtro.ModeloServicioId = rowdata.ModeloServicioId;
        this.bloquearPag = true;
        this.ModeloServicioService.ListarModeloServicio(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.dto = res[0];
          this.puedeEditar = true;
          if (res[0].FechaModificacion == null || res[0].FechaModificacion == undefined) {
            this.fechaModificacion = undefined;
          } else {
            this.fechaModificacion = new Date(res[0].FechaModificacion);
          }
          this.fechaCreacion = new Date(res[0].FechaCreacion);
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
          this.filtro.TIPOADMISIONID =this.dto.TIPOADMISIONID;
          this.cargarTipoPaciente();
          this.filtro.TipoPacienteId = this.dto.TipoPacienteId;
        });
      }
    });
  }

  cargarEstados() {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstados.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo });
    });
  }

  async coreGuardar() {
    if (this.estaVacio(this.dto.Descripcion)) { this.messageShow('warn', 'Advertencia', 'Ingrese un código válido'); return; }
    if (this.estaVacio(this.dto.MosDescripcion)) { this.messageShow('warn', 'Advertencia', 'Ingrese un nombre válido'); return; }
    if (this.estaVacio(this.dto.MosEstado)) { this.messageShow('warn', 'Advertencia', 'Seleccione una estado válido'); return; }
    if (this.validarform == "NUEVO") {
      this.bloquearPag = true;
      this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario.trim();
      this.dto.FechaCreacion = this.fechaCreacion;
      this.ModeloServicioService.MantenimientoModeloServicio(1, this.dto, this.getUsuarioToken()).then(
        res => {
          this.bloquearPag = false;
          this.dialog = false;
          console.log("registrado:", res);
          if (res != null) {
            if (res.mensaje == "Created") {
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Se registró con éxito.' });
              this.mensajeController.resultado = res;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
            } else {
              this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: res.mensaje });
            }
          }
        });

    } else if (this.validarform == "EDITAR") {
      this.bloquearPag = true;
      this.dialog = false;
      this.dto.FechaModificacion = this.fechaModificacion;
      this.ModeloServicioService.MantenimientoModeloServicio(2, this.dto, this.getUsuarioToken()).then(
        res => {
          this.bloquearPag = false;
          if (res != null) {
            console.log("registrado:", res);
            if (res.mensaje == "Ok") {
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Se actualizó con éxito.' });
              this.mensajeController.resultado = res;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
              this.bloquearPag = false;
              this.dialog = false;
            } else {
              this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertenciaaa', detail: res.mensaje });
              this.bloquearPag = false;
              this.dialog = false;
            }
          }

        });
    }

  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  comboTipoAdmision(): Promise<number> {
    this.tipoadmision.AdmEstado=1;
    this.lsttipoadmision.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.consultaAdmisionService.listarcombotipoadmision(this.tipoadmision).then(resp => {
      console.log("combo tipo admision:", resp);
      resp.forEach(e => {
        this.lsttipoadmision.push({ label: e.AdmDescripcion, value: e.TipoAdmisionId });
      });
      return 1;
    });
  }

  selectedTipoAdmision(event) {
    if (this.filtro.TIPOADMISIONID != null) {   
      this.filtro.TIPOADMISIONID  = event.value;
      this.cargarTipoPaciente();
      console.log("Consulta Tipo Operacion selectedTipoAdmision::", event.value);
    }
  }


cargarTipoPaciente() {
    let dto = {  Estado: 1, TipoAdmisionId:this.filtro.TIPOADMISIONID  }
    this.lstTipoPaciente = [];
    this.lstTipoPaciente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.TipoPacienteService.ListaTipoPaciente(dto).then(res => {
      console.log("Consulta Tipo Operacion cargarTipoPaciente::", res);
      res.forEach(ele => {
        this.lstTipoPaciente.push({ label: ele.Descripcion.trim(), value: ele.TipoPacienteId });
      });
    });
  }


}
