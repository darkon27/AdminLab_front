import { Component, OnInit } from "@angular/core";
import { MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { MuestraModel } from "../model/Muestra";
import { MuestraService } from "../service/MuestraService";
import { FiltroTipoOAdmision } from "../../../admision/consulta/dominio/filtro/FiltroConsultaAdmision";
import { ConsultaAdmisionService } from "../../../admision/consulta/servicio/consulta-admision.service";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";
import { forkJoin } from "rxjs";


@Component({
    selector: 'ngx-muestra-mantenimiento',
    templateUrl: './muestra-mantenimiento.component.html'
  })
export class MuestrasMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  
    lstEstado: SelectItem[] = [];
    lsttipoadmision: SelectItem[] = [];
    lstTipoPaciente: SelectItem[] = [];
    titulo: string = ''
  
    accionRealizar: string = ''
    usuario:    string;
    ipCreacion: string;
    ipModificacion: string;
    dialog: boolean = false;
    FlgTipoEntrada: number;
    Empresa: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    bloquearPag: boolean;
    validarform: string = null;
    dto:  MuestraModel = new MuestraModel();
    filtro:  MuestraModel= new MuestraModel();
    tipoadmision: FiltroTipoOAdmision = new FiltroTipoOAdmision();
    acciones: string = '';
    position: string = 'top';
    visible: boolean;
  
  constructor(
      private messageService: MessageService,
      private consultaAdmisionService: ConsultaAdmisionService,
      private MuestraService: MuestraService,
      //private TipoPacienteService: TipoPacienteService
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

  iniciarComponente(accion: string,titulo) {
    //if (accion == "NUEVO") {
      this.cargarAcciones(accion,titulo)
      this.cargarEstados()
      

    //}
    
  }

  
  cargarAcciones(accion: string, titulo: string, rowdata?: any) {
      this.titulo = `${titulo}: ${accion}`;
      this.accionRealizar = accion;
      this.dialog = true;
  
      switch (accion) {
        case ConstanteUI.ACCION_SOLICITADA_NUEVO:
          this.dto = new MuestraModel();
          this.dto.Estado = 1;
          this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].NombreCompleto.trim();
          this.dto.FechaCreacion = new Date();
          this.puedeEditar = false;
  
          this.dto.IpCreacion = this.getIp();
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

  coreIniciarComponentemantenimiento(mensaje: MensajeController, accionform: string, titulo: string, page: number, data?: any): void {
    this.bloquearPag = true;
    this.mensajeController = mensaje;
    this.cargarAcciones(accionform, titulo, data)
    this.bloquearPag = false;
  }
  
    cargarEstados() {
    this.lstEstado = [];
    this.lstEstado.push({
      label: ConstanteAngular.COMBOSELECCIONE,
      value: null,
    });
    this.getMiscelaneos()
      ?.filter((x) => x.CodigoTabla == "ESTGEN")
      .forEach((i) => {
        this.lstEstado.push({
          label: i.Nombre.toUpperCase(),
          value: i.IdCodigo,
        });
      });
  }

    comboTipoAdmision(): Promise<number> {
      this.tipoadmision.AdmEstado=1;
      this.lsttipoadmision.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      return this.consultaAdmisionService.listarcombotipoadmision(this.tipoadmision).then(resp => {
        //console.log("combo tipo admision:", resp);
        resp.forEach(e => {
          this.lsttipoadmision.push({ label: e.AdmDescripcion, value: e.TipoAdmisionId });
        });
        return 1;
      });
    }

    async coreGuardar() {
        try {
          if (this.estaVacio(this.dto.IdMuestra)) { this.MensajeToastComun('notification','warn', 'Advertencia', 'Ingrese un código válido'); return; }
          if (this.estaVacio(this.dto.Nombre)) { this.MensajeToastComun('notification','warn', 'Advertencia', 'Ingrese un nombre válido'); return; }
          if (this.estaVacio(this.dto.Estado)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Seleccione una estado válido'); return; }
    
          let valorAccionServicio: number = this.accionRealizar == ConstanteUI.ACCION_SOLICITADA_NUEVO ? 1 : 2;
          this.bloquearPag = true;
          const consultaRepsonse = await this.MuestraService.MantenimientoMuestra(valorAccionServicio, this.dto, this.getUsuarioToken());
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
  
    // async messageShow(_severity: string, _summary: string, _detail: string) {
    //   this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
    // }

    MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
    this.messageService.clear();
    this.messageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
  }

}


