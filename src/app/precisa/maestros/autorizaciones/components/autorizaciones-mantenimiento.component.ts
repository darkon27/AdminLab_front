import { Component, OnInit, ViewChild } from "@angular/core";
import { MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { ConsultaAdmisionService } from "../../../admision/consulta/servicio/consulta-admision.service";
import { UsuarioAuth } from "../../../auth/model/usuario";
import { PersonaBuscarComponent } from "../../../framework-comun/Persona/components/persona-buscar.component";
import { PersonaService } from "../../../framework-comun/Persona/servicio/persona.service";
import { Autorizacion } from "../model/autorizacion";
import { AutorizacionService } from "../service/autorizacionService";
import { forkJoin } from "rxjs";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";
import { dtoPersona } from "../../../framework-comun/Persona/dominio/dto/dtoPersona";
import { FiltroPersona } from "../../persona/dominio/filtro/FiltroPersona";


@Component({
    selector: 'ngx-autorizaciones-mantenimiento',
    templateUrl: './autorizaciones-mantenimiento.component.html'
  })

export class AutorizacionesMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;


  dtoPersona: dtoPersona = new dtoPersona();
  filtroPersona: FiltroPersona = new FiltroPersona();
  
  lstTipoDocumento: SelectItem[] = [];
  lstTipoFormula: SelectItem[] = [];
  EnterPersona: SelectItem[] = [];
  lstPersona: any[] = [];
  visible: boolean = false;
  bloquearPag: boolean;
  titulo: string = ''
  filtro: Autorizacion = new Autorizacion();
  editarCampo1: boolean = false;
  editarCampoAutorizador: boolean = true;
  editarCampo2: boolean = false;
  editarCampoPaciente: boolean = true;
  accionRealizar: string = ''
  position: string = 'top'
  validarform: string = null;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  dto: Autorizacion = new Autorizacion();
  lstEstados: SelectItem[] = [];
  lstFormula: SelectItem[] = [];
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;

  constructor(
    private messageService: MessageService,
    private consultaAdmisionService: ConsultaAdmisionService,
    private AutorizacionService: AutorizacionService,
    private personaService: PersonaService
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarSelect();
    this.iniciarComponent();
  }

  cargarSelect(): void {
    const opt = { label: ConstanteAngular.COMBOSELECCIONE, value: null };
    forkJoin({
      estados: this.obtenerDataMaestro('ESTGEN'),
    }
    ).subscribe(resp => {
      const dataEstados = resp.estados?.map((ele: any) => ({
        label: ele.label?.trim()?.toUpperCase() || "", value: Number.parseInt(ele.value)
      }));
      this.lstEstados = [opt, ...dataEstados];

      this.lstTipoFormula = [{ label: 'PORCENTAJE', value: 2 }, { label: 'MONTO', value: 1 }];
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
            this.dto.IdAutorizacion = 1;
            this.dto.AplicaTitular = this.dto.AplicaTitular ? 1 : 0;
            this.dto.AplicaMonto = this.dto.AplicaMonto ? 1 : 0;
    
            this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
            this.fechaCreacion = new Date();
            this.fechaModificacion = null;
            this.dto.UneuNegocioId = 1;
            this.dto.IdTitularAutorizado = 2;
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
  
  verSelectorAutorizador(): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_SELECCION_EMPLEADO, 'BUSCAR'), 'BUSCAR ', "E");
  }

  validarEnterAutorizador(evento) {   
    if (evento.key == "Enter") {
      if (this.filtro.DocAutorizador == null) {
        this.toastMensaje('Ingrese un Nro. de documento', 'warning', 3000);
      }
      else if (this.filtro.DocAutorizador.trim().length <= 4) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
        this.filtro.DocPaciente = null;
      } else {
        this.getPersonaServicio(this.filtro.DocAutorizador.trim(), 1);
      }
    }
  }

  limpiarAutorizador() {
    this.filtro.DocAutorizador = null;
    this.filtro.IdAutorizacion = null;
    this.filtro.Persona = null;
    this.editarCampoAutorizador = false;
  }

  verSelectorPaciente(): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECPACIENTE', 'BUSCAR'), 'BUSCAR','N');
  }


  validarEnterPaciente(evento) {
    if (evento.key == "Enter") {
      if (this.filtro.DocPaciente == null) {
        this.toastMensaje('Ingrese un Nro. de documento', 'warning', 3000);
      }
      else if (this.filtro.DocPaciente.trim().length <= 4) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
        this.filtro.DocPaciente = null;
      } else {
        this.getPersonaServicio(this.filtro.DocPaciente.trim(), 2);
      }
    }
  }


  limpiarPaciente() {
    this.filtro.Paciente = "";
    this.filtro.IdPaciente = null;
    this.filtro.DocPaciente = "";
    this.editarCampoPaciente = false;
    this.editarCampo2 = true;
  }

  coreMensaje(mensage: MensajeController): void {
    const dataDevuelta = mensage.resultado;

    switch (mensage.componente.toUpperCase()) {
      case ConstanteUI.ACCION_SOLICITADA_SELECCION_EMPLEADO:
        this.dto.IdUsuario = dataDevuelta.Documento.trim();
        this.dto.Persona = dataDevuelta.NombreCompleto.trim();
        break;
      default:
        break;
    }
  }

  getPersonaServicio(documento: any, validator: number) {
    //console.log("mensaje documento", documento);
    let dto = {
      Documento: documento.trim(),
      tipopersona: "P",
      SoloBeneficiarios: "0",
      UneuNegocioId: "0"
    }

    return this.personaService.listaPersonaUsuario(dto).then((res) => {
      //console.log("mensaje del res", res);
      this.bloquearPag = false;
      if (res.length > 0) {
        if (validator == 1) {
          if (this.estaVacio(res[0].NombreCompleto)) {
            this.filtro.Persona = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`
          } else {
            this.filtro.Persona = res[0].NombreCompleto;
          }
          this.filtro.DocAutorizador = res[0].Documento;
          this.filtro.IdAutorizacion = res[0].Persona;
         }
         else {
          if (this.estaVacio(res[0].NombreCompleto)) {
            this.filtro.Paciente = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`

          } else {
            this.filtro.Paciente = res[0].NombreCompleto;
          }
          this.filtro.DocPaciente = res[0].Documento;
          this.filtro.IdPaciente = res[0].Persona;
        }
      } else {
        //console.log("entroo nadaaa");
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
        this.filtro.DocPaciente = null;
      }
    }).catch(error => error);

  }

  cargarComboEstados() {
      this.lstEstados = [];
      this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
        this.lstEstados.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo });
      });
  }

  cargarComboFORMULA() {
      this.lstFormula = [];
      this.lstFormula.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.getMiscelaneos()?.filter(x => x.CodigoTabla == "FORMULA").forEach(i => {
        this.lstEstados.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo });
      });
  }

  async coreGuardar() {
          try {
            if (this.estaVacio(this.dto.UneuNegocioId)) { this.MensajeToastComun('notification','warn', 'Advertencia', 'Ingrese UneuNegocioId'); return; }
            if (this.estaVacio(this.dto.IdAutorizacion)) { this.MensajeToastComun('notification','warn', 'Advertencia', 'Ingrese IdAutorizacion'); return; }
            if (this.estaVacio(this.dto.Observacion)) { this.MensajeToastComun('notification','warn', 'Advertencia', 'Ingrese Observacion'); return; }
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
