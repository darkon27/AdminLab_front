import { Component, OnInit, ViewChild } from "@angular/core";
import { SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { filtroProduccion } from "../model/filtro.produccion";
import { MensajeController } from "../../../../../util/MensajeController";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { TipoAdmisionService } from "../../../maestros/TipoAdmision/services/TipoAdmision.services";
import { convertDateStringsToDates } from "../../../framework/funciones/dateutils";
import { ConsultaAdmisionService } from "../../../admision/consulta/servicio/consulta-admision.service";
import { FiltroTipoOperacion } from "../../../admision/consulta/dominio/filtro/FiltroConsultaAdmision";
import { ExamenService } from "../../../framework-comun/Examen/servicio/Examen.service";
import { FiltroServicio } from "../../../framework-comun/Examen/dominio/filtro/FiltroExamen";
import { EmpresaBuscarComponent } from "../../../framework-comun/Empresa/view/empresa-buscar.component";
import { PersonaBuscarComponent } from "../../../framework-comun/Persona/components/persona-buscar.component";
import { AseguradoraBuscarComponent } from "../../../framework-comun/Aseguradora/components/aseguradora-buscar.component";

@Component({
  selector: 'ngx-produccion-mantenimiento',
  templateUrl: './produccion-mantenimiento.component.html',
  styleUrls: ['./produccion-mantenimiento.component.scss']
})
export class ProduccionMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {

  @ViewChild(EmpresaBuscarComponent, { static: false }) empresaBuscarComponent: EmpresaBuscarComponent;
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  @ViewChild(AseguradoraBuscarComponent, { static: false }) aseguradoraBuscarComponent: AseguradoraBuscarComponent;


  // Listas de combos
  lstAdmision: SelectItem[] = [];
  lstClasificadorNegocio: SelectItem[] = [];
  lstCliente: SelectItem[] = [];
  lstTipoPaciente: SelectItem[] = [];
  lstSede: SelectItem[] = [];
  lstTipoAtencion: SelectItem[] = [];
  lstCLasificacion: SelectItem[] = [];
  lstEstado: SelectItem[] = [];
  lstPeriodo: SelectItem[] = [];

  //Datos persona Sesion
  usuarioSesion: any;
  acciones: string = ''
  position: string = 'top'

  //Objetos de formulario
  produccionForm: any = {};

  constructor(
    private _TipoAdmisionService: TipoAdmisionService,
    private examenService: ExamenService,
    private _ConsultaAdmisionService: ConsultaAdmisionService,
  ) { super(); }

  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }

  /**
    * ***Geampier Santamaría**
    *      LISTO IMPLEMENTAR:
    *        - YA SE PUEDE IMPLEMENTAR LA CREACION ( LOS 3 TIPOS DE CORTE )
    *        - ¿UTILIZAR RXJS?
    *        - ¿USAR FORMGROUP?
    */

  coreIniciarComponentemantenimiento(mensaje: MensajeController, accionform: string, titulo: string, page: number, data?: any): void {

    this.dialog = true;
    this.acciones = `Corte de Producción: ${titulo}`;
    this.cargarCombos();
    this.CrearFormularioProduccion();
    switch (accionform) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.nuevoRegistro(); break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        this.editarRegistro(); break;
      default: this.nuevoRegistro(); break;
    }
  }

  CrearFormularioProduccion() {
    this.produccionForm = {
      periodo: '',
      fechaInicial: new Date(),
      fechaFinal: new Date(),

      tipoAdmision: null,
      clasificadorNegocio: null,
      documentoCliente: '',
      nombresCliente: '',

      tipoPaciente: null,
      sede: null,
      tipoAtencion: null,
      paciente: '',
      aseguradora: '',
      empresa: '',
      clasificador: null,
      codigoExamen: 0,
      examen: '',
      estado: null
    }
  }

  cargarCombos() {
    this.obtenerDatosusuario();

    this.ListarTipoAdmision();
    this.ListarClasificadorNegocio();
    this.listarTipoPaciente();
    this.listarSedes();
    this.listaComboEstado();
    this.listarTipoAtencion();
  }

  private obtenerDatosusuario() {
    const listaComboliente: any = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('access_user')));

    if (listaComboliente?.data?.length > 0) {
      this.usuarioSesion = listaComboliente.data[0];
    }
  }
  private ListarTipoAdmision() {
    this.lstAdmision = [];
    const objtipoAdmision = { Estado: 1 };
    this.lstAdmision.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this._TipoAdmisionService.ListaTipoAdmision(objtipoAdmision).then((lista) => {
      this.lstAdmision = [...this.lstAdmision, ...lista.map((item) => { return { label: item.AdmDescripcion, value: item.TipoAdmisionId } })]
    });
  }
  private ListarClasificadorNegocio() {
    this.lstClasificadorNegocio = [];
    const objFiltro: FiltroServicio = new FiltroServicio();
    objFiltro.Estado = 1;

    this.lstClasificadorNegocio.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.examenService.serviciopaginado(objFiltro).then((lista) => {
      //console.log(lista)
      this.lstClasificadorNegocio = [...this.lstClasificadorNegocio, ...lista.map((item) => { return { label: item.Nombre.toLocaleUpperCase(), value: item.ClasificadorMovimiento } })]
    });
  }
  private listarTipoPaciente() {
    this.lstTipoPaciente = [];
    const filtroData: FiltroTipoOperacion = {
      TipEstado: 1,
      TIPOADMISIONID: 3,
      // Persona: this.usuarioSesion.Persona,
      // IdSede: this.usuarioSesion.Persona,
    };


    this.lstTipoPaciente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this._ConsultaAdmisionService.listarcombotipooperacion(filtroData).then((lista) => {
      //console.log("lista", lista)
      //console.log("filtroData", filtroData)
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
  private listaComboEstado() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    const lstEstados: any[] = this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTLIQ")
    this.lstEstado = [...this.lstEstado, ...lstEstados.map((item) => { return { label: item.Nombre.toLocaleUpperCase(), value: item.Codigo } })]
  }

  private listarTipoAtencion() {
    this.lstTipoAtencion = [];
    this.lstTipoAtencion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    const lstEstados: any[] = this.getMiscelaneos()?.filter(x => x.CodigoTabla == "TIPOATENCION")
    this.lstTipoAtencion = [...this.lstTipoAtencion, ...lstEstados.map((item) => { return { label: item.Nombre.toLocaleUpperCase(), value: item.IdCodigo } })]
  }


  verSelectorEmpresa(): void {
    this.empresaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECTEMPRESA', 'BUSCAR'), 'BUSCAR');
  }

  coreLimpiar(): void {
    this.produccionForm.codigoClienteEmpresa = '';
    this.produccionForm.documentoCliente = '';
    this.produccionForm.nombreSCliente = '';
  }

  nuevoRegistro() { }

  editarRegistro() {
  }

  coreMensaje(mensage: MensajeController): void {
    const dataDevuelta = mensage.resultado;
    switch (mensage.componente.toUpperCase()) {
      case 'SELECTEMPRESA':
        this.obtenerClienteEmpresa(dataDevuelta); return;
      case 'SELECPACIENTE':
        this.obtenerPaciente(dataDevuelta); return;
      case 'SELECASEGURADORA':
        this.obtenerAseguradora(dataDevuelta); return;
      default:
        break;
    }

  }

  obtenerClienteEmpresa(data: any): void {

    if (data != null || data != undefined) {
      this.produccionForm.codigoClienteEmpresa = data.Persona;
      this.produccionForm.documentoCliente = data.Documento.trim();
      this.produccionForm.nombreSCliente = data.NombreCompleto;
    }
  }

  obtenerPaciente(data: any): void {

    if (data != null || data != undefined) {
      this.produccionForm.IdPaciente = data.Persona;
      this.produccionForm.documentoPaciente = data.Documento.trim();
      this.produccionForm.nombreSPaciente = data.NombreCompleto;
    }
  }

  obtenerAseguradora(data: any): void {
    if (data != null || data != undefined) {
      this.produccionForm.IdAseguradora = data.IdAseguradora;
      this.produccionForm.nombreSAseguradora = data.NombreEmpresa;
    }
  }

  verSelectorPaciente(): void {

    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECPACIENTE', 'BUSCAR'), 'BUSCAR', 'N');
  }

  coreLimpiarPaciente(): void {
    this.produccionForm.IdPaciente = '';
    this.produccionForm.documentoPaciente = '';
    this.produccionForm.nombreSPaciente = '';
  }

  verSelectorAseguradora(): void {

    this.aseguradoraBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECASEGURADORA', 'BUSCAR'), 'BUSCAR');
  }

  coreLimpiarAseguradora(): void {
    this.produccionForm.IdAseguradora = '';
    this.produccionForm.nombreSAseguradora = '';
  }
  
}
