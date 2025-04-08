import { Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";
import { MensajeController } from "../../../../../util/MensajeController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { FiltroCliente } from "../../../admision/consulta/dominio/filtro/FiltroConsultaAdmision";
import { FiltroPacienteClinica } from "../../../admision/paciente-clinica/dominio/filtro/FiltroPacienteClinica";
import { PacienteClinicaService } from "../../../admision/paciente-clinica/service/paciente-clinica.service";
import { UsuarioAuth } from "../../../auth/model/usuario";
import { LoginService } from "../../../auth/service/login.service";
import { ClienteRucBuscarComponent } from "../../../framework-comun/ClienteRuc/view/clienteRuc-buscar.component";
import { PersonaService } from "../../../framework-comun/Persona/servicio/persona.service";
import { convertDateStringsToDates } from "../../../framework/funciones/dateutils";
import { AppSatate } from "../../app.reducer";
import { MaestrodetalleService } from "../../Detalle/servicio/maestrodetalle.service";
import { listabaseServices } from "../../lista-base/service/listabase.service";
import { TipoAdmisionService } from "../../TipoAdmision/services/TipoAdmision.services";
import { TipoPacienteService } from "../../TipoPaciente/services/TipoPaciente.Services";
import { tipoOperacion } from "../model/TipoOperacion";
import { TipoOperacionService } from "../services/TipoOperacion.services";

@Component({
    selector: 'ngx-configuracion-contratos-mantenimiento',
    templateUrl: './configuracion-contratos-mantenimiento.component.html'
  })
  
export class ConfiguracionContratosMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  @ViewChild(ClienteRucBuscarComponent, { static: false }) clienteRucBuscarComponent: ClienteRucBuscarComponent;

  acciones: string = ''
  position: string = 'top'
  checked:boolean =false;
  visible: boolean = false;
  mostrarCliente: boolean = false;
  bloquearPag: boolean;
  editarCampos: boolean = false;
  editarCampoEmpresa: boolean = true;
  mostrarFecha: boolean = true;
  mostrarContrato: boolean = true;
  mostrarSede: boolean = true;
  mostrarCortesia: boolean = true;
  mostrarAdelanto: boolean = true;
  mostrarRedondeo: boolean = true;
  mostrarSedeCliente: boolean = true;
  mostrarAprobacion: boolean = true;
  mostrarMinimo: boolean = true;

  validarform: string = null;

  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  Entydad: tipoOperacion = new tipoOperacion();
  EntyPacienteCli: FiltroPacienteClinica = new FiltroPacienteClinica();

  lstTipoAdmision: SelectItem[] = [];
  lstTipoPaciente: SelectItem[] = [];
  lstMoneda: SelectItem[] = [];
  lstFormula: SelectItem[] = [];
  lstListaBase: SelectItem[] = [];
  lstsedes: SelectItem[] = [];
  lstsedeCliente: SelectItem[] = [];
  lstEstados: SelectItem[] = [];

  
  constructor(
    private TipoAdmisionService: TipoAdmisionService,
    private TipoPacienteService: TipoPacienteService,    
    private MaestrodetalleService: MaestrodetalleService,  
    private listabaseServices: listabaseServices,  
    private loginService: LoginService,   
    private pacienteClinicaService: PacienteClinicaService,  
    private messageService: MessageService,   
    private confirmationService: ConfirmationService, 
    private TipoOperacionService: TipoOperacionService, 
    private personaService: PersonaService,        
    private store: Store<AppSatate>
    ) {
    super();
  }

  ngOnInit(): void {
    this.Entydad = new tipoOperacion();
    this.cargarComboEstados();
    this.cargarComboFormula();
    this.cargarComboMoneda();
    this.cargarTipoAdmision();
    this.cargarTipoPaciente(); // Asegúrate de cargar el tipo de paciente
    const p1 = this.cargarComboListaBase();
}

  ngOnDestroy(): void {
    this.Entydad = new tipoOperacion();
    this.lstEstados = []; 

  }

  async iniciarComponente(msj: MensajeController, accion: string, titulo, rowdata?: any) {
    this.bloquearPag = true;
    const p1 = this.iniciarComponent();
    const p2 = this.comboCargarSedes();
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.puedeEditar = false; 
    this.validarform = accion;
  //  const p3 = this.cargarTipoPaciente(); // Asegúrate de que cargarTipoPaciente se ejecute correctamente
    this.Entydad = new tipoOperacion();
    Promise.all([p1, p2]).then((resp) => {
        console.log("iniciarComponente msj::", msj);
        
        if (msj.componente == "SELECTOR_NUEVO") {
          this.HabilitarCampos(1);
            // Manejar caso especial si es necesario
        } else {

            this.Entydad = rowdata; // Asignar los datos del rowdata a Entydad

            // Asigna correctamente las fechas
            if (!this.estaVacio(rowdata.IdSede)) {
                this.combosedecliente(rowdata.IdCliente, rowdata.IdSede);
            }
            this.Entydad.FechaInicio = new Date(rowdata.FechaInicio);
            this.Entydad.FechaTermino = new Date(rowdata.FechaTermino);
            this.HabilitarCampos(rowdata.TIPOADMISIONID);
            console.log("iniciarComponente this.Entydad::", this.Entydad);
        }   
    });
    this.bloquearPag = false;
}
  
  async cargarAcciones(accion: string, titulo) {
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.puedeEditar = false; 
    console.log("cargarAcciones::", this.acciones);
  //  await this.cargarComboListaBase();
  //  await this.comboCargarSedes();
  }

cargarComboEstados() {
      this.lstEstados = [];
      this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstados.push({ label: i.Nombre, value: i.Codigo })
    });
  }

