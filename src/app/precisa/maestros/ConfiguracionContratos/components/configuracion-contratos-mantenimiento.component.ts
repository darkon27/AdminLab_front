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
import { forkJoin } from "rxjs";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'ngx-configuracion-contratos-mantenimiento',
  templateUrl: './configuracion-contratos-mantenimiento.component.html'
})

export class ConfiguracionContratosMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  @ViewChild(ClienteRucBuscarComponent, { static: false }) clienteRucBuscarComponent: ClienteRucBuscarComponent;

  acciones: string = ''
  position: string = 'top'
  checked: boolean = false;
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
  deshabilitarOpt: boolean = false;

  validarform: string = null;

  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  // Entydad: tipoOperacion = new tipoOperacion();
  EntyPacienteCli: FiltroPacienteClinica = new FiltroPacienteClinica();

  lstTipoAdmision: SelectItem[] = [];
  lstTipoPaciente: SelectItem[] = [];
  lstMoneda: SelectItem[] = [];
  lstFormula: SelectItem[] = [];
  lstListaBase: SelectItem[] = [];
  lstsedes: SelectItem[] = [];
  lstsedeCliente: SelectItem[] = [];
  lstEstados: SelectItem[] = [];

  contratoForm: FormGroup

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
    private _FormBuilder: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    // this.Entydad = new tipoOperacion();
    this.estruturaForm();

    this.cargarComboEstados();
    this.cargarComboFormula();
    this.cargarComboMoneda();
    this.cargarTipoAdmision();
    this.cargarTipoPaciente(); // Asegúrate de cargar el tipo de paciente


    const p1 = this.cargarComboListaBase();
  }

  ngOnDestroy(): void {
    // this.Entydad = new tipoOperacion();
    this.estruturaForm();
    this.lstEstados = [];

  }

  estruturaForm(): void {
    this.contratoForm = this._FormBuilder.group({
      TipoOperacionID: [{ value: 0, disabled: this.deshabilitarOpt }],
      TIPOADMISIONID: [{ value: 0, disabled: this.deshabilitarOpt }],
      Persona: [{ value: 0, disabled: this.deshabilitarOpt }],
      TPContratoID: [{ value: 0, disabled: this.deshabilitarOpt }],
      IdListaBase: [{ value: 0, disabled: this.deshabilitarOpt }],
      UneuNegocioId: [{ value: 0, disabled: this.deshabilitarOpt }],
      TPAplicaFactor: [{ value: 0, disabled: this.deshabilitarOpt }],
      FechaCreacion: [{ value: new Date(), disabled: this.deshabilitarOpt }],
      FechaModificacion: [{ value: new Date(), disabled: this.deshabilitarOpt }],
      UsuarioCreacion: [{ value: '', disabled: this.deshabilitarOpt }],
      UsuarioModificacion: [{ value: '', disabled: this.deshabilitarOpt }],
      IpCreacion: [{ value: '', disabled: this.deshabilitarOpt }],
      IpModificacion: [{ value: '', disabled: this.deshabilitarOpt }],
      TipEstado: [{ value: 0, disabled: this.deshabilitarOpt }],
      TPFactor: [{ value: 0, disabled: this.deshabilitarOpt }],
      TPMoneda: [{ value: '', disabled: this.deshabilitarOpt }],
      AplicaFormula: [{ value: 0, disabled: this.deshabilitarOpt }],
      TipoPacienteId: [{ value: 0, disabled: this.deshabilitarOpt }],
      IdSede: [{ value: 0, disabled: this.deshabilitarOpt }],
      Observacion: [{ value: '', disabled: this.deshabilitarOpt }],
      FlatAprobacion: [{ value: 0, disabled: this.deshabilitarOpt }],
      FlaCon: [{ value: 0, disabled: this.deshabilitarOpt }],
      FlagRedondeo: [{ value: 0, disabled: this.deshabilitarOpt }],
      FlagArchivo: [{ value: 0, disabled: this.deshabilitarOpt }],
      IdSedeCliente: [{ value: 0, disabled: this.deshabilitarOpt }],
      FlagAdelanto: [{ value: 0, disabled: this.deshabilitarOpt }],
      FlagCortesia: [{ value: 0, disabled: this.deshabilitarOpt }],
      MontoMinimo: [{ value: 0, disabled: this.deshabilitarOpt }],
      AdmDescripcion: [{ value: '', disabled: this.deshabilitarOpt }],
      RucEmpresa: [{ value: '', disabled: true }],
      empresa: [{ value: '', disabled: true }],
      Nombre: [{ value: '', disabled: this.deshabilitarOpt }],
      EstadoDesc: [{ value: '', disabled: this.deshabilitarOpt }],
      SedDescripcion: [{ value: '', disabled: this.deshabilitarOpt }],
      FechaInicio: [{ value: new Date(), disabled: this.deshabilitarOpt }],
      FechaTermino: [{ value: new Date(), disabled: this.deshabilitarOpt }],
      Moneda: [{ value: '', disabled: this.deshabilitarOpt }],
      CodigoContrato: [{ value: '', disabled: this.deshabilitarOpt }],
      Monto: [{ value: 0, disabled: this.deshabilitarOpt }],
      Descripcion: [{ value: '', disabled: this.deshabilitarOpt }],
      DescripcionLocal: [{ value: '', disabled: this.deshabilitarOpt }],
      Codigo: [{ value: '', disabled: this.deshabilitarOpt }],
      Convenio: [{ value: '', disabled: this.deshabilitarOpt }],
      DesSedeCliente: [{ value: '', disabled: this.deshabilitarOpt }],
    });
  }

  async iniciarComponente(msj: MensajeController, accion: string, titulo, rowdata?: any) {
    this.bloquearPag = true;
    this.iniciarComponent();

    await this.comboCargarSedes();

    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.puedeEditar = false;
    this.validarform = accion;
    //  const p3 = this.cargarTipoPaciente(); // Asegúrate de que cargarTipoPaciente se ejecute correctamente
    // this.Entydad = new tipoOperacion();
    this.estruturaForm();
    this.deshabilitarOpt = false;
    switch (msj.componente) {
      case 'SELECTOR_NUEVO':
        this.HabilitarCampos(1);
        // Manejar caso especial si es necesario
        break;
      case 'SELECTOR_EDITAR':
      case 'SELECTOR_VER':

        if (msj.componente == 'SELECTOR_VER')
          this.deshabilitarOpt = true;

        this.estruturaForm();
        this.contratoForm.patchValue(rowdata); // Asignar los datos del rowdata a Entydad

        this.contratoForm.get('FechaInicio').setValue(new Date(rowdata.FechaInicio));
        this.contratoForm.get('FechaTermino').setValue(new Date(rowdata.FechaTermino));

        // Asigna correctamente las fechas
        if (!this.estaVacio(rowdata.IdSede)) {
          this.combosedecliente(rowdata.IdCliente, rowdata.IdSede);
        }
        this.HabilitarCampos(rowdata.TIPOADMISIONID);
        console.log("iniciarComponente this.Entydad::", this.contratoForm.value);
        break;
    }

    this.bloquearPag = false;
  }


  async cargarAcciones(accion: string, titulo) {
    this.acciones = `${titulo}: ${accion}`;
    console.log("carga busqueda c2")
    this.dialog = true;
    this.puedeEditar = false;
    console.log("cargarAcciones::", this.acciones);
    //  await this.cargarComboListaBase();
    //  await this.comboCargarSedes();
  }

  cargarComboEstados() {
    this.lstEstados = [];
    // this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstados.push({ label: i.Nombre, value: i.Codigo })
    });
  }

  cargarComboFormula() {
    this.lstFormula = [];
    // this.lstFormula.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    // Asume que getMiscelaneos() devuelve un array con los elementos filtrados
    const miscelaneos = this.getMiscelaneos().filter(x => x.CodigoTabla == "FORMULA");
    miscelaneos.forEach(i => {
      this.lstFormula.push({ label: i.Nombre, value: parseInt(i.Codigo.trim(), 10) });
    });
    console.log("cargarComboFormula::", this.lstFormula); // Para verificar que los datos cargan correctamente
  }

  cargarComboMoneda() {
    let dto = { Estado: "A" }
    this.lstMoneda = [];
    // this.lstMoneda.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.MaestrodetalleService.ListarMoneda(dto).then(res => {
      console.log("cargarComboMoneda::", res);
      res.forEach(ele => {
        this.lstMoneda.push({ label: ele.DescripcionCorta.trim(), value: ele.MonedaCodigo });
      });
    });
  }

  cargarComboListaBase() {
    let dto = { Estado: 1 }
    this.lstListaBase = [];
    // this.lstListaBase.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.listabaseServices.ListadoBase(dto).then(res => {
      console.log("cargarComboListaBase::", res);
      res.forEach(ele => {
        this.lstListaBase.push({ label: ele.Nombre.trim(), value: ele.IdListaBase });
      });
    });
  }

  cargarTipoAdmision() {
    let dto = { TipEstado: 1 }
    this.lstTipoAdmision = [];
    // this.lstTipoAdmision.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
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

      this.contratoForm.get('TIPOADMISIONID').setValue(event.value);
      // this.Entydad.TIPOADMISIONID = event.value;
      this.cargarTipoPaciente();
      console.log("selectedTipoAdmision::", event.value);
      this.HabilitarCampos(tipoAdmisionSeleccionado);
    }
  }


  HabilitarCampos(tipoAdmisionSeleccionado: number) {

    switch (tipoAdmisionSeleccionado) {
      case 1:
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
        break;
      case 2:
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
        break;
      default:
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
        break;
    }

  }

  cargarTipoPaciente() {

    let dto = { Estado: 1, TipoAdmisionId: this.contratoForm.get('TIPOADMISIONID').value };

    this.lstTipoPaciente = [];
    // this.lstTipoPaciente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    this.TipoPacienteService.ListaTipoPaciente(dto).then(res => {
      console.log("cargarTipoPaciente::", res); // Verifica la respuesta

      res.forEach(ele => {
        this.lstTipoPaciente.push({ label: ele.Descripcion.trim(), value: ele.TipoPacienteId });
      });

      console.log("lstTipoPaciente::", this.lstTipoPaciente); // Verifica que los datos se están añadiendo
    });
  }


  async comboCargarSedes() {
    const tipoSedeBusqueda = { IdEmpresa: 75300, SedEstado: 1 };
    const listaCombosedes = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('access_sedes'))) || [];

    if (listaCombosedes.length > 0) {
      this.lstsedes = listaCombosedes.map(e => ({ label: e.SedDescripcion, value: e.IdSede }));
    } else {
      try {
        const sedes = await this.loginService.listarSedes(tipoSedeBusqueda);
        if (sedes.length > 0) {
          this.lstsedes = sedes.map(obj => ({ label: obj.SedDescripcion, value: obj.IdSede }));
        }
      } catch (error) {
        console.error("Error al listar sedes:", error);
      }
    }
  }


  combosedecliente(IdCliente: number, IdSede: number) {
    this.lstsedeCliente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.EntyPacienteCli.IdCliente = IdCliente;
    this.EntyPacienteCli.IdSede = IdSede;

    this.pacienteClinicaService.listarCombosedeCliente(this.EntyPacienteCli)
      .then(resp => {
        resp.forEach(obj => this.lstsedeCliente.push({ label: obj.SedDescripcion, value: obj.IdSedeCliente }));
        this.contratoForm.get('IdSedeCliente').setValue(resp[0].IdSedeCliente);
        // this.Entydad.IdSedeCliente = resp[0].IdSedeCliente;
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
    this.contratoForm.get('Persona').setValue(0);
    this.contratoForm.get('RucEmpresa').setValue('');
    this.contratoForm.get('empresa').setValue('');
    // this.Entydad.Persona = 0;
    // this.Entydad.RucEmpresa = "";
    // this.Entydad.empresa = "";
  }

  validarTeclaEnterCliente(evento) {
    if (evento.key == "Enter") {

      if (this.contratoForm.get('RucEmpresa').value == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      }
      else if (this.contratoForm.get('RucEmpresa').value.trim().length != 11) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      } else {
        var filtroClienteRuc = new FiltroCliente()
        filtroClienteRuc.UneuNegocioId = 1;
        filtroClienteRuc.TipEstado = 1;
        filtroClienteRuc.Codigo = this.contratoForm.get('RucEmpresa').value  //this.Entydad.RucEmpresa.trim();

      }
    }
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'x1contra', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  coreGuardar(): void {

    console.log("coreGuardar", this.contratoForm.value);
    if (this.estaVacio(this.contratoForm.get('TIPOADMISIONID').value)) {
      this.messageShow('warn', 'Advertencia', 'Seleccione tipo Admisión');
      return;
    }

    if (this.estaVacio(this.contratoForm.get('TIPOADMISIONID').value != 3)) {
      if (this.estaVacio(this.contratoForm.get('Persona').value)) {
        this.messageShow('warn', 'Advertencia', 'Debe seleccionar la empresa');
        return;
      }
    }

    // Asegurar que las sedes seleccionadas se añadan al DTO
    console.log("coreGuarda this.validarform", this.validarform);
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
            this.contratoForm.get('UsuarioCreacion').setValue(this.getUsuarioAuth().data[0].Usuario);
            this.contratoForm.get('UsuarioModificacion').setValue('');
            this.contratoForm.get('FechaCreacion').setValue(new Date());
            this.contratoForm.get('FechaModificacion').setValue(null);

            // this.Entydad.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
            // this.Entydad.UsuarioModificacion = null;
            // this.Entydad.FechaCreacion = new Date();
            // this.Entydad.FechaModificacion = null;

            const respNuevo = await this.TipoOperacionService.MantenimientoTipoOperacion(ConstanteUI.SERVICIO_SOLICITUD_NUEVO, this.contratoForm.value, this.getUsuarioToken());
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

        this.contratoForm.get('UsuarioModificacion').setValue(this.getUsuarioAuth().data[0].Usuario);
        this.contratoForm.get('FechaModificacion').setValue(new Date());

        // this.Entydad.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
        // this.Entydad.FechaModificacion = new Date();

        this.confirmationService.confirm({
          header: "Confirmación",
          icon: "fa fa-question-circle",
          message: "¿Desea Modificar el registro ? ",
          key: "contrato",
          accept: async () => {

            const respEditar = await this.TipoOperacionService.MantenimientoTipoOperacion(ConstanteUI.SERVICIO_SOLICITUD_EDITAR, this.contratoForm.value, this.getUsuarioToken());

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


  async coreMensaje(mensage: MensajeController) {
    if (mensage.componente == "SELECCLIENTE") {
      console.log("SELECCLIENTE", mensage.resultado);

      this.contratoForm.get('RucEmpresa').setValue(mensage.resultado.Documento);
      this.contratoForm.get('empresa').setValue(mensage.resultado.empresa);

      // this.dto.CodEmpresaRoe = mensage.resultado.Documento;
      // this.dto.NombreCompleto = mensage.resultado.empresa;
      // this.dto.IdEmpresa = mensage.resultado.Persona;
      // this.combosedecliente(this.dto.IdEmpresa);
    }
  }
}
