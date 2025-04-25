import { Component, OnInit } from "@angular/core";
import { MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../../util/MensajeController";
import { ConstanteAngular } from "../../../../../@theme/ConstanteAngular";
import { MuestraModel } from "../../model/Muestra";
import { MuestraService } from "../../service/MuestraService";
import { FiltroTipoOAdmision } from "../../../../admision/consulta/dominio/filtro/FiltroConsultaAdmision";
import { ConsultaAdmisionService } from "../../../../admision/consulta/servicio/consulta-admision.service";


@Component({
    selector: 'ngx-muestra-mantenimiento',
    templateUrl: './muestra-mantenimiento.component.html'
  })
export class MuestrasMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  
    lstEstado: SelectItem[] = [];
    lsttipoadmision: SelectItem[] = [];
    lstTipoPaciente: SelectItem[] = [];
  
    usuario:    string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    bloquearPag: boolean;
    validarform: string = null;
    dto:  MuestraModel = new MuestraModel();
    filtro:  MuestraModel= new MuestraModel();
    tipoadmision: FiltroTipoOAdmision = new FiltroTipoOAdmision();
    acciones: string = '';
    position: string = 'top';
  
  constructor(
      private messageService: MessageService,
      private consultaAdmisionService: ConsultaAdmisionService,
      private MuestraService: MuestraService,
      //private TipoPacienteService: TipoPacienteService
    ) {
      super();
    }

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  iniciarComponente(accion: string,titulo) {
    //if (accion == "NUEVO") {
      this.cargarAcciones(accion,titulo)

    //}
    
  }

  
  cargarAcciones(accion: string,titulo) {
    this.acciones = `${titulo}: ${accion}`;
   
      this.dialog = true;
      this.puedeEditar = false;
    
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
          this.dto.Estado = 1;
          this.puedeEditar = false;
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
          this.fechaCreacion = new Date();
        } else if (this.validarform == "EDITAR") {
          console.log("EDITAR FILA :", rowdata);
          this.filtro.IdMuestra = rowdata.IdMuestra;
          this.bloquearPag = true;
          this.MuestraService.ListadoMuestra(this.filtro).then((res) => {
            this.bloquearPag = false;
            this.dto = res[0];
            console.log("EDITAR this.dto :",   this.dto );
            this.puedeEditar = false;
            this.fechaModificacion = new Date();
            this.fechaCreacion = new Date(res[0].FechaCreacion);
            this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
            // this.filtro.TIPOADMISIONID =this.dto.TIPOADMISIONID;
            // this.cargarTipoPaciente();
            // this.filtro.TipoPacienteId = this.dto.TipoPacienteId
          });
  
        } else if (this.validarform == "VER") {
          console.log("VER FILA :", rowdata);
          this.filtro.IdMuestra = rowdata.IdMuestra;
          this.bloquearPag = true;
          this.MuestraService.ListadoMuestra(this.filtro).then((res) => {
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
            // this.filtro.TIPOADMISIONID =this.dto.TIPOADMISIONID;
            // this.cargarTipoPaciente();
            // this.filtro.TipoPacienteId = this.dto.TipoPacienteId;
          });
        }
      });
    }
  
    cargarEstados() {
      this.lstEstado = [];
      this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
        this.lstEstado.push({ label: i.Nombre, value: i.IdCodigo });
      });
      this.filtro.Estado=1;
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

    async coreGuardar() {
      if (this.estaVacio(this.dto.IdMuestra)) { this.messageShow('warn', 'Advertencia', 'Ingrese un código válido'); return; }
      if (this.estaVacio(this.dto.Nombre)) { this.messageShow('warn', 'Advertencia', 'Ingrese un nombre válido'); return; }
      if (this.estaVacio(this.dto.Estado)) { this.messageShow('warn', 'Advertencia', 'Seleccione una estado válido'); return; }
      if (this.validarform == "NUEVO") {
        this.bloquearPag = true;
        this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario.trim();
        this.dto.FechaCreacion = this.fechaCreacion;
        this.MuestraService.MantenimientoMuestra(1, this.dto, this.getUsuarioToken()).then(
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
  
        this.MuestraService.MantenimientoMuestra(2, this.dto, this.getUsuarioToken()).then(
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


}