cargarComboFormula() {
    this.lstFormula = [];
    this.lstFormula.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });    
    // Asume que getMiscelaneos() devuelve un array con los elementos filtrados
    const miscelaneos = this.getMiscelaneos().filter(x => x.CodigoTabla == "FORMULA");    
    miscelaneos.forEach(i => {
        this.lstFormula.push({ label: i.Nombre, value: parseInt(i.Codigo.trim(), 10) });
    });    
    console.log("cargarComboFormula::", this.lstFormula); // Para verificar que los datos cargan correctamente
}

cargarComboMoneda() {
  let dto = {  Estado: "A"  }
  this.lstMoneda = [];
  this.lstMoneda.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
  this.MaestrodetalleService.ListarMoneda(dto).then(res => {
  console.log("cargarComboMoneda::", res);
      res.forEach(ele => {
          this.lstMoneda.push({ label: ele.DescripcionCorta.trim(), value: ele.MonedaCodigo });
      });
  });
}

cargarComboListaBase() {
  let dto = {  Estado: 1  }
  this.lstListaBase = [];
  this.lstListaBase.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
  this.listabaseServices.ListadoBase(dto).then(res => {
  console.log("cargarComboListaBase::", res);
      res.forEach(ele => {
          this.lstListaBase.push({ label: ele.Nombre.trim(), value: ele.IdListaBase });
      });
  });
}

cargarTipoAdmision() {
      let dto = {  TipEstado: 1  }
      this.lstTipoAdmision = [];
      this.lstTipoAdmision.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.TipoAdmisionService.ListaTipoAdmision(dto).then(res => {
      console.log("cargarTipoAdmision::", res);
      res.forEach(ele => {
          this.lstTipoAdmision.push({ label: ele.AdmDescripcion.trim(), value: ele.TipoAdmisionId });
      });
/*       this.Entydad.TIPOADMISIONID = 1;
      this.cargarTipoPaciente(); */
    });
  }

