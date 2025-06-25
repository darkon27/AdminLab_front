import { Component, OnInit, ViewChild } from "@angular/core";
import { MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { ConsultaAdmisionService } from "../../../admision/consulta/servicio/consulta-admision.service";
import { UsuarioAuth } from "../../../auth/model/usuario";
import { PersonaBuscarComponent } from "../../../framework-comun/Persona/components/persona-buscar.component";
import { Autorizacion } from "../model/autorizacion";
import { AutorizacionService } from "../service/autorizacionService";
import { forkJoin } from "rxjs";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";

@Component({
    selector: 'ngx-autorizaciones-mantenimiento',
    templateUrl: './autorizaciones-mantenimiento.component.html'
  })

export class AutorizacionesMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;

  visible: boolean = false;
  bloquearPag: boolean;
  titulo: string = ''
  accionRealizar: string = ''
  position: string = 'top'
  validarform: string = null;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  dto: Autorizacion = new Autorizacion();
  lstEstados: SelectItem[] = [];
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;

  constructor(
    private messageService: MessageService,
    private consultaAdmisionService: ConsultaAdmisionService,
    private AutorizacionService: AutorizacionService
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
          estados: this.obtenerDataMaestro('ESTGEN'),
        }
        ).subscribe(resp => {
          this.lstEstados = [...resp.estados];
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
            this.dto = new Autorizacion();
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
            this.fechaCreacion = new Date(this.dto.FechaCreacion);
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

  cargarComboEstados() {
      this.lstEstados = [];
      this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
        this.lstEstados.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo });
      });
  }

  async coreGuardar() {
          try {
            if (this.estaVacio(this.dto.Observacion)) { this.MensajeToastComun('notification','warn', 'Advertencia', 'Ingrese un valor válido'); return; }
            if (this.estaVacio(this.dto.Estado)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Seleccione una estado válido'); return; }
            //if (this.estaVacio(this.dto.Descripcion)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Ingrese una descripción válida'); return; }
            // if (this.estaVacio(this.dto.IdTipoCambio)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Seleccione un tipo de cambio válido'); return; }
            let valorAccionServicio: number = this.accionRealizar == ConstanteUI.ACCION_SOLICITADA_NUEVO ? 1 : 2;
            this.bloquearPag = true;
            const consultaRepsonse = await this.AutorizacionService.MantenimientoAutorizacion(valorAccionServicio, this.dto, this.getUsuarioToken());
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
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
    this.messageService.clear();
    this.messageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
  }


}
