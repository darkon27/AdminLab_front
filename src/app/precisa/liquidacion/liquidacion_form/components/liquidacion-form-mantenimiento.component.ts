import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from "@nebular/theme";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { FiltroTipoOperacion } from '../../../admision/consulta/dominio/filtro/FiltroConsultaAdmision';
import { ConsultaAdmisionService } from '../../../admision/consulta/servicio/consulta-admision.service';
import { UsuarioAuth } from "../../../auth/model/usuario";
import { FiltroServicio } from "../../../framework-comun/Examen/dominio/filtro/FiltroExamen";
import Swal from "sweetalert2";
import { PersonaBuscarComponent } from "../../../framework-comun/Persona/components/persona-buscar.component";
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { convertDateStringsToDates } from "../../../framework/funciones/dateutils";
import { TipoAdmisionService } from "../../../maestros/TipoAdmision/services/TipoAdmision.services";
import { dtoExpediente } from "../model/dtoExpediente";
import { dtoExpedienteDetalle } from '../model/dtoExpedienteDetalle';
import { ExpedienteModal } from "../model/ExpedienteModal";
import { LiquidacionService } from "../service/liquidacion.services";
import { LoginService } from '../../../auth/service/login.service';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
import { TitleCasePipe } from '@angular/common';
import { ExamenService } from '../../../framework-comun/Examen/servicio/Examen.service';
import { ProduccionService } from '../../produccion/service/produccion.services';
import { EmpresaBuscarComponent } from '../../../framework-comun/Empresa/view/empresa-buscar.component';

@Component({
  selector: 'ngx-liquidacion-form-mantenimiento',
  templateUrl: './liquidacion-form-mantenimiento.component.html',
  styleUrls: ['./liquidacion-form-mantenimiento.component.scss']
})

export class LiquidacionFormMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy, UIMantenimientoController {
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  @ViewChild(EmpresaBuscarComponent, { static: false }) empresaBuscarComponent: EmpresaBuscarComponent;

  bloquearPag: boolean;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;  
  usuarioSesion: any;  
  verLiquidacion: boolean = false;
  acciones: string = ''
  position: string = 'top'

  Auth: UsuarioAuth = new UsuarioAuth();
  filtro: dtoExpediente = new dtoExpediente();
  dto: ExpedienteModal = new ExpedienteModal();
  dtodet: dtoExpedienteDetalle = new dtoExpedienteDetalle();
  servicio: FiltroServicio = new FiltroServicio();
  lstExpedienteDetalle: any[] = [];
  liquidacionForm: any = {};

  // Listas de combos}  
  lstClasificadorMovimiento: SelectItem[] = [];
  lstTiposLiquidaciones: SelectItem[] = [];
  lstClasificadorNegocio: SelectItem[] = [];
  lstAdmision: SelectItem[] = [];
  lstEstado: SelectItem[] = [];
  lstPeriodo: SelectItem[] = [];
  lstTipoPaciente: SelectItem[] = [];
  lstContrato: SelectItem[] = [];
  lstSede: SelectItem[] = [];

  constructor(
    private messageService: MessageService,
    private toastrService: NbToastrService,
    public loginService: LoginService,
    private personaService: PersonaService,
    private liquidacionService: LiquidacionService,
    private consultaAdmisionService: ConsultaAdmisionService,
    private tipoAdmisionService: TipoAdmisionService,
    private titleCasePipe: TitleCasePipe,
    private examenService: ExamenService,
    private produccionService: ProduccionService,
  ) {
    super();
  }

