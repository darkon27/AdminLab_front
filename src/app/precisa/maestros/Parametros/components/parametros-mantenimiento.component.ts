import { Component, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { UsuarioAuth } from "../../../auth/model/usuario";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { AuditoriaComponent } from "../../../../@theme/components/auditoria/auditoria.component";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { NbToastrService } from "@nebular/theme";
import { ParametrosService } from "../service/parametros.service";
import { Parametros } from "../model/parametros";
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import Swal from "sweetalert2";
import { FiltroCompaniamast } from "../../../seguridad/companias/dominio/filtro/FiltroCompaniamast";
import { MaestrocompaniaMastService } from "../../../seguridad/companias/servicio/maestrocompania-mast.service";
import { MensajeController } from "../../../../../util/MensajeController";
import { filtroParametros } from "../model/filtro.parametros";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";
import { forkJoin } from "rxjs";

@Component({
  selector: 'ngx-parametros-mantenimiento',
  templateUrl: './parametros-mantenimiento.component.html'
})

export class ParametrosMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy {
  @ViewChild(AuditoriaComponent, { static: false }) auditoriaComponent: AuditoriaComponent;
  titulo: string = '';
  position: string = 'top';
  validarAccion: string = '';
  accionRealizar: string = '';
  visible: boolean;
  validarform:string = null;
  checked: boolean = false;
  lstEstados: SelectItem[] = [];
  lstCompania: SelectItem[] = [];
  lstTipoDato: SelectItem[] = [];
  usuario: string = "";
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  dto: Parametros = new Parametros();
  filtrocompa: FiltroCompaniamast = new FiltroCompaniamast();
  loading: boolean = false;
  bloquearPag: boolean;
  puedeEditar: boolean = false;
  NoPuedeEditar: boolean = false;
  fechaCreacion: Date;
  fechaModificacion: Date;
  constructor(
    private PersonaService: PersonaService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private messageService: MessageService,
    private ParametrosService: ParametrosService) {
    super();
  }

  ngOnInit(): void {
    this.cargarSelect();
    this.iniciarComponent();
  }

  ngOnDestroy(): void {

  }

  cargarSelect(): void {
        const optTodos = { label: ConstanteAngular.COMBOTODOS, value: null };
        forkJoin({
          estados: this.obtenerDataMaestro('ESTLETRAS'),
        }
        ).subscribe(resp => {
          this.lstEstados = [...resp.estados];
        });
        this.cargarCombocompania();
        this.cargarTipo();
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
            this.dto = new Parametros();
            this.dto.Estado = "A";
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


  cargarEstados() {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
      this.lstEstados.push({ label: i.Nombre.trim().toUpperCase(), value: i.Codigo.trim() });
    });
    //console.log("lstEstados",this.lstEstados);
    
  }

  cargarCombocompania(): Promise<number> {
    this.lstCompania = [];
    this.lstCompania.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.filtrocompa.estado = "A";
    return this.maestrocompaniaMastService.listarCompaniaMast(this.filtrocompa).then(res => {
      //console.log("company", res);
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim().toUpperCase(), value: ele.CompaniaCodigo.trim() });
      });
      return 1;
    });
  }


  cargarTipo() {
    this.lstTipoDato = [];
    this.lstTipoDato.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstTipoDato.push({ label: 'Texto'.toUpperCase(), value: "T" });
    this.lstTipoDato.push({ label: 'Numero'.toUpperCase(), value: "N" });
    this.lstTipoDato.push({ label: 'Fecha'.toUpperCase(), value: "F" });
    this.dto.TipodeDatoFlag = "T";
  }

  async coreGuardar() {
          try {
            //if (this.estaVacio(this.dto.CompaniaCodigo)) { this.messageShow('warn', 'Advertencia', 'Seleccione una compañia válida'); return; }
            //if (this.estaVacio(this.dto.TipodeDatoFlag)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de dato válido'); return; }
            //if (this.estaVacio(this.dto.AplicacionCodigo)) { this.messageShow('warn', 'Advertencia', 'Ingrese una aplicación válida'); return; }
            //if (this.estaVacio(this.dto.Texto)) { this.messageShow('warn', 'Advertencia', 'Ingrese un texto válido'); return; }
            //if (this.estaVacio(this.dto.ParametroClave)) { this.messageShow('warn', 'Advertencia', 'Ingrese un parámetro válido'); return; }
            //if (this.estaVacio(this.dto.Numero)) { this.messageShow('warn', 'Advertencia', 'Ingrese un valor válido'); return; }
            //if (this.estaVacio(this.dto.Fecha)) { this.messageShow('warn', 'Advertencia', 'Ingrese una fecha válida'); return; }
            //if (this.estaVacio(this.dto.Estado)) { this.messageShow('warn', 'Advertencia', 'Seleccione una estado válido'); return; }
            let valorAccionServicio: number = this.accionRealizar == ConstanteUI.ACCION_SOLICITADA_NUEVO ? 1 : 2;
            this.bloquearPag = true;
            const consultaRepsonse = await this.ParametrosService.mantenimientoParametros(valorAccionServicio, this.dto, this.getUsuarioToken());
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