selectedTipoAdmision(event) {
    if (event.value != null) { 
      const tipoAdmisionSeleccionado = event.value;  
      this.Entydad.TIPOADMISIONID  = event.value;
      this.cargarTipoPaciente();
      console.log("selectedTipoAdmision::", event.value);
      this.HabilitarCampos(tipoAdmisionSeleccionado);
    }
  }


  HabilitarCampos(tipoAdmisionSeleccionado: number) {

    if (tipoAdmisionSeleccionado === 1) {      
      this.mostrarCliente = true;
      this.mostrarFecha = false;
      this.mostrarContrato = false;
      this.mostrarSede = true;
      this.mostrarSedeCliente = true;        
      this.mostrarCortesia = false;
      this.mostrarAdelanto = false;
      this.mostrarRedondeo = false;
      this.mostrarAprobacion = false;  
      this.mostrarMinimo = false;  
      
      } else if (tipoAdmisionSeleccionado === 2) {
          this.mostrarCliente = true;
          this.mostrarFecha = true;
          this.mostrarContrato = true;
          this.mostrarSede = false;
          this.mostrarSedeCliente = false;
          this.mostrarCortesia = false;
          this.mostrarAdelanto = true;
          this.mostrarRedondeo = true;
          this.mostrarAprobacion = true;
          this.mostrarMinimo = true;  
      } else {
          // Si no coincide con ninguna condición, ocultar ambos
          this.mostrarCliente = false;
          this.mostrarFecha = false;
          this.mostrarContrato = false;
          this.mostrarSede = true;
          this.mostrarSedeCliente = false;
          this.mostrarCortesia = true;
          this.mostrarAdelanto = true;
          this.mostrarRedondeo = true;
          this.mostrarAprobacion = true;
          this.mostrarMinimo = true;  
      }

  }

  cargarTipoPaciente() {
    let dto = { Estado: 1, TipoAdmisionId: this.Entydad.TIPOADMISIONID };
    
    this.lstTipoPaciente = [];
    this.lstTipoPaciente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    
    this.TipoPacienteService.ListaTipoPaciente(dto).then(res => {
        console.log("cargarTipoPaciente::", res); // Verifica la respuesta
        
        res.forEach(ele => {
            this.lstTipoPaciente.push({ label: ele.Descripcion.trim(), value: ele.TipoPacienteId });
        });
        
        console.log("lstTipoPaciente::", this.lstTipoPaciente); // Verifica que los datos se están añadiendo
    });
}


comboCargarSedes() {
    let lstsedes = { IdEmpresa: 75300, SedEstado: 1 }
    this.lstsedes.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    var listaCombosedes = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('access_sedes')));
    if (lstsedes != null) {
      listaCombosedes.forEach(e => {
        this.lstsedes.push({ label: e.SedDescripcion, value: e.IdSede });
      });
      console.log("comboCargarSedes", listaCombosedes)
    }
    else {
       this.loginService.listarSedes(lstsedes).then(
        sedes => {
          if (sedes.length > 0) {
            sedes.forEach(obj => this.lstsedes.push({ label: obj.SedDescripcion, value: obj.IdSede }));
            console.log("comboCargarSedes", sedes)
          }     
        }
      )
    }
  }