  ngOnDestroy(): void {
    // this.userInactive.unsubscribe();
  }
  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }
  coreBuscar(): void {
    throw new Error('Method not implemented.');
  }
  coreExportar(): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  verSelector(tipo: string): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECPACIENTE', 'BUSCAR'), 'BUSCAR ', "E");
  }

  ngOnInit(): void {
    // this.bloquearPag = true;
  }


  /**
   * ***Geampier Santamaría**
   *      LISTO IMPLEMENTAR:
   *        - YA SE PUEDE IMPLEMENTAR LA CREACION ( SIN DETALLE )
   *        - ¿UTILIZAR RXJS?
   *        - ¿USAR FORMGROUP?
   * 
   * NOTA PARA MÍ (Geampier Santamaría): 
   *  - REVISAR METODOS QUE LLENAN COMBOS, ESTÁN GENERANDO ERRORES. (LO SOLUCIONA .MAP y NULLABLE)
   */

  coreIniciarComponentemantenimiento(mensaje: MensajeController, accionform: string, titulo: string, page: number, data?: any): void {
    this.dialog = true;
    this.acciones = `Liquidación: ${titulo}`;
    this.cargarCombos();
    this.CrearFormularioLiquidacion();
    this.bloquearPag = true;
    switch (accionform) 
    {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.nuevoRegistro();
        break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        this.editarRegistro(); 
        this.dto.cabecera = data;
        console.log("coreIniciarComponentemantenimiento ::", this.dto.cabecera);
        break;
      default: this.nuevoRegistro(); 
        break;
    }
    this.bloquearPag = false;
  }

  CrearFormularioLiquidacion() {
    this.liquidacionForm = {

      tipoLiquidacion: null,
      clasificadorNegocio: null,
      nroLiquidacion: 0,
      fechaLiquidacion: new Date(),
      tipoAdmision: null,
      codigoClienteEmpresa: '',
      documentoCliente: '',
      nombresCliente: '',
      fechaAprobacion: new Date(),
      fechaCierre: new Date(),
      estado: null,
      comentarios: '',

      periodo: '',
      tipoPaciente: null,
      contrato: null,
      sede: null,
      fechaInicial: new Date(),
      fechaFinal: new Date(),
    }
  }

  nuevoRegistro() {
  }
  editarRegistro() {
  }

  cargarCombos() {
    this.obtenerDatosusuario();

    this.listarTipoLiquidaciones();
    this.ListarClasificadorNegocio();
    this.ListarTipoAdmision();
    this.listaComboEstado();
    this.listarPeriodos();
    this.listarTipoPaciente();

    this.listarSedes();
  }
  private obtenerDatosusuario() {
    const listaComboliente: any = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('access_user')));

    if (listaComboliente?.data?.length > 0) {
      this.usuarioSesion = listaComboliente.data[0];
    }
  }

  private listarTipoLiquidaciones() {
    this.lstTiposLiquidaciones = [];
    this.lstTiposLiquidaciones.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    const lista = this.getMiscelaneos()?.filter(x => x.CodigoTabla == "TIPLIQ");
    this.lstTiposLiquidaciones = [...this.lstTiposLiquidaciones, ...lista.map((item) => { return { label: item.Nombre.toUpperCase(), value: item.Codigo.trim() } })]
  }

  private ListarClasificadorNegocio() {
    this.lstClasificadorNegocio = [];
    const objFiltro: FiltroServicio = new FiltroServicio();
    objFiltro.Estado = 1;

    this.lstClasificadorNegocio.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.examenService.serviciopaginado(objFiltro).then((lista) => {
      this.lstClasificadorNegocio = [...this.lstClasificadorNegocio, ...lista.map((item) => { return { label: item.Nombre.toLocaleUpperCase(), value: item.ClasificadorMovimiento } })]
    });
  }

  private ListarTipoAdmision() {
    this.lstAdmision = [];
    const objtipoAdmision = { Estado: 1 };
    this.lstAdmision.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.tipoAdmisionService.ListaTipoAdmision(objtipoAdmision).then((lista) => {
      this.lstAdmision = [...this.lstAdmision, ...lista.map((item) => { return { label: item.AdmDescripcion.toLocaleUpperCase(), value: item.TipoAdmisionId } })]
    });
  }
  private listaComboEstado() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    const lstEstados: any[] = this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTLIQ")
    this.lstEstado = [...this.lstEstado, ...lstEstados.map((item) => { return { label: item.Nombre.toLocaleUpperCase(), value: item.Codigo } })]
  }

  private listarPeriodos() {
      this.lstPeriodo = [];
      const filtro = { UneuNegocioId: 1 };
      this.lstPeriodo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.produccionService.ListarPeriodoEmision({ UneuNegocioId: 1 }).then((lista) => {
      this.lstPeriodo = [...this.lstPeriodo, ...lista.map((item) => { return { label: item.Nombre.toLocaleUpperCase(), value: item.Codigo } })]
    });
  }

  private listarTipoPaciente() {
      this.lstTipoPaciente = [];
      const filtroData: FiltroTipoOperacion = { TipEstado: 1, TIPOADMISIONID: 3, };
      this.lstTipoPaciente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.consultaAdmisionService.listarcombotipooperacion(filtroData).then((lista) => {
      this.lstTipoPaciente = [...this.lstTipoPaciente, ...lista.map((item) => { return { label: item.Descripcion.toLocaleUpperCase(), value: item.TipoOperacionID } })]
    });
  }

  private listarSedes() {
    this.lstSede = [];
    this.lstSede.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    const listaComboSedes: any[] = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('access_sedes')));
    if (listaComboSedes.length > 0) {
      this.lstSede = [...this.lstSede, ...listaComboSedes.map((item) => { return { label: item.SedDescripcion.toLocaleUpperCase(), value: item.IdSede } })]
    }
  }

  verSelectorEmpresa(): void {
    this.empresaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECTEMPRESA', 'BUSCAR'), 'BUSCAR');
  }

  coreMensaje(mensage: MensajeController): void {
    const dataDevuelta = mensage.resultado;
    switch (mensage.componente.toUpperCase()) {
      case 'SELECTEMPRESA':
        this.obtenerClienteEmpresa(dataDevuelta); return;
      default:
        break;
    }

  }
  obtenerClienteEmpresa(data: any): void {
    if (data != null || data != undefined) {
      this.liquidacionForm.codigoClienteEmpresa = data.Persona;
      this.liquidacionForm.documentoCliente = data.Documento.trim();
      this.liquidacionForm.nombreSCliente = data.NombreCompleto;
    }
  }

  coreLimpiar(): void {
    this.liquidacionForm.codigoClienteEmpresa = '';
    this.liquidacionForm.documentoCliente = '';
    this.liquidacionForm.nombreSCliente = '';
  }

  /**FIN */

  fechaActual() {
    var hoy = new Date();
    var dia = hoy.getDate();
    var mes = hoy.getMonth() - 1;
    var anio = hoy.getFullYear();
    this.filtro.FechaInicio = new Date(`${anio},${mes},${dia}`);
    this.fechaModificacion = new Date();
  }

  editarVerRegistro(dto: any) {
    console.log("Liquidacion Reg iniciarComponente", dto);
    this.filtro = { ...dto };
    this.listaLiquidacionDetalle(this.filtro);
    this.filtro.FechaInicio = new Date(dto.FechaInicio);
    this.filtro.ClasificadorMovimiento = dto.ClasificadorMovimiento.trim();
    this.filtro.TipoExpediente = dto.TipoExpediente;
    this.filtro.Estado = dto.Estado;
    if (!this.esFechaVacia(dto.FechaAprobacion)) {
      this.filtro.FechaAprobacion = new Date(dto.FechaAprobacion);
    }
    if (!this.esFechaVacia(dto.FechaFinal)) {
      this.filtro.FechaFinal = new Date(dto.FechaFinal);
    }
    if (!this.estaVacio(dto.UsuarioCreacion)) {
      if (this.getUsuarioAuth().data[0].Usuario.trim() == dto.UsuarioCreacion.trim()) {
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
      }
    }
    if (!this.estaVacio(dto.UsuarioModificacion)) {
      if (this.getUsuarioAuth().data[0].Usuario.trim() == dto.UsuarioModificacion.trim()) {
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
      }
    }

    if (!this.esFechaVacia(dto.FechaCreacion)) {
      this.fechaCreacion = new Date(dto.FechaCreacion);
    }
    // undefined
    if (!this.esFechaVacia(dto.fechaModificacion)) {
      this.fechaModificacion = dto.fechaModificacion;
    } else {
      this.fechaModificacion = new Date();
    }
  }

  cargarAcciones(accion: string, titulo) {
    this.acciones = `Generar ${titulo}: ${accion}`;
    this.dialog = true;
    this.puedeEditar = false;
    this.fechaCreacion = new Date();
    this.fechaModificacion = undefined;
    this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
  }

  listaLiquidacionDetalle(dto: dtoExpediente) {
    this.lstExpedienteDetalle = [];
    this.dtodet = new dtoExpedienteDetalle();
    this.dtodet.IdExpediente = dto.IdExpediente;
    return this.liquidacionService.ListarExpedienteDetalle(this.dtodet).then(resp => {
      if (resp.length > 0) {
        resp.forEach((element) => {
          element.num = resp.length--;
        });
        this.lstExpedienteDetalle = resp;
        console.log("lIquidacion listaLiquidacionDetalle", resp);
      }
    });
  }


  keydownBuscar(evento): void {
    if (evento.key == "Enter" || evento.key == "Tab") {
      this.bloquearPag = true;
      if (this.filtro.Documento == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
        this.bloquearPag = false;
      } else if (this.filtro.Documento.trim().length == 11 || this.filtro.Documento == "0") {
        let dto = {
          Documento: this.filtro.Documento.trim(),
          tipopersona: "J",
          TipoDocumento: "R",
          Estado: "A"
        }
        this.personaService.listarpaginado(dto).then((res) => {
          console.log("enter empresa", res)
          if (res.length > 0) {
            this.filtro.NombreCompleto = res[0].NombreCompleto;
            this.filtro.IdClienteFacturacion = res[0].Persona;
            // this.editarCampoEmpresa = true;
            this.ListarTipoPaciente(this.filtro.IdClienteFacturacion);
            this.selectedItemSede(this.filtro.IdClienteFacturacion);
            this.bloquearPag = false;

          } else {
            this.bloquearPag = false;
            this.filtro.Documento = null;
            this.filtro.NombreCompleto = null;
            this.lstContrato = [];
            this.lstTipoPaciente = [];
            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
          }
        });
      }
      else {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
        this.bloquearPag = false;
        this.filtro.Documento = null;
        this.filtro.NombreCompleto = null;
      }
    }
  }



  ListarTipoPaciente(evento): void {
    console.log("Liqui Reg selectedItemTipoPaciente ::", evento);
    var operacionFiltro = new FiltroTipoOperacion();
    this.Auth = this.getUsuarioAuth();
    var usuario = this.Auth.data;
    operacionFiltro.UneuNegocioId = usuario[0].UneuNegocioId; // preguntar a Jordan
    operacionFiltro.TIPOADMISIONID = this.filtro.TipoAdmisionId;
    operacionFiltro.Persona = evento;
    operacionFiltro.TipEstado = 1;
    this.lstTipoPaciente = [];
    this.lstContrato = [];
    this.lstTipoPaciente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.consultaAdmisionService.ListarTipoOperacionTipoPaciente(operacionFiltro).then(resp => {
      resp.forEach(e => {
        this.lstTipoPaciente.push({ label: e.Descripcion, value: e.TipoPacienteId });
      });
      console.log("Liq Reg selectedItemTipoPaciente", resp);
    });
  }


  listartipooperacion(evento): void {
    var operacionFiltro = new FiltroTipoOperacion();
    this.Auth = this.getUsuarioAuth();
    var usuario = this.Auth.data;
    operacionFiltro.UneuNegocioId = usuario[0].UneuNegocioId; // preguntar a Jordan
    operacionFiltro.TIPOADMISIONID = this.filtro.TipoAdmisionId;
    operacionFiltro.TipoPacienteId = evento;
    operacionFiltro.Persona = this.filtro.IdClienteFacturacion;
    operacionFiltro.TipEstado = 1;
    console.log("Liqui Reg operacionFiltro ::", operacionFiltro);
    this.lstContrato = [];
    this.lstContrato.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.consultaAdmisionService.listarcombotipooperacion(operacionFiltro).then(resp => {
      resp.forEach(e => {
        this.lstContrato.push({ label: e.Descripcion, value: e.TipoOperacionID });
      });
      //   sessionStorage.setItem('LiqEntyOperacion', JSON.stringify(resp));
      console.log("Liqui Reg listartipooperacion ::", resp);
    });
  }

  selectedItemTipoPaciente(evento): void {
    console.log("Liqui Reg selectedItemTipoPaciente ::", evento);
    this.listartipooperacion(evento.value);
  }


  selectedItemContrato(evento): void {
    console.log("Liqui Reg selectedItemContrato ::", evento.value);
    this.filtro.IdContrato = evento.value;
    console.log("Liqui Reg this.filtro ::", this.filtro);
  }


  selectedItemSede(evento): void {
    console.log("Liqui Reg selectedItemSede ::", evento);
    var operacionFiltro = new FiltroTipoOperacion();
    this.Auth = this.getUsuarioAuth();
    var usuario = this.Auth.data;
    operacionFiltro.UneuNegocioId = usuario[0].UneuNegocioId; // preguntar a Jordan
    operacionFiltro.TIPOADMISIONID = this.filtro.TipoAdmisionId;
    operacionFiltro.Persona = evento;
    operacionFiltro.TipEstado = 1;
    this.lstSede = [];
    this.lstSede.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.consultaAdmisionService.ListarTipoOperacionSede(operacionFiltro).then(resp => {
      resp.forEach(e => {
        this.lstSede.push({ label: e.SedDescripcion, value: e.IdSede });
      });
      console.log("Liq Reg selectedItemSede", resp);
    });
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  coreGuardar(): void {
    this.bloquearPag = true;
    this.dto.cabecera = this.filtro;
    this.dto.cabecera.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
    this.dto.cabecera.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
    this.dto.cabecera.FechaFinal = new Date();
    if (this.esNumeroVacio(this.filtro.IdContrato)) {
      this.messageShow('warn', 'Advertencia', "Debe Seleccionar el Contrato");
      this.bloquearPag = false;
      return;
    }

    console.log("Liq Reg coreGuardar ::", this.dto);
    Swal.fire({
      icon: 'warning',
      title: '¡Mensaje!',
      text: 'Registro sin correo. ¿Desea continuar?',
      showCancelButton: true,
      confirmButtonColor: '#094d74',
      cancelButtonColor: '#ffc72f',
      cancelButtonText: 'No, volver al registro',
      confirmButtonText: 'Sí, guardar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.messageShow('success', 'Success', this.getMensajeGuardado());
        console.log("Cobranza Reg coreGuardar ::", this.dto);
        this.ServicioRegistrar();
      } else {
        this.verLiquidacion = true;
      }
    })
    this.bloquearPag = false;

  }

  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }

  ServicioRegistrar() {

    this.liquidacionService.MantenimientoExpediente(1, this.dto, this.getUsuarioToken()).then(
      res => {
        console.log("res guardado:", res);
        if (res.success) {
          this.makeToast(this.getMensajeGrabado(this.dto.cabecera.CodigoExpediente));
          this.verLiquidacion = false;
          console.log("entro:", this.mensajeController.resultado)
          this.mensajeController.resultado = res;
          console.log("res enviando:", res);
          this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
        }
        else {
          this.verLiquidacion = false;
          var mensajito;
          var confirmar;
          var cerrar;
          var validar = 0
          if (this.estaVacio(res.mensaje)) {
            mensajito = 'El token a expirado.'
            confirmar = 'Continuar con el registro'
            cerrar = 'Cerrar sesión'
            validar = 1
          } else {
            mensajito = res.mensaje;
            confirmar = 'Volver al registro'
            cerrar = 'Cerrar'
            validar = 2
          }
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            text: mensajito,
            showCancelButton: true,
            confirmButtonColor: '#094d74',
            cancelButtonColor: '#ffc72f',
            cancelButtonText: cerrar,
            confirmButtonText: confirmar
          }).then((result) => {
            if (result.isConfirmed) {
              this.verLiquidacion = true;
              if (validar == 1) {
                this.nuevoToken(this.loginService)
              }
            } else {
              if (validar == 1) {
                sessionStorage.removeItem('access_user')
                sessionStorage.removeItem('access_user_token')
                sessionStorage.removeItem('access_menu')
                // this.router.navigate(['/auth/login']); 
              }

            }
          })
        }
      }).catch(error => error);
  }

}