combosedecliente(IdCliente: number, IdSede: number) {
    this.lstsedeCliente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.EntyPacienteCli.IdCliente = IdCliente;
    this.EntyPacienteCli.IdSede = IdSede;

     this.pacienteClinicaService.listarCombosedeCliente(this.EntyPacienteCli)
      .then(resp => {
        resp.forEach(obj => this.lstsedeCliente.push({ label: obj.SedDescripcion, value: obj.IdSedeCliente }));
        this.Entydad.IdSedeCliente = resp[0].IdSedeCliente;
        console.log("combosedecliente", this.lstsedeCliente);
      });    
  }

  validateDecimalInput(event: KeyboardEvent) {
      const pattern = /[0-9\.\,]/;
      const inputChar = String.fromCharCode(event.charCode);
      
      // Permitir solo números y punto decimal
      if (!pattern.test(inputChar) && event.charCode !== 0) {
          event.preventDefault();
      }
  }

  validatePaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData?.getData('text') || '';
    const decimalPattern = /^\d+(\.\d{0,2})?$/;

    // Evitar pegar si el contenido no es un número decimal válido
    if (!decimalPattern.test(clipboardData)) {
        event.preventDefault();
    }
  }

  verSelectorCliente(): void {
    this.clienteRucBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECCLIENTE', 'BUSCAR'), 'BUSCAR');
  }

  limpiarClienteRuc() {
    this.Entydad.Persona = 0;
    this.Entydad.RucEmpresa = "";
    this.Entydad.empresa = "";
  }

  validarTeclaEnterCliente(evento) {
    if (evento.key == "Enter") {
      if (this.Entydad.RucEmpresa == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      }
      else if (this.Entydad.RucEmpresa.trim().length != 11) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      } else {
        var filtroClienteRuc = new FiltroCliente()
        filtroClienteRuc.UneuNegocioId = 1;
        filtroClienteRuc.TipEstado = 1;
        filtroClienteRuc.Codigo = this.Entydad.RucEmpresa.trim();
  
      }
    }
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'x1contra', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  coreGuardar(): void {

    console.log("coreGuardar",  this.Entydad);
    if (this.estaVacio(this.Entydad.TIPOADMISIONID)) { 
      this.messageShow('warn', 'Advertencia', 'Seleccione tipo Admisión'); 
      return; 
    }

    if (this.estaVacio(this.Entydad.TIPOADMISIONID != 3 )) { 
        if (this.estaVacio(this.Entydad.Persona)) { 
          this.messageShow('warn', 'Advertencia', 'Debe seleccionar la empresa'); 
          return; 
        }
    }   
  
    // Asegurar que las sedes seleccionadas se añadan al DTO
    console.log("coreGuarda this.validarform",  this.validarform);
    this.bloquearPag = true;
    switch (this.validarform) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.confirmationService.confirm({
          header: "Confirmación",
          icon: "fa fa-question-circle",
          message: "¿Desea Guardar el registro ? ",
          key: "contrato",
          accept: async () => {
            /**AUDITORIA */
            this.Entydad.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
            this.Entydad.UsuarioModificacion = null;
            this.Entydad.FechaCreacion = new Date();
            this.Entydad.FechaModificacion = null;

            const respNuevo = await this.TipoOperacionService.MantenimientoTipoOperacion(ConstanteUI.SERVICIO_SOLICITUD_NUEVO, this.Entydad, this.getUsuarioToken());
            if (respNuevo != null) {
              if (respNuevo.success) {
                this.messageShow('success', 'Success', this.getMensajeGuardado());
                this.mensajeController.resultado = respNuevo;
                this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                this.bloquearPag = false;
                this.dialog = false;
              } else {
                this.messageShow('warn', 'Advertencia', this.getMensajeErrorGuardado());
                this.bloquearPag = false;
              }
            } else {
              this.messageShow('warn', 'Advertencia', this.getMensajeErrorGuardado());
              this.bloquearPag = false;
            }
          }
        });
        break;
  
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:

        this.Entydad.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
        this.Entydad.FechaModificacion = new Date();

        this.confirmationService.confirm({
          header: "Confirmación",
          icon: "fa fa-question-circle",
          message: "¿Desea Modificar el registro ? ",
          key: "contrato",
          accept: async () => {

            const respEditar = await this.TipoOperacionService.MantenimientoTipoOperacion(ConstanteUI.SERVICIO_SOLICITUD_EDITAR, this.Entydad, this.getUsuarioToken());
  
            if (respEditar != null) {
              if (respEditar.success) {

                this.messageShow('success', 'Success', this.getMensajeActualizado());
                this.mensajeController.resultado = respEditar;
                this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                this.bloquearPag = false;
                this.dialog = false;
              } else {
                this.messageShow('warn', 'Advertencia', this.getMensajeErrorActualizar());
                this.bloquearPag = false;
              }
            } else {
              this.messageShow('warn', 'Advertencia', this.getMensajeErrorActualizar());
              this.bloquearPag = false;
            }
          }
        });
        break;
    }
    this.bloquearPag = false;
  }



}
