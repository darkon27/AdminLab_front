import { Component, OnChanges, SimpleChanges, OnInit, ViewChild, SimpleChange, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ConfirmationService, LazyLoadEvent, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormGroup } from '@angular/forms';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { AseguradoraBuscarComponent } from '../../../framework-comun/Aseguradora/components/aseguradora-buscar.component';
import { AseguradoraService } from '../../../framework-comun/Aseguradora/servicio/aseguradora.service';
import { AseguradoraMantenimientoComponent } from '../../../framework-comun/Aseguradora/vista/aseguradora-mantenimiento.component';
import { ExamenBuscarComponent } from '../../../framework-comun/Examen/components/examen-buscar.component';
import { MedicoBuscarComponent } from '../../../framework-comun/Medico/components/medico-buscar.component';
import { MedicoService } from '../../../framework-comun/Medico/servicio/medico.service';
import { MedicoMantenimientoComponent } from '../../../framework-comun/Medico/vista/medico-mantenimiento.component';
import { PersonaBuscarComponent } from '../../../framework-comun/Persona/components/persona-buscar.component';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { PersonaMantenimientoComponent } from '../../../framework-comun/Persona/vista/persona-mantenimiento.component';
import { convertDateStringsToDates } from '../../../framework/funciones/dateutils';
import { Admision, AdmisionServicio, TraerXAdmisionServicio } from '../../consulta/dominio/dto/DtoConsultaAdmision';
import { FiltroCliente, FiltroListarXAdmision, FiltroTipoOperacion } from '../../consulta/dominio/filtro/FiltroConsultaAdmision';
import { ConsultaAdmisionService } from '../../consulta/servicio/consulta-admision.service';
import { DtoAdmisionprueba, DtoPacienteClinica } from '../dominio/dto/DtoPacienteClinica';
import { Router } from '@angular/router';
import { FiltroPacienteClinica } from '../dominio/filtro/FiltroPacienteClinica';
import { PacienteClinicaBuscarOAComponent } from './components/paciente-clinica-buscarOA.component';
import { PacienteClinicaBuscarPacienteComponent } from './components/paciente-clinica-buscarPaciente.component';
import { PacienteClinicaBuscarPruebaComponent } from './components/paciente-clinica-buscarPrueba.component';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { dtoPersona } from '../../../framework-comun/Persona/dominio/dto/dtoPersona';
import { PacienteClinicaService } from '../service/paciente-clinica.service';
import { EmpresaBuscarComponent } from '../../../framework-comun/Empresa/view/empresa-buscar.component';
import { ExamenService } from '../../../framework-comun/Examen/servicio/Examen.service';
import { FiltroExamen, FiltroServicio } from '../../../framework-comun/Examen/dominio/filtro/FiltroExamen';
import { NbToastrService, NB_THEME_OPTIONS } from '@nebular/theme';
import { DtoAdmisionclinicaDetalle } from '../dominio/dto/DtoAdmisionclinicaDetalle';
import { AppConfig } from '../../../../../environments/app.config';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';


@Component({
  selector: 'ngx-paciente-clinica',
  templateUrl: './paciente-clinica.component.html',
  styleUrls: ['./paciente-clinica.component.scss']
})
export class PacienteClinicaComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy, UIMantenimientoController, OnChanges {

  @ViewChild(PacienteClinicaBuscarOAComponent, { static: false }) buscarOAComponent: PacienteClinicaBuscarOAComponent;
  @ViewChild(PacienteClinicaBuscarPacienteComponent, { static: false }) buscarPacienteComponent: PacienteClinicaBuscarPacienteComponent;
  @ViewChild(PacienteClinicaBuscarPruebaComponent, { static: false }) buscarPruebaComponent: PacienteClinicaBuscarPruebaComponent;
  @ViewChild(AseguradoraMantenimientoComponent, { static: false }) aseguradoraMantenimientoComponent: AseguradoraMantenimientoComponent;
  @ViewChild(MedicoMantenimientoComponent, { static: false }) medicoMantenimientoComponent: MedicoMantenimientoComponent;
  @ViewChild(PersonaMantenimientoComponent, { static: false }) personaMantenimientoComponent: PersonaMantenimientoComponent;
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  @ViewChild(EmpresaBuscarComponent, { static: false }) empresaBuscarComponent: EmpresaBuscarComponent;
  @ViewChild(AseguradoraBuscarComponent, { static: false }) aseguradoraBuscarComponent: AseguradoraBuscarComponent;
  @ViewChild(MedicoBuscarComponent, { static: false }) medicoBuscarComponent: MedicoBuscarComponent;
  @ViewChild(ExamenBuscarComponent, { static: false }) examenBuscarComponent: ExamenBuscarComponent;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  @ViewChild('pdfViewerActividades', { static: false }) pdfViewerActividades;

  colCard1: string = "col-sm-5";
  colCard2: string = "col-sm-4";

  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  EstadoPersona: string;
  segundos: number = 30;
  IdTimer: any;

  seleccionarItemPacienteTemp: any;
  seleccionarItemServicioTemp: any;
  seleccionarItemMedicoTemp: any;
  itemServicioPasado: string = "01";

  loading: boolean;
  bloquearPag: boolean;
  contarExamenes: number = 15;

  verReporteModal: boolean = false;

  valorseleccionadocombo: number;
  modeloSevicioId: number = 0;
  verBtnAnular: boolean = false;
  disableBtnGuardar: boolean;

  Auth: UsuarioAuth = new UsuarioAuth();
  examen: FiltroExamen = new FiltroExamen();
  contado: number = 1;
  total: number = 0;
  cliente: FiltroCliente = new FiltroCliente();
  operacion: FiltroTipoOperacion = new FiltroTipoOperacion();
  servicio: FiltroServicio = new FiltroServicio();
  xadmision: FiltroListarXAdmision = new FiltroListarXAdmision;
  formularioOninit: boolean = true;
  editarCampos: boolean = true;
  editarDetallePrueba: boolean = true;
  editarDetallePrueba_check: boolean = true;
  editarCamposAutomaticos: boolean = true;
  editarCampoNroCama: boolean = true;
  editarCampoOA: boolean = true;
  editarCampoMedico: boolean = true;
  editarCampoAseguradora: boolean = true;
  editarCampoEmpresa: boolean = true;
  editarCampoDocumento: boolean = false;
  editarCampoSevicio: boolean = true;

  dtofinal: DtoAdmisionprueba = new DtoAdmisionprueba();
  tipo: any;
  lstSexo: SelectItem[] = [];
  lstprocedencia: SelectItem[] = [];
  lstTipoOrden: SelectItem[] = [];
  lstTipoAtencion: SelectItem[] = [];
  lstServicio: SelectItem[] = [];
  lstcliente: SelectItem[] = [];
  lstTipoOperacion: SelectItem[] = [];
  valorTipoPacienteId: any;
  valorCliente: any;
  bscPersona: dtoPersona = new dtoPersona();
  lstexamen: SelectItem[] = [];
  EnterExamen: SelectItem[] = [];
  MultEditPersona: SelectItem[] = [];
  lstSedeEmpresa: SelectItem[] = [];
  lstAnularAdmisionDetalle: DtoPacienteClinica[] = [];
  // lstListarXAdmision: any[] = [];
  selectedTipoPaciente = "";
  //grillas
  lstListarXAdmision: DtoPacienteClinica[] = [];
  admision: DtoPacienteClinica;
  //Formulario Reactivo
  public validarAdmision: FormGroup;

  tempfiltro: any;
  registroSeleccionado: any;
  lastYearTotal: number = 0;
  editarCantidad: boolean = true;
  //client: Client;s
  filtro: FiltroPacienteClinica = new FiltroPacienteClinica();
  filtro2: FiltroPacienteClinica = new FiltroPacienteClinica();
  adm: Admision = new Admision();
  lst: AdmisionServicio = new AdmisionServicio();
  ind: TraerXAdmisionServicio = new TraerXAdmisionServicio();
  IdConsentimiento: number = 0;
  cantidad: number = 0;

  titulo: string;

  constructor(
    public router: Router,
    public confirmationService: ConfirmationService,
    private examenService: ExamenService,
    private consultaAdmisionService: ConsultaAdmisionService,
    private pacienteClinicaService: PacienteClinicaService,
    protected messageService: MessageService,
    private personaService: PersonaService,
    private aseguradoraService: AseguradoraService,
    private medicoService: MedicoService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    public config: AppConfig

  ) {
    super(
    );
  }

  ngOnDestroy(): void {
    // this.userInactive.unsubscribe();
  }

  coreBuscar(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    this.iniciarComponent();
    const p1 = this.comboComboSexo();
    this.comboCargarProcendia();
    const p3 = this.comboComboTipoOrden();
    const p4 = this.comboCargarServicios();
    const p5 = this.comboCargarTipoAtencion();
    console.log("Clinica selec comboCargarTipoAtencion", p5);
    const p6 = this.comboCargarCliente();
    console.log("selec comboCargarCliente", p6);
    const p7 = this.comboCargarTipoOperacion();
    console.log("Clinica selec comboCargarTipoOperacion", p7);
    // this.titulo = '';
    Promise.all([p1, p3, p4, p5, p6, p7]).then(resp => {
      var condicion = this.route.snapshot.url.length;
      if (condicion > 2) {
        this.tempfiltro = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
        if (this.tempfiltro) {
          console.log("Clinica ngOnInit Ingreso EditarAdmision", this.tempfiltro);
          this.EditarAdmision(this.tempfiltro);
          this.auditoria(this.tempfiltro, 2);
          this.admision = this.tempfiltro;

          /**BLOQUEAR CAMPO DE BUSQUEDA DE DETALLE DE PRUEBA AL EDITAR UNA OA */
          if (this.tempfiltro.Estado == 2) {
            this.editarDetallePrueba = true;
            this.editarDetallePrueba_check = false;
          }
          /**FIN */
        }
      } else {
        this.auditoria("NUEVO", 1);
      }
      this.filtro = this.formularioFiltrosRestaurar(this.filtro);
      console.log("Clinica Termino ngOnInit", this.filtro);
      this.bloquearPag = false;
    });
  }

  auditoria(filtro?: any, validar?: number) {
    if (validar == 1) {
      this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;
      this.fechaCreacion = new Date();
      this.fechaModificacion = new Date();
    }
    else {
      this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;
      this.fechaCreacion = new Date();
      this.fechaModificacion = new Date();
      console.log("mostrar auditoria comparacion", this.getUsuarioAuth().data[0].Usuario, filtro.UsuarioCreacion, filtro.UsuarioModificacion)
      if (this.estaVacio(filtro.UsuarioModificacion)) {
        console.log("UsuarioModificacion Vacío")
        if (filtro.UsuarioCreacion == this.getUsuarioAuth().data[0].Usuario) {
          console.log("UsuarioCreacion Igual a UsuarioLogeado")
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;
          this.fechaCreacion = new Date(filtro.FechaCreacion);
          if (this.esFechaVacia(filtro.FechaModificacion)) {
            this.fechaModificacion = new Date();
          } else {
            this.fechaModificacion = new Date(filtro.FechaModificacion);
          }
        } else {
          console.log("Traer Usuario Creado Nuevo")
          let dto = {
            Documento: filtro.UsuarioCreacion.trim(),
            tipopersona: "USU",
            SoloBeneficiarios: "-1",
            UneuNegocioId: "-1"
          }
          return this.personaService.listaPersonaUsuario(dto).then((res) => {
            this.usuario = res[0].NombreCompleto;
            this.fechaCreacion = new Date(filtro.FechaCreacion);
            if (this.esFechaVacia(filtro.FechaModificacion)) {
              this.fechaModificacion = new Date();
            } else {
              this.fechaModificacion = new Date(filtro.FechaModificacion);
            }
            console.log("mostrar auditoria", this.usuario, this.fechaCreacion, this.fechaModificacion)
          })
        }
      } else {
        console.log("Usuario Modificado Lleno", this.getUsuarioAuth().data[0].Usuario, this.getUsuarioAuth().data[0].NombreCompleto)
        if (filtro.UsuarioModificacion == this.getUsuarioAuth().data[0].Usuario) {
          console.log("Usuario Modificado Igual a Usuario Logeado")
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;
          this.fechaCreacion = new Date(filtro.FechaCreacion);
          if (this.esFechaVacia(filtro.FechaModificacion)) {
            this.fechaModificacion = new Date();
          } else {
            this.fechaModificacion = new Date(filtro.FechaModificacion);
          }
        } else {
          console.log("Traer Usuario Modificado Nuevo")
          console.log("Usuario Modificado Lleno", this.getUsuarioAuth().data[0].Usuario, this.getUsuarioAuth().data[0].NombreCompleto)
          let dto = {
            Documento: filtro.UsuarioModificacion.trim(),
            tipopersona: "ID",
            SoloBeneficiarios: "-1",
            UneuNegocioId: "-1"
          }
          return this.personaService.listaPersonaUsuario(dto).then((res) => {
            this.usuario = res[0].NombreCompleto;
            this.fechaCreacion = new Date(filtro.FechaCreacion);
            if (this.esFechaVacia(filtro.FechaModificacion)) {
              this.fechaModificacion = new Date();
            } else {
              this.fechaModificacion = new Date(filtro.FechaModificacion);
            }
            console.log("mostrar auditoria", this.usuario, this.fechaCreacion, this.fechaModificacion)
          })
        }
      }

    }
  }


  listadoHistoriaClinica(persona: number) {
    var filtro = new FiltroPacienteClinica();
    filtro.persona = persona;
    filtro.IdSede = this.getUsuarioAuth().data[0].IdSede;
    return this.personaService.listadoSedeHistoria(filtro).then((res) => {
      console.log("historia clinica res", res);
      this.filtro.CodigoHC = res[0].CodigoHC;
    }).catch(error => error);
  }

  //aqui coreMensaje
  async coreMensaje(mensage: MensajeController) {
    if (mensage.componente == "SELECPACIENTE") {
      console.log("seleccionar paciente", mensage.resultado);
      this.bscPersona = mensage.resultado;
      this.listadoHistoriaClinica(mensage.resultado.Persona);
      this.listarConsentimientoXdocumento(mensage.resultado.Documento);
      this.filtro.Documento = mensage.resultado.Documento;
      if (this.estaVacio(mensage.resultado.NombreCompleto)) {
        this.filtro.NombreCompleto = `${mensage.resultado.Nombres}, ${mensage.resultado.ApellidoPaterno} ${mensage.resultado.ApellidoMaterno}`;
      } else {
        this.filtro.NombreCompleto = mensage.resultado.NombreCompleto;
      }
      //datos extras para el guardar OA
      this.filtro.Persona = mensage.resultado.Persona;
      this.filtro.Nombres = mensage.resultado.Nombres;

      //*SE AGREGA LA VALIDACION DE ESTADO PERSONA */
      this.EstadoPersona = mensage.resultado.Estado;

      this.filtro.ApellidoPaterno = mensage.resultado.ApellidoPaterno;
      this.filtro.ApellidoMaterno = mensage.resultado.ApellidoMaterno;
      this.filtro.TipoDocumento = mensage.resultado.TipoDocumento;
      this.filtro.CorreoElectronico = mensage.resultado.CorreoElectronico;
      this.filtro.Comentario = mensage.resultado.Comentario;
      this.filtro.Sexo = mensage.resultado.Sexo;
      this.filtro.CodigoHC = mensage.resultado.CodigoHC;
      this.filtro.Telefono = mensage.resultado.Telefono;
      // this.filtro.Edad = mensage.resultado.Edad;
      this.filtro.FechaNacimiento = new Date(mensage.resultado.FechaNacimiento);
      this.CalcularAnios();
      this.editarCampos = false;
      this.editarDetallePrueba = false;
      this.editarDetallePrueba_check = false;
      this.editarCampoOA = false;
      this.editarCampoSevicio = false;
      this.editarCamposAutomaticos = true;
      this.editarCampoNroCama = true;
      this.editarCampoDocumento = true;
      this.editarCampoEmpresa = false;
      this.editarCampoAseguradora = false;
      this.editarCampoMedico = false;
      this.disableBtnGuardar = true;
    }
    else if (mensage.componente == "SELECEMPRESA") {
      if (!this.estaVacio(mensage.resultado.DocumentoFiscal)) {
        this.filtro2.DocumentoFiscal = mensage.resultado.DocumentoFiscal;
      } else {
        this.filtro2.DocumentoFiscal = mensage.resultado.Documento;
      }
      this.filtro2.NombreCompleto = mensage.resultado.NombreCompleto;
      this.filtro2.Persona = mensage.resultado.Persona;
      this.lstSedeEmpresa = [];
      this.comboCargarSedeEmpresa(mensage.resultado.Persona);
      this.editarCampoEmpresa = true;
      console.log("selec empresa", mensage.resultado);
    }
    else if (mensage.componente == "SELECASEGURADORA") {
      this.filtro.IdAseguradora = mensage.resultado.IdAseguradora;
      this.filtro.NombreEmpresa = mensage.resultado.NombreEmpresa;
      this.editarCampoAseguradora = true;
      console.log("selec aseguradora", mensage.resultado);
    }
    else if (mensage.componente == "SELECMEDICO") {
      this.filtro.CMP = mensage.resultado.CMP;
      this.filtro.Busqueda = mensage.resultado.Busqueda;
      this.filtro.IdEspecialidad = mensage.resultado.IdEspecialidad;
      this.filtro.MedicoId = mensage.resultado.MedicoId;
      this.editarCampoMedico = true;
    }
    else if (mensage.componente == "BUSCEXAM") {
      if (this.filtro.NombreCompleto != null) {


        /**SE MODIFICO EL RECORRIDO PARA CALCULAR */

        this.loading = true;
        for (let examenParaAgregar of mensage.resultado) {
          for (let examenEnDetalle of this.lstListarXAdmision) {
            if (examenParaAgregar.CodigoComponente == examenEnDetalle.CodigoComponente) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Existen Campos repetidos', life: 3000 })
              this.loading = false;
              return;
            }
          }
          console.log("BUSCEXAM  Sexo", mensage.resultado);
          if (examenParaAgregar.Sexo != "A") {
            if (examenParaAgregar.Sexo != this.filtro.Sexo) {
              Swal.fire({
                icon: 'warning',
                title: '¡Mensaje!',
                text: 'El Paciente es de sexo distinto al del examen'
              });
              //  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El Paciente es de sexo distinto al del examen', life: 3000 })
              this.loading = false;
            }
          }

          /*           if (examenParaAgregar.Sexo != this.filtro.Sexo) {
                      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El Paciente es de sexo distinto al del examen', life: 3000 })
                      this.loading = false;
                    } */

          this.lstListarXAdmision.push({ ...examenParaAgregar });
        }
        this.lstListarXAdmision = [...this.lstListarXAdmision];
        await this.calculoDePruebasIgv();
        this.loading = false;
        this.seleccionarItemPacienteTemp = this.filtro.TipoOperacionID;
        this.seleccionarItemServicioTemp = this.filtro.ClasificadorMovimiento;
        // this.admision.TipoOperacionId = this.filtro.TipoOperacionID;
      } else {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: 'Seleccione un paciente.'
        })
      }

    }
    else if (mensage.componente == 'BUSCOA') {
      console.log("DATA ADMISION VIAJANDO DE BUSCOA ", mensage.resultado.Admision);
      if (mensage.resultado == "1") {
        this.btnNuevo();
      }
      else if (mensage.resultado.Admision != null) {
        this.auditoria(mensage.resultado.Admision, 2);
        this.selectedItemTipoAtencion(mensage.resultado.Admision.TipoAtencion)
        console.log("TIPO ATENCION", mensage.resultado.Admision.TipoAtencion);

        this.editarCampos = false;
        this.editarDetallePrueba = false;
        this.editarDetallePrueba_check = false;
        this.editarCampoOA = true;
        this.editarCampoSevicio = false;
        this.editarCamposAutomaticos = true;
        this.editarCampoNroCama = true;
        this.editarCampoMedico = true;
        this.editarCampoAseguradora = true;
        this.editarCampoEmpresa = true;
        this.editarCampoDocumento = true;
        this.disableBtnGuardar = true;
        this.filtro.Documento = mensage.resultado.Admision.Documento;
        this.filtro.TipoDocumento = mensage.resultado.Admision.TipoDocumento;


        this.filtro.FechaNacimiento = new Date(mensage.resultado.Admision.fechanacimiento);
        this.filtro.Sexo = mensage.resultado.Admision.sexo;
        this.CalcularAnios();
        this.filtro.ObservacionAlta = mensage.resultado.Admision.ObservacionAlta;
        this.filtro.CodigoHC = mensage.resultado.Admision.HistoriaClinica;
        this.filtro.CorreoElectronico = mensage.resultado.Admision.CorreoElectronico;
        this.filtro.NroPeticion = mensage.resultado.Admision.NroPeticion;
        this.filtro.OrdenAtencion = mensage.resultado.Admision.OrdenAtencion;
        this.filtro.CMP = mensage.resultado.Admision.CMP;
        if (!this.esNumeroVacio(mensage.resultado.Admision.IdEspecialidad)) {
          this.filtro.IdEspecialidad = mensage.resultado.Admision.IdEspecialidad;
        }


        var valoesexo = 0;
        for (let examenParaAgregar of mensage.resultado.list_AdmisionServicio) {
          if (examenParaAgregar.Sexo != "A") {
            if (examenParaAgregar.Sexo != this.filtro.Sexo) {
              console.log("es de sexo distinto", examenParaAgregar.Sexo);
              console.log("es de sexo distinto", this.filtro.Sexo);
              valoesexo = 1;
              break;
            }
          }
        }
        if (valoesexo == 1) {

          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            confirmButtonColor: '#094d74',
            text: 'El Paciente es de sexo distinto al del examen'
          }).then((result) => {
            if (result.isConfirmed) {
              this.listarConsentimientoXdocumento(mensage.resultado.Admision.Documento);
            } else {
              this.listarConsentimientoXdocumento(mensage.resultado.Admision.Documento);
            }
          })
          this.loading = false;
        } else {
          this.listarConsentimientoXdocumento(mensage.resultado.Admision.Documento);
        }

        this.guardarOAmedico(mensage.resultado.Admision.MedicoId);
        this.guardarOAaseguradora(mensage.resultado.Admision.IdAseguradora);
        if (!this.esNumeroVacio(mensage.resultado.Admision.IdEmpresaPaciente)) {
          this.guardarOAempresa(mensage.resultado.Admision.IdEmpresaPaciente);
          this.lstSedeEmpresa = [];
          this.comboCargarSedeEmpresa(mensage.resultado.Admision.IdEmpresaPaciente);

        }
        //no borrar, desaparece persona y no permitira anular. acuerdate
        this.guardarOAPersona(mensage.resultado.Admision.Persona);
        //this.filtro.TipoOrden = mensage.resultado.Admision.TipoOrden;
        this.filtro.ClasificadorMovimiento = mensage.resultado.Admision.ClasificadorMovimiento;
        this.filtro.TipoAtencion = mensage.resultado.Admision.TipoAtencion;
        if (this.filtro.TipoAtencion == 2) {
          this.editarCampoNroCama = false;
        } else {
          this.editarCampoNroCama = true;
        }
        this.filtro.TipoOperacionID = mensage.resultado.Admision.TipoOperacionId;
        this.admision = mensage.resultado.Admision;

        if (mensage.resultado.list_AdmisionServicio[0].hasOwnProperty("CodigoComponente")) {

          this.contarExamenes = mensage.resultado.list_AdmisionServicio.length;

          this.lstListarXAdmision = [];
          for (let examenParaAgregar of mensage.resultado.list_AdmisionServicio) {

            /**SE SOLICITO QUE LA CANTIDAD DE LAS PRUEBAS SEA 1 CUANDO EL SERVICIO SEA LABORATORIO CLINICO */
            if (mensage.resultado.Admision.ClasificadorMovimiento == '01') {
              examenParaAgregar.Cantidad = 1;
            }

            /**FIN */

            /**SE HACE EL CALCULO POR EL HECHO DE QUE EL VALOR VIENE EN DIFERENTE VARIABLE */
            //examenParaAgregar.numeroXadmision = null; // si son nuevo, resultan estar en undefined
            examenParaAgregar.valorBruto = examenParaAgregar.ValorEmpresa; // se agrega el valor de empresa
            examenParaAgregar.ValorEmpresa = null; // se limpia por seguridad
            let ExamenConIgv = examenParaAgregar.valorBruto * this.getUsuarioAuth().data[0].Igv;
            examenParaAgregar.ValorEmpresa = examenParaAgregar.valorBruto + ExamenConIgv;
            examenParaAgregar.ValorEmpresa = examenParaAgregar.ValorEmpresa * examenParaAgregar.Cantidad;
            this.lstListarXAdmision.push({ ...examenParaAgregar });
          }
          this.lstListarXAdmision = [...this.lstListarXAdmision];
          await this.calculoDePruebasIgv();

          this.verBtnAnular = true;
          this.colCard1 = "col-sm-3";
          this.colCard2 = "col-sm-6";
        }


        //this.bloquearPag = false;
        this.loading = false;
      } else {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: `Registro Seleccionado sin Datos`
        })
      }
    } else if (mensage.componente == 'TIPMAPERSONANUEVO') {
      console.log("TIPMAPERSONANUEVO data llegando:", mensage.resultado);

      this.disableBtnGuardar = true;
      if (mensage.resultado != null) {

        this.filtro.Documento = mensage.resultado.data.Documento
        this.filtro.NombreCompleto = mensage.resultado.data.NombreCompleto
        this.filtro.CorreoElectronico = mensage.resultado.data.CorreoElectronico;
        this.filtro.Comentario = mensage.resultado.data.Comentario;
        this.filtro.Sexo = mensage.resultado.data.Sexo;
        this.filtro.CodigoHC = mensage.resultado.data.CodigoHC;
        this.filtro.FechaNacimiento = new Date(mensage.resultado.data.FechaNacimiento);
        this.CalcularAnios();
        this.filtro.Persona = mensage.resultado.data.Persona;
        this.filtro.TipoDocumento = mensage.resultado.data.TipoDocumento;
        this.filtro.Nombres = mensage.resultado.data.Nombres;
        this.filtro.ApellidoPaterno = mensage.resultado.data.ApellidoPaterno;
        this.filtro.ApellidoMaterno = mensage.resultado.data.ApellidoMaterno;
        this.filtro.Telefono = mensage.resultado.data.Telefono;
        //this.bscPersona = null;
        this.bscPersona = mensage.resultado.data;
        this.editarCampos = false;
        this.editarDetallePrueba = false;
        this.editarDetallePrueba_check = false;
        this.editarCampoOA = false;
        this.editarCampoSevicio = false;
        this.editarCamposAutomaticos = true;
        this.editarCampoNroCama = true;
        this.editarCampoDocumento = true;
        this.editarCampoMedico = false;
        this.editarCampoAseguradora = false;
        this.editarCampoEmpresa = false;

      } else {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: `Registro Seleccionado sin Datos`
        })
      }

    } else if (mensage.componente == 'TIPMAPERSONAEDITAR') {
      console.log("TIPMAPERSONAEDITAR VIAJANDO ", mensage.resultado.data);
      console.log("TIPMAPERSONAEDITAR paciente", this.bscPersona);
      this.MostrarEmpresa(this.bscPersona.Persona, 1);

    } else if (mensage.componente == 'TIPREGMEDICO') {
      console.log("data llegando medico", mensage.componente)
      console.log("data llegando medico", mensage.resultado)
      if (mensage.resultado != null) {
        this.bloquearPag = true;
        this.filtro.CMP = mensage.resultado.data.CMP;
        this.filtro.Busqueda = mensage.resultado.data.Busqueda;
        this.filtro.MedicoId = mensage.resultado.data.MedicoId;
        this.editarCampoMedico = true;
        this.bloquearPag = false;
      }
    } else if (mensage.componente == 'TIPREGASEGURADORA') {
      if (mensage.resultado != null) {
        this.bloquearPag = true;
        this.filtro.IdAseguradora = mensage.resultado.data.IdAseguradora;
        this.filtro.NombreEmpresa = mensage.resultado.data.NombreEmpresa;
        this.editarCampoAseguradora = true;

        this.bloquearPag = false;

      }
    } else if (mensage.componente == 'TIPREGEMPRESA') {
      console.log("data llegando mensaje", mensage.resultado)
      if (mensage.resultado != null) {
        this.bloquearPag = true;
        this.filtro2.DocumentoFiscal = mensage.resultado.data.Documento;
        this.filtro2.NombreCompleto = mensage.resultado.data.NombreCompleto;
        this.filtro2.Persona = mensage.resultado.data.Persona;
        this.editarCampoEmpresa = true;
        // this.editarCampoMedico = true;
        this.bloquearPag = false;
      }
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    // console.log("probando aqui", this.seleccionarItemPaciente)
    // console.log("VALOR ngOnChanges", changes.currentValue)
    // console.log(" aver despues", changes.previousValue)
  }

  selectedItemTipoPaciente(event) {
    this.listaPerfil();
    var listaEntyOperacion = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('EntyOperacion')));
    if (!this.esListaVacia(listaEntyOperacion)) {
      listaEntyOperacion.forEach(e => {
        if (e.TipoOperacionID == event.value) {
          this.IdConsentimiento = e.FlaCon;
          console.log("selectedItemTipoPaciente listaEntyOperacion", e);
        }
      });
    }

    if (this.IdConsentimiento == 1) {
      this.listarConsentimientoXdocumento(this.filtro.Documento);
    }

    if (this.lstListarXAdmision.length > 0) {
      console.log("valor de lcombo despues", this.selectedTipoPaciente)
      this.bloquearPag = true;
      if (this.admision != null) {
        this.dtofinal.Admision.UsuarioCreacion = this.admision.UsuarioCreacion; //derrepente pasando nulo
        this.dtofinal.Admision.Estado = this.admision.Estado;
        this.dtofinal.Admision.FechaCreacion = new Date(this.admision.FechaCreacion);
        this.dtofinal.Admision.IpCreacion = this.admision.IpCreacion;   //crear metodo que nos muestre la IP del usuario
        this.dtofinal.Admision.TipoAtencion = this.admision.TipoAtencion;
        this.dtofinal.Admision.DesEstado = this.admision.DesEstado;
        this.dtofinal.Admision.FechaAdmision = new Date(this.admision.FechaAdmision);
        this.dtofinal.Admision.FlatAprobacion = this.admision.FlatAprobacion;
        this.dtofinal.Admision.TipoAtencion = this.admision.TipoAtencion;
        this.dtofinal.Admision.IdAdmision = this.admision.IdAdmision;
      }
      else {
        this.dtofinal.Admision.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
        this.dtofinal.Admision.FechaCreacion = new Date();
        this.dtofinal.Admision.IpCreacion = this.getIp();
        this.dtofinal.Admision.FechaAdmision = new Date();
      }

      this.dtofinal.Admision.TipoDocumento = this.filtro.TipoDocumento;
      this.dtofinal.Admision.Documento = this.filtro.Documento;
      this.dtofinal.Admision.NombreCompleto = this.filtro.NombreCompleto;
      this.dtofinal.Admision.fechanacimiento = new Date(this.filtro.FechaNacimiento);
      this.dtofinal.Admision.nombres = this.filtro.Nombres;
      this.dtofinal.Admision.apellidopaterno = this.filtro.ApellidoPaterno;
      this.dtofinal.Admision.apellidomaterno = this.filtro.ApellidoMaterno;
      this.dtofinal.Admision.sexo = this.filtro.Sexo;
      this.dtofinal.Admision.CorreoElectronico = this.filtro.CorreoElectronico;
      //admision.IdAdmision; normal registraria sin llamarlo cunado es 1
      this.dtofinal.Admision.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
      this.dtofinal.Admision.TipoOperacionID = this.filtro.TipoOperacionID;
      this.dtofinal.Admision.Persona = this.filtro.Persona; //viene de un metodo persona

      this.dtofinal.Admision.HistoriaClinica = this.filtro.CodigoHC;
      this.dtofinal.Admision.NroPeticion = this.filtro.NroPeticion;
      this.dtofinal.Admision.OrdenAtencion = this.filtro.OrdenAtencion;
      this.dtofinal.Admision.MedicoId = this.filtro.MedicoId;
      this.dtofinal.Admision.IdSede = this.getUsuarioAuth().data[0].IdSede;
      this.dtofinal.Admision.FechaModificacion = new Date();
      this.dtofinal.Admision.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
      this.dtofinal.Admision.IpModificacion = this.getIp();  //crear metodo que nos muestre la IP del usuario
      this.dtofinal.Admision.IdEmpresaPaciente = this.filtro2.Persona;
      this.dtofinal.Admision.IdAseguradora = this.filtro.IdAseguradora;
      this.dtofinal.Admision.TipoOrden = this.filtro.TipoOrden;
      this.dtofinal.Admision.ClasificadorMovimiento = this.filtro.ClasificadorMovimiento;
      this.dtofinal.Admision.IdEspecialidad = this.filtro.IdEspecialidad;
      this.dtofinal.Admision.TIPOADMISIONID = 1; //admision.TIPOADMISIONID;
      console.log("llegando toda cabecera tipo paciente", this.dtofinal.Admision)
      console.log("lista llegando combo", this.lstListarXAdmision)

      this.dtofinal.list_AdmisionServicio = [];
      this.lstListarXAdmision.forEach(element => {
        var dtoAdmClini = new DtoAdmisionclinicaDetalle;
        console.log("valor de dtoadmclini", dtoAdmClini)
        dtoAdmClini.IdAdmServicio = element.IdAdmServicio;
        dtoAdmClini.IdAdmision = element.IdAdmision;
        dtoAdmClini.Linea = element.Linea;
        dtoAdmClini.IdOrdenAtencion = element.IdOrdenAtencion;
        dtoAdmClini.CodigoComponente = element.CodigoComponente;
        dtoAdmClini.Descripcion = element.Descripcion;
        dtoAdmClini.Cantidad = element.Cantidad;
        dtoAdmClini.Valor = element.Valor;
        dtoAdmClini.Estado = element.Estado;
        dtoAdmClini.EstadoAdm = element.EstadoAdm;
        dtoAdmClini.Sexo = element.Sexo;
        dtoAdmClini.ClasificadorMovimiento = element.ClasificadorMovimiento;
        dtoAdmClini.UsuarioCreacion = element.UsuarioCreacion;
        dtoAdmClini.IpCreacion = element.IpCreacion;
        dtoAdmClini.IpModificacion = this.getIp();
        dtoAdmClini.TipoOperacionID = this.filtro.TipoOperacionID;
        dtoAdmClini.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
        this.dtofinal.list_AdmisionServicio.push(dtoAdmClini);

      });

      console.log("llegando lista combo tipo paciente", this.dtofinal.list_AdmisionServicio)
      this.dtofinal.IndicadorWS = 0;
      console.log("dto a selec tipo paciente:", this.dtofinal);
      this.bloquearPag = false;
      this.pacienteClinicaService.cambioContratoTipoPaciente(1, this.dtofinal, this.getUsuarioToken()).then(

        res => {
          this.bloquearPag = true;
          if (res.mensaje.length <= 38) {
            Swal.fire({
              icon: 'warning',
              title: '¡Mensaje!',
              text: `${res.mensaje}`
            })
            this.lastYearTotal = 0;
            this.contado = 1;
            this.lstListarXAdmision = [];
            var totala = 0;
            var cantidadExamenes = 0;
            console.log("probando res de la lista", res.list_AdmisionServicio[0].TipoOperacionId)
            res.list_AdmisionServicio.forEach(element => {
              cantidadExamenes += element.Cantidad;
              element.ValorEmpresa = element.Valor * element.Cantidad;
              totala += element.Valor;
              element.numeroXadmision = this.contado++;
              this.lstListarXAdmision.push(element);
            });

            this.lastYearTotal = totala;
            this.cantidad = cantidadExamenes;
            this.loading = false;
            if (this.admision != null) {
              this.admision.TipoOperacionId = this.filtro.TipoOperacionID;
              this.bloquearPag = false;
            } else {
              this.seleccionarItemPacienteTemp = this.filtro.TipoOperacionID;
              this.bloquearPag = false;
            }
          } else {
            this.bloquearPag = true;
            console.log("res al guardar admision TODO", res)
            Swal.fire({
              icon: 'warning',
              title: '¡Mensaje!',
              text: `${res.mensaje}`
            }).then((result) => {
              if (result.isConfirmed) {
                if (this.admision != null) {
                  this.filtro.TipoOperacionID = this.admision.TipoOperacionId;
                  console.log("tipo operacon del despues", this.filtro.TipoOperacionID)
                  this.bloquearPag = false;
                } else {
                  this.filtro.TipoOperacionID = this.seleccionarItemPacienteTemp;
                  console.log("tipo operacon del despues", this.filtro.TipoOperacionID)
                  this.bloquearPag = false;
                }

              }

            })
          }
        }).catch(error => error)
    }
  }

  EditarAdmision(tempfiltro: Admision) {
    console.log("EditarAdmision", this.tempfiltro);
    this.bloquearPag = true;
    this.filtro.Documento = tempfiltro.Documento;
    this.filtro.NombreCompleto = tempfiltro.NombreCompleto;
    this.filtro.CodigoHC = tempfiltro.HistoriaClinica;
    this.filtro.Sexo = tempfiltro.sexo;
    this.filtro.FechaNacimiento = tempfiltro.fechanacimiento;
    this.CalcularAnios();
    this.filtro.NroPeticion = tempfiltro.NroPeticion;
    this.filtro.OrdenAtencion = tempfiltro.OrdenAtencion;
    this.filtro.OrdenSinapa = tempfiltro.OrdenSinapa;
    this.filtro.Telefono = tempfiltro.Telefono;
    this.filtro.Cama = tempfiltro.Cama;
    this.filtro.CoaSeguro = tempfiltro.CoaSeguro;
    this.filtro.Nombres = tempfiltro.nombres;
    this.filtro.ApellidoPaterno = tempfiltro.apellidopaterno;
    this.filtro.ApellidoMaterno = tempfiltro.apellidomaterno;
    this.filtro.TipoOperacionID = tempfiltro.TipoOperacionId;
    this.filtro.ClasificadorMovimiento = tempfiltro.ClasificadorMovimiento;
    this.filtro.TipoOrden = tempfiltro.TipoOrden;
    this.filtro.empresa = tempfiltro.IdSede;
    this.filtro.TipoAtencion = tempfiltro.TipoAtencion;
    this.filtro.IdSedeEmpresa = tempfiltro.IdSedeEmpresa;
    this.MostrarEmpresa(tempfiltro.Persona, 1);

    this.editarCampoDocumento = true;
    this.lstSedeEmpresa = [];
    if (tempfiltro.IdEmpresaPaciente > 0) {
      this.MostrarEmpresa(tempfiltro.IdEmpresaPaciente, 2);
      this.comboCargarSedeEmpresa(tempfiltro.IdEmpresaPaciente)
      this.filtro.IdSedeEmpresa = tempfiltro.IdSedeEmpresa;
    }
    this.MostrarMedico(tempfiltro.MedicoId);
    this.MostrarAseguradora(tempfiltro.IdAseguradora);
    this.grillaCargarDatos({ first: 0 });
    this.verBtnAnular = true;
    this.btnEditar();
    this.colCard1 = "col-sm-3"
    this.colCard2 = "col-sm-6"
    this.bloquearPag = false;

    var listaEntyOperacion = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('EntyOperacion')));
    if (!this.esListaVacia(listaEntyOperacion)) {
      listaEntyOperacion.forEach(e => {
        if (e.TipoOperacionID == tempfiltro.TipoOperacionID) {
          this.IdConsentimiento = e.FlaCon;
          console.log("IdConsentimiento", this.IdConsentimiento);
        }
      });
    }
  }

  CalcularAnios() {
    let ahora = new Date();
    let fechanacimiento = new Date(this.filtro.FechaNacimiento);
    let anios = ahora.getFullYear() - fechanacimiento.getFullYear();
    fechanacimiento.setFullYear(ahora.getFullYear());
    if (ahora < fechanacimiento) {
      --anios
    }
    this.filtro.Edad = anios;
  }


  limpiarPersona() {
    this.filtro.Persona = new FiltroPacienteClinica().Persona;
    this.filtro.Documento = new FiltroPacienteClinica().Documento;
    this.filtro.NombreCompleto = new FiltroPacienteClinica().NombreCompleto;
    this.filtro.FechaNacimiento = new FiltroPacienteClinica().FechaNacimiento;
    this.filtro.CorreoElectronico = new FiltroPacienteClinica().CorreoElectronico;
    this.filtro.Sexo = new FiltroPacienteClinica().Sexo;
    this.filtro.Edad = new FiltroPacienteClinica().Edad;
    this.filtro.Comentario = new FiltroPacienteClinica().Comentario;
    this.filtro.CodigoHC = new FiltroPacienteClinica().CodigoHC;
    this.filtro.consentimiento = new FiltroPacienteClinica().consentimiento;
    this.editarCampoDocumento = false;
    this.editarCampos = true;
    this.editarDetallePrueba = true;
    this.editarDetallePrueba_check = true;
    this.editarCampoAseguradora = true;
    this.editarCampoMedico = true;
    this.editarCampoEmpresa = true;
    this.disableBtnGuardar = true;
    this.bscPersona = new dtoPersona();
  }

  limpiarAseguradora() {
    this.filtro.IdAseguradora = new FiltroPacienteClinica().IdAseguradora;
    this.filtro.NombreEmpresa = new FiltroPacienteClinica().NombreEmpresa;
    this.editarCampoAseguradora = false;
  }

  limpiarMedico() {
    this.filtro.CMP = new FiltroPacienteClinica().CMP;
    this.filtro.Busqueda = new FiltroPacienteClinica().Busqueda;
    this.filtro.MedicoId = new FiltroPacienteClinica().MedicoId;
    this.editarCampoMedico = false;
  }

  limpiarEmpresa() {
    this.filtro2.DocumentoFiscal = new FiltroPacienteClinica().DocumentoFiscal;
    this.filtro2.NombreCompleto = new FiltroPacienteClinica().NombreCompleto;
    this.filtro2.Persona = new FiltroPacienteClinica().Persona;
    this.editarCampoEmpresa = false;
    this.lstSedeEmpresa = [];

  }


  cargarServicios() {
    const p1 = 1;
    Promise.all([p1]).then(
      f => {
        //  this.grillaCargarDatos({ first: this.dataTableComponent.first });
      }
    );
  }


  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  coreExportar(): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }
  coreNuevo(): void {
    // this.openNew();
  }

  btnNuevo() {
    this.filtro = new FiltroPacienteClinica();
    this.filtro2 = new FiltroPacienteClinica();
    this.admision = new DtoPacienteClinica();
    this.editarCampoDocumento = false;
    this.editarCampos = true;
    this.editarDetallePrueba = true;
    this.editarDetallePrueba_check = true;
    this.editarCampoAseguradora = true;
    this.editarCampoMedico = true;
    this.editarCampoEmpresa = true;
    this.disableBtnGuardar = true;
    this.editarCampoAseguradora = false;
    this.editarCampoMedico = false;
    this.editarCampoEmpresa = false;
    this.lstSedeEmpresa = [];
    this.filtro.TipoOrden = "R";
    this.filtro.TipoAtencion = 1;
    this.filtro.TipoOperacionID = this.valorTipoPacienteId;
    this.filtro.comboCliente = this.valorCliente;
    this.filtro.ClasificadorMovimiento = this.getUsuarioAuth().data[0].ClasificadorMovimiento
    this.lstListarXAdmision = [];
    this.lastYearTotal = 0
    this.cantidad = 0
    this.filtro.IdEspecialidad = 0
    this.editarCampos = true;
    this.editarDetallePrueba = true;
    this.editarDetallePrueba_check = true;
    this.editarCampoMedico = true;
    this.editarCampoAseguradora = true;
    this.editarCampoEmpresa = true;
    this.editarCampoDocumento = false;
    this.verBtnAnular = false;
    this.colCard1 = "col-sm-5"
    this.colCard2 = "col-sm-4"

  }

  btnEditar() {
    // this.editarCampoOA = false;
    this.editarCamposAutomaticos = true;
    this.editarCampos = false;
    this.editarDetallePrueba = false;
    this.editarDetallePrueba_check = false;
    this.disableBtnGuardar = true;




    this.editarCampoSevicio = false;
    this.editarCampoMedico = false;
    this.editarCampoAseguradora = false;
    this.editarCampoEmpresa = false;
    if (this.filtro.TipoAtencion == 2) {
      this.editarCampoNroCama = false;
    } else {
      this.editarCampoNroCama = true;
    }
    /**BLOQUEAR CAMPO DE BUSQUEDA DE DETALLE DE PRUEBA AL EDITAR UNA OA */
    if (this.tempfiltro.Estado == 2) {
      this.editarDetallePrueba = true;
      this.editarDetallePrueba_check = false;
    }
    /**FIN */

  }

  coreBuscarPrueba(): void {
    this.openBuscarPrueba();
  }


  coreSeleccionar(filtro: any) {
    this.mensajeController.resultado = filtro;
    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
    this.coreSalir();
  }


  BuscarOA() {
    this.buscarOAComponent.coreIniciarComponenteBuscarOA(new MensajeController(this, 'BUSCOA', ''), 'NUEVO', this.filtro);

  }

  openBuscarPaciente() {
    this.buscarPacienteComponent.iniciarComponente('PACIENTE')
  }

  openBuscarPrueba() {
    this.buscarPruebaComponent.iniciarComponente('PRUEBA')
  }

  crearAseguradora() {
    this.aseguradoraMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGASEGURADORA', ''), "NUEVO");
  }


  crearMedico() {
    this.medicoMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGMEDICO', ''), 'NUEVO');
  }

  //Nueva Empresa (Juridica) - Pacientes
  crearEmpresa() {
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGEMPRESA', ''), 'NUEVO', 2);
  }

  /**
   * Mensaje de confirmación agregado en base a solicitud AD-136
   */
  confirmarMultiPersona() {
    if (this.filtro.NombreCompleto == null && this.filtro.Documento == null) {
      this.MultiPersona();
    } else {

      Swal.fire({
        title: '¡Importante!',
        text: "¿Está seguro de modificar los datos del paciente? \n Los cambios podrían afectar a peticiones existentes",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#094d74',
        cancelButtonColor: '#ffc72f',
        cancelButtonText: 'No, Cancelar!',
        confirmButtonText: 'Si, modificar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.MultiPersona();
        }
      });
    }
  }

  MultiPersona() {
    //  this.bloquearPag = true;

    if (this.filtro.NombreCompleto == null && this.filtro.Documento == null) {
      console.log("Primer Console")
      this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONANUEVO', ''), "NUEVO", 1);
    } else {
      console.log("2 Console")
      // console.log(":: this.filtro.Documento multipersona", this.filtro.Documento.trim())
      console.log("MultiPersona this.filtro", this.filtro);
      this.bscPersona.ApellidoPaterno = this.filtro.ApellidoPaterno;
      this.bscPersona.ApellidoMaterno = this.filtro.ApellidoMaterno;
      this.bscPersona.NombreCompleto = this.filtro.NombreCompleto;
      this.bscPersona.TipoDocumento = this.filtro.TipoDocumento;
      this.bscPersona.Documento = this.filtro.Documento;
      this.bscPersona.FechaNacimiento = this.filtro.FechaNacimiento;
      this.bscPersona.Sexo = this.filtro.Sexo;
      if (this.esNumeroVacio(this.filtro.Telefono)) {

      } else {
        this.bscPersona.Telefono = this.filtro.Telefono.toString();
      }

      this.bscPersona.CorreoElectronico = this.filtro.CorreoElectronico;
      this.bscPersona.Nombres = this.filtro.Nombres;
      this.bscPersona.Edad = this.filtro.Edad;
      this.bscPersona.Comentario = this.filtro.Comentario;
      if (this.bscPersona.Documento != null) {
        console.log("3 Console")
        this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONAEDITAR', ''), "EDITAR", 1, this.bscPersona);

      } else if (this.admision != null) {
        console.log("4 Console")
        this.getPersonaServicio(this.filtro.Documento.trim(), 1);

      } else {
        console.log("5 Console")
        // this.getPersonaServicio(this.filtro.Documento.trim(), 1);
        this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONANUEVO', ''), "NUEVO", 1);
      }

    }
  }


  Correo(admision: DtoPacienteClinica) {
    console.log("correo admision ::", admision);
    console.log("correo this.filtro ::", this.filtro);
    if (this.esListaVacia(this.filtro)) {
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: 'Proceda a guardar la petición'
      })
      return;
    } else {

      if (this.filtro.Estado == 1 || this.filtro.Estado == 3) {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: 'Debe seleccionar un registro'
        })
        return;
      }

      if (!this.esEmailValido(this.filtro.CorreoElectronico)) {
        console.log("correo", this.filtro.CorreoElectronico);
        setTimeout(() => {
          this.bloquearPag = false;
        }, 300);
        this.toastMensaje('Mensaje no enviado. El paciente no cuenta con un correo valido.', 'warning', 3000);
        return;
      }


      this.bloquearPag = true;
      let IdPersona = {
        IdPersona: this.filtro.Persona,
        ClasificadorMovimiento: this.filtro.ClasificadorMovimiento
      }
      var _parametros = null;
      this.Auth = this.getUsuarioAuth();
      var usuario = this.Auth.data;

      this.personaService.listarUsuarioWeb(IdPersona).then(resp => {
        console.log("4 Console")
        console.log("resp", resp)
        if (resp[0].estadoActualizacion == 1) {
          _parametros = {
            success: 1,
            valor: 1,
            UneuNegocioId: usuario[0].UneuNegocioId,
            str_pTo: this.filtro.CorreoElectronico,
            str_pCC: "darkon27@gmail.com",
            NombreCompleto: resp[0].NombreCompleto,
            PerNumeroDocumento: resp[0].UserNameWeb,
            Password: resp[0].PasswordWeb
          }
          var validar = 1;

          if (this.estaVacio(_parametros.str_pTo)) {
            console.log("correo", _parametros.str_pTo);
            setTimeout(() => {
              this.bloquearPag = false;
            }, 300);
            this.toastMensaje('Mensaje no enviado. El paciente no cuenta con un correo registrado.', 'warning', 3000);
            validar = 2;
          } else {
            if (!this.esEmailValido(_parametros.str_pTo)) {
              console.log("correo", _parametros.str_pTo);
              setTimeout(() => {
                this.bloquearPag = false;
              }, 300);
              this.toastMensaje('Mensaje no enviado. El paciente no cuenta con un correo valido.', 'warning', 3000);
              validar = 2;
            }
          }
          if (validar == 1) {
            return this.consultaAdmisionService.sendCorreo(_parametros).then(resp => {
              console.log("correo", resp)
              setTimeout(() => {
                this.bloquearPag = false;
              }, 300);
              this.toastMensaje('Correo enviado', 'success', 3000);
            }).catch(error => error);

          }
        } else {
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            text: 'Usuario ya personalizó su contraseña, procesa a generarla una nueva'
          })
          setTimeout(() => {
            this.bloquearPag = false;
          }, 300);
        }

      });
    }

  }

  imprimirCodigo() {
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: 'EN DESARROLLO',
      showConfirmButton: false,
      timer: 1500
    })
  }

  imprimir(dto: Admision) {
    this.bloquearPag = true;
    var payload = {
      IdReporte: 1,
      IdAdmision: this.admision.IdAdmision,
      NroPeticion: this.filtro.NroPeticion
    }
    this.consultaAdmisionService.printListadoReporte(payload).then(resp => {
      console.log("prin", resp);

      this.verReporteModal = true;

      var base64 = (resp.ValorByte);
      const file2 = this.base64toBlob(resp.ValorByte, 'application/pdf');

      const link = window.URL.createObjectURL(file2);
      this.pdfViewerActividades.pdfSrc = link;
      this.pdfViewerActividades.refresh();

      this.bloquearPag = false;


    });

  }

  base64toBlob(base64Data, contentType): Blob {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  AnularDetallePrueba() {
    var anular = this.registroSeleccionado;
    var validado = 0;
    this.lstAnularAdmisionDetalle = [];
    console.log("AnularDetallePrueba registro seleccionado", anular);
    anular.forEach(element => {
      // if (element.Estado == 1 || element.Estado == 2) {
      if (element.hasOwnProperty("IdAdmision")) {
        if (element.Estado == 1 || element.Estado == 2) {

          var dtoAdmClini = new DtoPacienteClinica();
          dtoAdmClini.IdAdmServicio = element.IdAdmServicio;
          dtoAdmClini.IdAdmision = element.IdAdmision;
          dtoAdmClini.Linea = element.Linea;
          dtoAdmClini.IdOrdenAtencion = element.IdOrdenAtencion;
          dtoAdmClini.CodigoComponente = element.CodigoComponente;
          dtoAdmClini.Descripcion = element.Descripcion;
          dtoAdmClini.Cantidad = element.Cantidad;
          dtoAdmClini.Valor = element.Valor;
          dtoAdmClini.Estado = element.Estado;
          dtoAdmClini.Sexo = element.Sexo;
          dtoAdmClini.UsuarioCreacion = element.UsuarioCreacion;
          dtoAdmClini.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
          dtoAdmClini.IpCreacion = element.IpCreacion;
          dtoAdmClini.IpModificacion = this.getIp();
          this.lstAnularAdmisionDetalle.push(dtoAdmClini);
          console.log("llegando toda la lista", this.dtofinal.list_AdmisionServicio);
        } else {
          validado = 1

          this.toastMensaje('El examen debe estar en pendiente para proceder la anulación.', 'warning', 2000);
          this.registroSeleccionado = null;

        }
      } else {
        validado = 1
        this.toastMensaje('No se puede anular Examen(es)', 'warning', 3000);
        this.registroSeleccionado = null;
      }

    });
    if (validado != 1) {
      this.pacienteClinicaService.anularAdmisionDetalle(4, this.lstAnularAdmisionDetalle, this.getUsuarioToken()).then(
        res => {
          this.auditoria(res.Admision, 2);
          this.bloquearPag = true;
          this.toastMensaje(`${res.mensaje}`, 'success', 2000);
          this.bloquearPag = false;
          console.log("llegando data del res anular admision", res);
          if (res.list_AdmisionServicio != null) {
            this.loading = true;
            this.lstListarXAdmision = [];
            var totala = 0;
            var cantidadExamenes = 0;
            var contadorsito = 1;
            res.list_AdmisionServicio.forEach(element => {
              cantidadExamenes += element.Cantidad;
              element.ValorEmpresa = element.Valor * element.Cantidad;
              totala += element.ValorEmpresa;
              element.numeroXadmision = contadorsito++;
              this.lstListarXAdmision.push(element);
            });
            this.lastYearTotal = totala;
            this.cantidad = cantidadExamenes;
            this.registroSeleccionado = null;
            this.loading = false;
          } else {
            this.registroSeleccionado = null;
            this.toastMensaje(`${res.mensaje}`, 'warning', 2000);

          }
        }).catch(error => error)


    }
  }


  async ValidarQuitarDetallePrueba() {
    this.bloquearPag = true;
    console.log("ValidarQuitarDetallePrueba::", this.registroSeleccionado)
    let lstConIdAdmision: DtoPacienteClinica[] = [];
    let lstSinIdAdmision: DtoPacienteClinica[] = [];
    this.loading = true;
    for (let element of this.registroSeleccionado) {
      // 1 representa al estado pendiende de un examen
      if (element.Estado != 1) {
        this.registroSeleccionado = null;
        this.toastMensaje(`No se puede eliminar Examen(es).`, 'warning', 2000);
        this.bloquearPag = false;
        return;
      }

      if (!element.hasOwnProperty("IdAdmision")) {
        // this.toastMensaje('No se puede eliminar Examen(es)', 'warning', 3000);
        lstSinIdAdmision.push(element);
      }

      if (element.hasOwnProperty("IdAdmision")) {
        if (element.Estado == 1) {
          var dtoAdmClini = new DtoPacienteClinica();
          dtoAdmClini.IdAdmServicio = element.IdAdmServicio;
          dtoAdmClini.IdAdmision = element.IdAdmision;
          dtoAdmClini.Linea = element.Linea;
          dtoAdmClini.IdOrdenAtencion = element.IdOrdenAtencion;
          dtoAdmClini.CodigoComponente = element.CodigoComponente;
          dtoAdmClini.Descripcion = element.Descripcion;
          dtoAdmClini.Cantidad = element.Cantidad;
          dtoAdmClini.Valor = element.Valor;
          dtoAdmClini.Estado = element.Estado;
          dtoAdmClini.Sexo = element.Sexo;
          dtoAdmClini.UsuarioCreacion = element.UsuarioCreacion;
          dtoAdmClini.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
          dtoAdmClini.IpCreacion = element.IpCreacion;
          dtoAdmClini.IpModificacion = this.getIp();
          lstConIdAdmision.push(dtoAdmClini);
        }
      }
    }
    /**LISTA INGRESADA MANUALMENTE */
    if (lstSinIdAdmision.length > 0) {
      this.lstListarXAdmision = this.lstListarXAdmision.filter(val => !lstSinIdAdmision.includes(val));
      this.seleccionarItemServicioTemp = null;
      this.toastMensaje('Se Quitó Examen(es)', 'success', 3000);
    }

    /**LISTA INGRESADA DE OA */
    if (lstConIdAdmision.length > 0) {
      let isElimino = await this.QuitarDetallePrueba(lstConIdAdmision);
      if (isElimino) {
        for (let ele of lstConIdAdmision) { this.lstListarXAdmision = this.lstListarXAdmision.filter((e) => e.Descripcion != ele.Descripcion); }
      } console.log("ss", this.lstListarXAdmision);
    }
    await this.calculoDePruebasIgv();
    this.registroSeleccionado = [];
    this.bloquearPag = false;
    this.loading = false;

  }


  async QuitarDetallePrueba(listaEliminar: DtoPacienteClinica[]): Promise<boolean> {
    let lstEliminar: DtoPacienteClinica[] = listaEliminar;
    var validar: boolean = true;
    console.log("QuitarDetallePrueba del registro seleccionado", lstEliminar)

    for (let element of lstEliminar) {
      // 1 representa al estado pendiende de un examen
      if (element.Estado != 1) {
        validar = false;
        this.toastMensaje(`No se puede eliminar Examen(es).`, 'warning', 2000);
        return;
      }
      if (!element.hasOwnProperty("IdAdmision")) {
        validar = false;
        this.toastMensaje('No se puede eliminar Examen(es)', 'warning', 3000);
        lstEliminar = [];
        return;
      }
    }

    if (validar === true) {
      try {
        const respEliminarExamenes = await this.pacienteClinicaService.anularAdmisionDetalle(
          ConstanteUI.SERVICIO_SOLICITUD_ELIMINAR_EXAMEN, lstEliminar, this.getUsuarioToken());
        if (respEliminarExamenes.Admision != null) {
          await this.auditoria(respEliminarExamenes.Admision, 2);
          this.toastMensaje(`${respEliminarExamenes.mensaje}`, 'success', 2000);
          if (respEliminarExamenes.list_AdmisionServicio.length == 0) {
            this.registroSeleccionado = null;
            this.lstListarXAdmision = [];
            this.lastYearTotal = 0;
            this.cantidad = 0;
            return true;
          }

          this.loading = true;

          this.registroSeleccionado = null;
          this.loading = false;
        } else {
          return validar;
        }
      }
      catch (Exception) { throw new Error("Error al eliminar examenes.") }
      finally { return validar; }
    }
  }

  async calculoDePruebasIgv(): Promise<void> {
    let numExamen: number = 0;
    this.lastYearTotal = 0
    this.cantidad = 0
    if (this.lstListarXAdmision.length > 0) {

      for (let examen of this.lstListarXAdmision) {
        numExamen += 1;
        examen.numeroXadmision = null; // si son nuevo, resultan estar en undefined
        examen.numeroXadmision = numExamen;
        examen.ValorEmpresa = examen.Valor * examen.Cantidad;
        this.lastYearTotal += examen.ValorEmpresa;
        this.cantidad += examen.Cantidad;
      }
    } else {
      this.lastYearTotal = 0
      this.cantidad = 0
    }
  }

  async EliminarDetallePrueba(listaEliminar: DtoPacienteClinica[]): Promise<boolean> {
    let rpta: boolean = false;
    try {
      this.lstListarXAdmision = this.lstListarXAdmision.filter(val => !listaEliminar.includes(val));
      this.registroSeleccionado = null;

      this.seleccionarItemServicioTemp = null;
      this.toastMensaje('Se Quitó Examen(es)', 'success', 3000);
      rpta = true;
    } catch (Exception) {
      this.toastMensaje('Error al eliminar examen(es)', 'error', 3000);
      rpta = false;
    } finally { return rpta; }



  }

  ValidateAnular() {
    let valida = false;
    let salida = "Los examen(es) debe estar en pendiente para proceder la anulación.";
    this.lstListarXAdmision.forEach(element => {
      if (valida == false) {
        if (element.Estado == 1) {
          salida = null;
          valida = true;
        }
      }
    });

    return salida;
  }

  AnularAdmision(admision: DtoPacienteClinica) {

    var validar = this.ValidateAnular();
    console.log("llegando ", validar);
    if (validar != null) {
      //this.mostrarMensaje(valida, 'warn');

      Swal.fire({
        icon: 'warning',
        title: `¡Mensaje!`,
        text: validar
      })

    } else {
      Swal.fire({
        title: '¡Importante!',
        text: "¿Seguro que desea anular el registro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#094d74',
        cancelButtonColor: '#ffc72f',
        cancelButtonText: 'No, Cancelar!',
        confirmButtonText: 'Si, Anular!'
      }).then((result) => {
        if (result.isConfirmed) {

          console.log("filtro del anular admision despues", this.filtro);
          this.dtofinal.Admision.TipoDocumento = this.filtro.TipoDocumento;
          this.dtofinal.Admision.Documento = this.filtro.Documento;
          this.dtofinal.Admision.NombreCompleto = this.filtro.NombreCompleto;
          this.dtofinal.Admision.fechanacimiento = new Date(this.filtro.FechaNacimiento);
          this.dtofinal.Admision.nombres = this.filtro.Nombres;
          this.dtofinal.Admision.apellidopaterno = this.filtro.ApellidoPaterno;
          this.dtofinal.Admision.apellidomaterno = this.filtro.ApellidoMaterno;
          this.dtofinal.Admision.sexo = this.filtro.Sexo;
          this.dtofinal.Admision.CorreoElectronico = this.filtro.CorreoElectronico;
          this.dtofinal.Admision.IdAdmision = admision.IdAdmision; //normal registraria sin llamarlo cunado es 1
          this.dtofinal.Admision.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
          this.dtofinal.Admision.TipoOperacionID = this.filtro.TipoOperacionID;

          this.dtofinal.Admision.Persona = this.filtro.Persona; //viene de un metodo persona
          this.dtofinal.Admision.FechaAdmision = new Date(admision.FechaAdmision);
          this.dtofinal.Admision.HistoriaClinica = this.filtro.CodigoHC;
          this.dtofinal.Admision.NroPeticion = this.filtro.NroPeticion;
          this.dtofinal.Admision.OrdenAtencion = this.filtro.OrdenAtencion;
          this.dtofinal.Admision.MedicoId = this.filtro.MedicoId;
          this.dtofinal.Admision.IdSede = this.getUsuarioAuth().data[0].IdSede;
          this.dtofinal.Admision.Estado = admision.Estado;
          this.dtofinal.Admision.FechaCreacion = new Date(admision.FechaCreacion);
          this.dtofinal.Admision.FechaModificacion = new Date();
          this.dtofinal.Admision.UsuarioCreacion = admision.UsuarioCreacion; //derrepente pasando nulo
          this.dtofinal.Admision.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
          this.dtofinal.Admision.IpCreacion = admision.IpCreacion;   //crear metodo que nos muestre la IP del usuario
          this.dtofinal.Admision.IpModificacion = this.getIp();  //crear metodo que nos muestre la IP del usuario

          this.dtofinal.Admision.IdEmpresaPaciente = this.filtro2.Persona;
          this.dtofinal.Admision.IdAseguradora = this.filtro.IdAseguradora;
          this.dtofinal.Admision.TipoOrden = this.filtro.TipoOrden;
          this.dtofinal.Admision.ClasificadorMovimiento = this.filtro.ClasificadorMovimiento;
          this.dtofinal.Admision.IdEspecialidad = this.filtro.IdEspecialidad;
          this.dtofinal.Admision.TipoAtencion = admision.TipoAtencion;
          this.dtofinal.Admision.DesEstado = admision.DesEstado;
          this.dtofinal.Admision.TIPOADMISIONID = 1; //admision.TIPOADMISIONID;
          this.dtofinal.Admision.FlatAprobacion = admision.FlatAprobacion;
          console.log("llegando toda cabecera", this.dtofinal.Admision);
          this.dtofinal.list_AdmisionServicio = [];

          this.lstListarXAdmision.forEach(element => {

            var dtoAdmClini = new DtoAdmisionclinicaDetalle();
            dtoAdmClini.IdAdmServicio = element.IdAdmServicio;
            dtoAdmClini.IdAdmision = element.IdAdmision;
            dtoAdmClini.Linea = element.Linea;
            dtoAdmClini.IdOrdenAtencion = element.IdOrdenAtencion;
            dtoAdmClini.CodigoComponente = element.CodigoComponente;
            dtoAdmClini.Descripcion = element.Descripcion;
            dtoAdmClini.Cantidad = element.Cantidad;
            dtoAdmClini.Valor = element.Valor;
            dtoAdmClini.Estado = element.Estado;
            dtoAdmClini.Sexo = element.Sexo;
            dtoAdmClini.UsuarioCreacion = element.UsuarioCreacion;
            dtoAdmClini.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
            dtoAdmClini.IpCreacion = element.IpCreacion;
            dtoAdmClini.IpModificacion = this.getIp();
            this.dtofinal.list_AdmisionServicio.push(dtoAdmClini);
            console.log("llegando toda la lista", this.dtofinal.list_AdmisionServicio)
          });

          this.dtofinal.IndicadorWS = 0;
          console.log("dto a anular admision:", this.dtofinal);
          this.pacienteClinicaService.mantenimientoAdmisionClinica(3, this.dtofinal, this.getUsuarioToken()).then(
            res => {
              this.auditoria(res.Admision, 2);
              this.bloquearPag = true;
              this.toastMensaje('Se Anuló el registro con éxito.', 'success', 2000);
              this.bloquearPag = false;
              if (res.list_AdmisionServicio != null) {
                this.loading = true;
                this.lastYearTotal = 0;
                this.contado = 1;
                this.lstListarXAdmision = [];
                var totala = 0;
                var cantidadExamenes = 0;
                res.list_AdmisionServicio.forEach(element => {
                  cantidadExamenes += element.Cantidad;
                  element.ValorEmpresa = element.Valor * element.Cantidad;
                  totala += element.ValorEmpresa;
                  element.numeroXadmision = this.contado++;
                  this.lstListarXAdmision.push(element);
                });
                this.cantidad = cantidadExamenes;
                this.lastYearTotal = totala;
                this.loading = false;


              } else {
                this.toastMensaje(`${res.mensaje}`, 'warning', 2000);

              }
            }).catch(error => error)


        }
      })
    }


  }

  enterCantidad(evento) {
    if (evento.key == "Enter" || evento.key == "Tab") {
      var cantidadExamenes = 0
      var cantidadXexamenes = 0
      this.cantidad = 0
      this.lstListarXAdmision.forEach(e => {
        if (e.Cantidad <= 0 || this.esNumeroVacio(e.Cantidad)) {
          e.Cantidad = 1;
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            text: 'Cantidad ingresada no valida',
            confirmButtonColor: '#094d74',
            confirmButtonText: 'OK'
          })
        }
        cantidadExamenes += e.Cantidad;
        e.ValorEmpresa = e.Cantidad * e.Valor;
        cantidadXexamenes += e.ValorEmpresa;
      });
      this.cantidad = cantidadExamenes;
      this.lastYearTotal = cantidadXexamenes;
    }
  }

  selectedItemTipoAtencion(event) {
    this.editarCampoNroCama = true;
    if (event == 2 || event == 3 || event.value == 2 || event.value == 3) {
      this.editarCampoNroCama = false;
      this.filtro.TipoOrden = 'S'
    }
  }

  selectedItemServicio(event) {
    if (this.seleccionarItemServicioTemp == null) {
      if (this.lstListarXAdmision.length > 0) {
        this.MensajeListarxAdmision(event);
        return
      } else {
        if (event.value == "02") {
          this.editarCantidad = false;
        } else {
          this.editarCantidad = true;
        }
      }
    }
    this.MensajeListarxAdmision(event);
  }

  MensajeListarxAdmision(event) {
    if (this.lstListarXAdmision.length > 0) {
      if (this.seleccionarItemServicioTemp != event.value) {
        if (this.seleccionarItemServicioTemp == "02") {
          this.editarCantidad = false;
        }
        var mensaje = "Este Examen " + this.lstListarXAdmision[0].CodigoComponente + " no tiene configurado este servicio: " + event.value;
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: mensaje
        }).then((result) => {
          if (result.isConfirmed) {
            if (this.admision != null) {

              this.filtro.ClasificadorMovimiento = this.admision.ClasificadorMovimiento;
              console.log("COMBO SERVICIO DESDE ADMISION", this.admision.ClasificadorMovimiento);
            }
            else {
              this.filtro.ClasificadorMovimiento = this.seleccionarItemServicioTemp;
            }
          } else if (result.isDenied) {
          }
        })
      }
    }
  }


  ValidarGuardar(admision: DtoPacienteClinica) {
    console.log("Admision cantidad", this.cantidad);
    console.log("Admision contarExamenes", this.contarExamenes);
    interface validar {
      correo: string;
      valida: string;
      estadoPersona: string;
      validaCMP: string;
    }
    let validacion: validar = {
      correo: this.filtro.CorreoElectronico,
      valida: this.ValidateFiles(),
      estadoPersona: this.EstadoPersona,
      validaCMP: this.ValidateCMP(),
    }
    console.log("VALIDACIONES", validacion);


    this.loading = false;
    this.bloquearPag = false;

    if (validacion.estadoPersona == "I") {
      this.mensajeValidacion('warning',
        `¡Completar Campos Obligatorios!`,
        "El Paciente se encuentra Inactivo :  Debe Actualizar su Estado",
        "N_Rpta");
      return;
    }

    if (this.filtro.TipoAtencion == 1 || this.filtro.TipoAtencion == 4) {
      if (validacion.correo == "" || validacion.correo == null || validacion.correo == undefined) {
        this.mensajeValidacion('warning',
          `¡Completar Campos Obligatorios!`,
          "Atención Ambulatorio o Domicilio :  Datos del teléfono y correo son obligaciones",
          "N_Rpta");
        return;
      }

      if (this.esNumeroVacio(this.filtro.Telefono) || this.filtro.Telefono == null || this.filtro.Telefono == undefined) {
        this.mensajeValidacion('warning',
          `¡Completar Campos Obligatorios!`,
          "Atención Ambulatorio o Domicilio :  Datos del teléfono y correo son obligaciones",
          "N_Rpta");
        return;
      }
    }



    if (validacion.valida != null) {
      this.mensajeValidacion('warning',
        `¡Completar Campos Obligatorios!`,
        validacion.valida,
        "N_Rpta");
      return;
    }

    /**
      * VALIDAR PRUEBAS SELECCIONADAS
    */
    if (this.lstListarXAdmision.length != this.registroSeleccionado.length) {
      this.mensajeValidacion('warning',
        `¡Completar Campos Obligatorios!`,
        "Seleccione todos los exámenes antes de guardar",
        "N_Rpta");
      return;
    }

    if (validacion.validaCMP == null) {
      console.log("Admision contarExamenes", this.contarExamenes);
      Swal.fire({
        title: '¡Importante!',
        text: "¿Seguro que desea guardar el registro?" + " " + this.filtro.Documento,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#094d74',
        cancelButtonColor: '#ffc72f',
        cancelButtonText: 'No, Cancelar!',
        confirmButtonText: 'Si, Guardar!'
      }).then((result) => {
        if (result.isConfirmed) {
          /**
        * VALIDAR PRUEBAS SELECCIONADAS
      */
          if (this.lstListarXAdmision.length != this.registroSeleccionado.length) {
            this.mensajeValidacion('warning',
              `¡Completar Campos Obligatorios!`,
              "Seleccione todos los exámenes antes de guardar",
              "N_Rpta");
            return;
          }

          if (validacion.correo == "" || validacion.correo == null || validacion.correo == undefined) {
            Swal.fire({
              title: '¡Importante!',
              text: "Registro sin correo," + " " + "¿Desea continuar?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#094d74',
              cancelButtonColor: '#ffc72f',
              cancelButtonText: 'No, Cancelar!',
              confirmButtonText: 'Si, Guardar!'
            }).then((result) => {
              if (result.isConfirmed) {
                this.GuardarAdmision(admision);
              } else {
                this.MultiPersona();
                this.bloquearPag = false;
              }
            });


          } else {
            this.GuardarAdmision(admision);
          }
        }
      });


    } else {
      validacion.validaCMP;
      console.log("Admision cantidad", this.cantidad);
      console.log("Admision contarExamenes", this.contarExamenes);
      Swal.fire({
        title: '¡Mensaje!',
        text: validacion.validaCMP,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#094d74',
        cancelButtonColor: '#ffc72f',
        cancelButtonText: 'No, Cancelar!',
        confirmButtonText: 'Si, Guardar!'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.esNumeroVacio(this.filtro.MedicoId)) {
            const filtroPacienteClinica: FiltroPacienteClinica = new FiltroPacienteClinica();
            filtroPacienteClinica.CMP = "0";

            this.servicioListarMedico(filtroPacienteClinica);
          }
          /**
        * VALIDAR PRUEBAS SELECCIONADAS  this.contarExamenes
      */
          if (this.registroSeleccionado.length == 0) {
            this.mensajeValidacion('warning',
              `¡Completar Campos Obligatorios!`,
              "Seleccione todos los exámenes antes de guardar",
              "N_Rpta antes" + this.contarExamenes + " " + this.registroSeleccionado.length);

            return;
          }
          if (validacion.correo == "" || validacion.correo == null || validacion.correo == undefined) {
            Swal.fire({
              title: '¡Importante!',
              text: "Registro sin correo." + " " + "¿Desea continuar?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#094d74',
              cancelButtonColor: '#ffc72f',
              cancelButtonText: 'No, Cancelar!',
              confirmButtonText: 'Si, Guardar!'
            }).then((result) => {
              if (result.isConfirmed) {
                this.GuardarAdmision(admision);
              } else {
                this.MultiPersona();
                this.bloquearPag = false;
              }
            });



          } else {
            this.GuardarAdmision(admision);
          }
        }
      });



    }
  }



  mensajeValidacion(icono: SweetAlertIcon, title: any, text: string, tipo: string): boolean {
    switch (tipo) {
      case "N_Rpta":
        Swal.fire({
          icon: icono,
          title: title,
          text: text
        })
        return false;
      case "S_Rpta":
        Swal.fire({
          title: title,
          text: text,
          icon: icono,
          showCancelButton: true,
          confirmButtonColor: '#094d74',
          cancelButtonColor: '#ffc72f',
          cancelButtonText: 'No, Cancelar!',
          confirmButtonText: 'Si, Guardar!'
        }).then((result) => { return result.isConfirmed });
        break;
    }
  }


  GuardarAdmision(admision: DtoPacienteClinica) {
    this.bloquearPag = true;
    let _dtofinal = new TraerXAdmisionServicio();
    var serv = this.registroSeleccionado;
    var indicaRegis = 0;
    console.log("Admision DTO GuardarAdmision", admision);
    console.log("GuardarAdmision filtro", this.filtro);
    console.log("Admision registroSeleccionado", this.registroSeleccionado);

    if (admision == null) {

    }
    else {
      //if (this.estaVacio(admision.NroPeticion))
      if (this.estaVacio(admision.NroPeticion)) {

      }
      else {
        var indicaRegis = 1;
      }
    }

    if (indicaRegis == 1) {
      var serv = this.registroSeleccionado;
      this.dtofinal.Admision.TipoDocumento = this.filtro.TipoDocumento;
      this.dtofinal.Admision.Documento = this.filtro.Documento;
      this.dtofinal.Admision.NombreCompleto = this.filtro.NombreCompleto;
      this.dtofinal.Admision.fechanacimiento = new Date(this.filtro.FechaNacimiento);
      this.dtofinal.Admision.nombres = this.filtro.Nombres;
      this.dtofinal.Admision.apellidopaterno = this.filtro.ApellidoPaterno;
      this.dtofinal.Admision.apellidomaterno = this.filtro.ApellidoMaterno;
      this.dtofinal.Admision.sexo = this.filtro.Sexo;
      this.dtofinal.Admision.CorreoElectronico = this.filtro.CorreoElectronico;
      this.dtofinal.Admision.IdAdmision = admision.IdAdmision;
      this.dtofinal.Admision.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
      this.dtofinal.Admision.TipoOperacionID = this.filtro.TipoOperacionID;
      this.dtofinal.Admision.Persona = this.filtro.Persona; //viene de un metodo persona
      this.dtofinal.Admision.FechaAdmision = new Date(admision.FechaLimiteAtencion);
      this.dtofinal.Admision.HistoriaClinica = this.filtro.CodigoHC;
      this.dtofinal.Admision.NroPeticion = this.filtro.NroPeticion;
      this.dtofinal.Admision.OrdenAtencion = this.filtro.OrdenAtencion;
      this.dtofinal.Admision.OrdenSinapa = this.filtro.OrdenSinapa;
      this.dtofinal.Admision.MedicoId = this.filtro.MedicoId;
      this.dtofinal.Admision.IdSede = this.getUsuarioAuth().data[0].IdSede;
      this.dtofinal.Admision.Estado = admision.Estado;
      this.dtofinal.Admision.FechaCreacion = new Date(admision.FechaCreacion);
      this.dtofinal.Admision.FechaModificacion = new Date();
      this.dtofinal.Admision.UsuarioCreacion = admision.UsuarioCreacion; //derrepente pasando nulo
      this.dtofinal.Admision.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
      this.dtofinal.Admision.IpCreacion = admision.IpCreacion;   //crear metodo que nos muestre la IP del usuario
      this.dtofinal.Admision.IpModificacion = this.getIp();  //crear metodo que nos muestre la IP del usuario
      this.dtofinal.Admision.IdEmpresaPaciente = this.filtro2.Persona;
      this.dtofinal.Admision.IdAseguradora = this.filtro.IdAseguradora;
      this.dtofinal.Admision.TipoOrden = this.filtro.TipoOrden;
      this.dtofinal.Admision.ClasificadorMovimiento = this.filtro.ClasificadorMovimiento;
      this.dtofinal.Admision.Cama = this.filtro.Cama;
      this.dtofinal.Admision.IdEspecialidad = this.filtro.IdEspecialidad;
      this.dtofinal.Admision.TipoAtencion = this.filtro.TipoAtencion;
      this.dtofinal.Admision.DesEstado = admision.DesEstado;
      this.dtofinal.Admision.TIPOADMISIONID = 1; //admision.TIPOADMISIONID;
      this.dtofinal.Admision.FlatAprobacion = admision.FlatAprobacion;
      this.dtofinal.Admision.ObservacionAlta = this.filtro.ObservacionAlta;
      this.dtofinal.list_AdmisionServicio = [];
      serv.forEach(element => {
        var dtoAdmClini = new DtoAdmisionclinicaDetalle();
        dtoAdmClini.IdAdmServicio = element.IdAdmServicio;
        dtoAdmClini.IdAdmision = element.IdAdmision;
        dtoAdmClini.Linea = element.Linea;
        dtoAdmClini.IdOrdenAtencion = element.IdOrdenAtencion;
        dtoAdmClini.CodigoComponente = element.CodigoComponente;
        dtoAdmClini.Descripcion = element.Descripcion;
        dtoAdmClini.Cantidad = element.Cantidad;
        dtoAdmClini.Valor = element.Valor;
        dtoAdmClini.Estado = element.Estado;
        dtoAdmClini.Sexo = element.Sexo;
        dtoAdmClini.UsuarioCreacion = element.UsuarioCreacion;
        dtoAdmClini.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
        dtoAdmClini.IpCreacion = element.IpCreacion;
        dtoAdmClini.IpModificacion = this.getIp();
        this.dtofinal.list_AdmisionServicio.push(dtoAdmClini);
      });
      this.dtofinal.IndicadorWS = 0;
      this.dtofinal.Admision.ObservacionAlta = this.filtro.ObservacionAlta;
      console.log("GuardarAdmision dtofinal Modificar", this.dtofinal);
      this.bloquearPag = true;
      this.pacienteClinicaService.ValidarComponentePerfil(1, this.dtofinal, this.getUsuarioToken()).then((resPerfil) => {
        this.bloquearPag = false;
        console.log("ValidarComponentePerfil :: ", resPerfil);
        if (resPerfil.valor == 1) {
          console.log("DTO  GUARDAR", this.dtofinal);
          this.pacienteClinicaService.mantenimientoAdmisionClinica(2, this.dtofinal, this.getUsuarioToken()).then(
            async res => {
              this.bloquearPag = false;
              this.auditoria(res.Admision, 2);
              if (this.estaVacio(res.mensaje)) {
                this.toastMensaje('Se actualizó el registro con éxito.', 'success', 2000);
              }
              else {
                if (res.valor == 1) {
                  this.toastMensaje(`${res.mensaje}`, 'success', 3000);
                } else {
                  this.toastMensaje(`${res.mensaje}`, 'warning', 3000);
                }
              }
              console.log("DTO  GUARDAR mantenimientoAdmisionClinica", res);

              this.dtofinal.Admision.DesEstado = res.Admision.DesEstado;
              this.dtofinal.Admision.Estado = res.Admision.Estado;
              this.filtro.Estado = res.Admision.Estado;
              admision.DesEstado = res.Admision.DesEstado;
              // admision.Estado = res.Admision.Estado;

              if (res.list_AdmisionServicio[0].hasOwnProperty("CodigoComponente")) {


                this.lstListarXAdmision = [];
                for (let examenParaAgregar of res.list_AdmisionServicio) {
                  /**SE HACE EL CALCULO POR EL HECHO DE QUE EL VALOR VIENE EN DIFERENTE VARIABLE */
                  //examenParaAgregar.numeroXadmision = null; // si son nuevo, resultan estar en undefined
                  examenParaAgregar.valorBruto = examenParaAgregar.ValorEmpresa; // se agrega el valor de empresa
                  examenParaAgregar.ValorEmpresa = null; // se limpia por seguridad
                  let ExamenConIgv = examenParaAgregar.valorBruto * this.getUsuarioAuth().data[0].Igv;
                  examenParaAgregar.ValorEmpresa = examenParaAgregar.valorBruto + ExamenConIgv;
                  examenParaAgregar.ValorEmpresa = examenParaAgregar.ValorEmpresa * examenParaAgregar.Cantidad;
                  this.lstListarXAdmision.push({ ...examenParaAgregar });
                }
                this.lstListarXAdmision = [...this.lstListarXAdmision];
                await this.calculoDePruebasIgv();

                this.editarCampoMedico = true;
                this.editarCampoAseguradora = true;
                this.editarCampoEmpresa = true;
                // this.lastYearTotal = totala;
                // this.cantidad = cantidadExamenes;
                this.registroSeleccionado = null;
                this.verBtnAnular = true;
                this.colCard1 = "col-sm-3"
                this.colCard2 = "col-sm-6"
                this.editarCampos = true;
                this.editarDetallePrueba = true;
                this.editarDetallePrueba_check = true;
                this.editarCampoSevicio = false;
                this.loading = false;
              } else {
                Swal.fire({
                  icon: 'warning',
                  title: '¡Mensaje!',
                  text: `${res.mensaje}`
                })
              }

            }).catch(error => error)
        } else {
          this.toastMensaje(`${resPerfil.mensaje}`, 'warning', 3000);
          return;
        }
      }).catch(error => error);




    }
    else {
      console.log("DTO  admision", this.filtro);
      var serv = this.registroSeleccionado;
      this.dtofinal.Admision.TipoDocumento = this.filtro.TipoDocumento;
      this.dtofinal.Admision.Documento = this.filtro.Documento;
      this.dtofinal.Admision.NombreCompleto = this.filtro.NombreCompleto;
      this.dtofinal.Admision.fechanacimiento = new Date(this.filtro.FechaNacimiento);
      this.dtofinal.Admision.nombres = this.filtro.Nombres;
      this.dtofinal.Admision.apellidopaterno = this.filtro.ApellidoPaterno;
      this.dtofinal.Admision.apellidomaterno = this.filtro.ApellidoMaterno;
      this.dtofinal.Admision.sexo = this.filtro.Sexo;
      this.dtofinal.Admision.CorreoElectronico = this.filtro.CorreoElectronico;
      this.dtofinal.Admision.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
      this.dtofinal.Admision.TipoOperacionID = this.filtro.TipoOperacionID;
      this.dtofinal.Admision.Persona = this.filtro.Persona; //viene de un metodo persona
      this.dtofinal.Admision.FechaAdmision = new Date();
      this.dtofinal.Admision.HistoriaClinica = this.filtro.CodigoHC;
      this.dtofinal.Admision.NroPeticion = null;
      this.dtofinal.Admision.OrdenAtencion = this.filtro.OrdenAtencion;
      this.dtofinal.Admision.MedicoId = this.filtro.MedicoId;
      this.dtofinal.Admision.IdSede = this.getUsuarioAuth().data[0].IdSede;
      this.dtofinal.Admision.Estado = 1;
      this.dtofinal.Admision.FechaCreacion = new Date();
      this.dtofinal.Admision.FechaModificacion = new Date();
      this.dtofinal.Admision.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;//derrepente pasando nulo
      this.dtofinal.Admision.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
      this.dtofinal.Admision.IpCreacion = this.getIp();   //crear metodo que nos muestre la IP del usuario
      this.dtofinal.Admision.IpModificacion = this.getIp();  //crear metodo que nos muestre la IP del usuario
      this.dtofinal.Admision.IdEmpresaPaciente = this.filtro2.Persona;
      this.dtofinal.Admision.IdAseguradora = this.filtro.IdAseguradora;
      this.dtofinal.Admision.TipoOrden = this.filtro.TipoOrden;
      this.dtofinal.Admision.TipoAtencion = this.filtro.TipoAtencion;
      this.dtofinal.Admision.ClasificadorMovimiento = this.filtro.ClasificadorMovimiento;
      this.dtofinal.Admision.Cama = this.filtro.Cama;
      this.dtofinal.Admision.IdEspecialidad = this.filtro.IdEspecialidad;
      this.dtofinal.Admision.ObservacionAlta = this.filtro.ObservacionAlta;
      this.dtofinal.Admision.TIPOADMISIONID = 1;
      this.dtofinal.list_AdmisionServicio = [];
      serv.forEach(element => {
        var dtoAdmClini = new DtoAdmisionclinicaDetalle();
        dtoAdmClini.CodigoComponente = element.CodigoComponente;
        dtoAdmClini.Descripcion = element.Descripcion;
        dtoAdmClini.Cantidad = element.Cantidad;
        dtoAdmClini.Valor = element.Valor;
        dtoAdmClini.Estado = element.Estado;
        dtoAdmClini.Sexo = element.Sexo;
        dtoAdmClini.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario.trim();
        dtoAdmClini.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario.trim();
        dtoAdmClini.IpCreacion = this.getIp();
        dtoAdmClini.IpModificacion = this.getIp();
        this.dtofinal.list_AdmisionServicio.push(dtoAdmClini);
      });
      this.dtofinal.IndicadorWS = 0;

      this.bloquearPag = true;
      console.log("GuardarAdmision dtofinal insertar", this.dtofinal);
      this.pacienteClinicaService.ValidarComponentePerfil(1, this.dtofinal, this.getUsuarioToken()).then((resPerfil) => {
        this.bloquearPag = false;
        console.log("ValidarComponentePerfil :: ", resPerfil);
        if (resPerfil.valor == 1) {
          this.bloquearPag = true;
          this.loading = true;
          this.pacienteClinicaService.mantenimientoAdmisionClinica(1, this.dtofinal, this.getUsuarioToken()).then(
            async res => {
              this.bloquearPag = false;
              this.loading = false;
              console.log("data registrada:", res)
              this.toastMensaje(`${res.mensaje}`, 'warning', 3000);
              if (res.valor > 0) {
                this.admision = res.Admision;
                this.filtro.NroPeticion = res.Admision.NroPeticion;
                // this.filtro.Estado = res.Admision.Estado;
                // admision.Estado = res.Admision.Estado;
                if (res.list_AdmisionServicio[0].hasOwnProperty("CodigoComponente")) {
                  this.lstListarXAdmision = [];
                  for (let examenParaAgregar of res.list_AdmisionServicio) {
                    /**SE HACE EL CALCULO POR EL HECHO DE QUE EL VALOR VIENE EN DIFERENTE VARIABLE */
                    //examenParaAgregar.numeroXadmision = null; // si son nuevo, resultan estar en undefined
                    examenParaAgregar.valorBruto = examenParaAgregar.ValorEmpresa; // se agrega el valor de empresa
                    examenParaAgregar.ValorEmpresa = null; // se limpia por seguridad
                    let ExamenConIgv = examenParaAgregar.valorBruto * this.getUsuarioAuth().data[0].Igv;
                    examenParaAgregar.ValorEmpresa = examenParaAgregar.valorBruto + ExamenConIgv;
                    examenParaAgregar.ValorEmpresa = examenParaAgregar.ValorEmpresa * examenParaAgregar.Cantidad;
                    this.lstListarXAdmision.push({ ...examenParaAgregar });
                  }
                  this.lstListarXAdmision = [...this.lstListarXAdmision];
                  await this.calculoDePruebasIgv();

                  this.auditoria(res.Admision, 2);
                  this.editarCampoMedico = true;
                  this.editarCampoAseguradora = true;
                  this.editarCampoEmpresa = true;
                  this.registroSeleccionado = null;
                  this.verBtnAnular = true;
                  this.colCard1 = "col-sm-3"
                  this.colCard2 = "col-sm-6"
                  this.editarCampos = true;
                  this.editarDetallePrueba = true;
                  this.editarDetallePrueba_check = true;
                  this.editarCampoOA = true;
                  this.editarCampoSevicio = false;
                  this.admision = res.Admision;
                  this.filtro.NroPeticion = res.Admision.NroPeticion;
                  admision.Estado = res.Admision.Estado;
                  admision.DesEstado = res.Admision.DesEstado;
                }
              }
            });
        } else {
          this.toastMensaje(`${resPerfil.mensaje}`, 'warning', 3000);
          return;
        }
      }).catch(error => error);

    }

  }

  ValidateCMP() {
    if (this.filtro.CMP == "0" || this.esNumeroVacio(this.filtro.MedicoId)) {
      return "Esta guardando la petición con medico automático, ¿Desea continuar?"
    }
    return null;
  }

  ValidateFiles() {

    console.log(this.filtro.Telefono)
    if (this.esNumeroVacio(this.filtro.Telefono)) {


      return "El paciente no tiene un número de teléfono.";

    }
    if (this.estaVacio(this.filtro.CodigoHC)) {


      return "Seleccionar la historia clinica.";

    }
    if (this.filtro.MedicoId == null) {
      return "Debe seleccionar el Médico";
    }
    if (this.estaVacio(this.filtro.OrdenAtencion)) {


      return "Seleccionar la OA.";

    }
    // if (this.esNumeroVacio(this.filtro.MedicoId)) {


    //   return "Seleccionar al médico.";

    // }
    if (this.esNumeroVacio(this.filtro.MedicoId)) {
      return "Ingrese un médico";
    }

    if (this.estaVacio(this.filtro.NombreEmpresa)) {


      return "Seleccionar la aseguradora.";

    }
    // if (this.registroSeleccionado.length < 1) {


    if (this.esNumeroVacio(this.filtro.IdEspecialidad)) {


      return "Seleccionar la procedencia.";

    }
    if (this.esNumeroVacio(this.filtro.comboCliente)) {


      return "Seleccionar al cliente.";

    }
    if (this.estaVacio(this.filtro.TipoOrden)) {


      return "Seleccionar el tipo orden.";

    }
    if (this.esNumeroVacio(this.filtro.TipoAtencion)) {



      return "Seleccionar el tipo atención.";

    }
    /**
 * MOVI LA VALIDACION DE SELECCIONAR PRUEBAS
 */
    if (this.esListaVacia(this.registroSeleccionado)) {


      return "Seleccionar un servicio como minimo con estado pendiente antes de grabar la OA.";

    }
    if (this.esNumeroVacio(this.filtro.TipoOperacionID)) {

      return "Seleccionar el tipo operación.";

    }

    if (this.filtro.TipoDocumento == "D") {
      if (this.filtro.Documento.trim().length != 8) {
        return "El paciente no tiene un Documento correcto. = " + this.filtro.Documento;
      }
    }

    return null;
  }

  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }


  verSelectorPaciente(): void {

    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECPACIENTE', 'BUSCAR'), 'BUSCAR', 'N');
  }
  verSelectorMedico(): void {

    this.medicoBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECMEDICO', 'BUSCAR'), 'BUSCAR');
  }
  verSelectorAseguradora(): void {

    this.aseguradoraBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECASEGURADORA', 'BUSCAR'), 'BUSCAR');
  }
  verSelectorEmpresa(): void {

    this.empresaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECEMPRESA', 'BUSCAR'), 'BUSCAR');
  }
  verSelectorExamen(): void {

    this.examenBuscarComponent.coreIniciarComponenteBuscar(new MensajeController(this, 'BUSCEXAM', ''), 'BUSCAR', 1, this.filtro);


  }

  comboComboSexo() {
    this.lstSexo = [];
    this.lstSexo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "SEXO").forEach(i => {
      this.lstSexo.push({ label: i.Nombre, value: i.Codigo })

    });
  }
  comboComboTipoOrden() {
    this.lstTipoOrden = [];
    this.lstTipoOrden.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOORDEN").forEach(i => {
      this.lstTipoOrden.push({ label: i.Nombre, value: i.Codigo })
    });
    this.filtro.TipoOrden = "R";
    console.log("Clinica comboComboTipoOrden", this.lstTipoOrden);
  }

  selectedItemProcedencia(event) {
    var change = this.seleccionarItemMedicoTemp;
    if (this.filtro.MedicoId != null) {
      if (this.seleccionarItemMedicoTemp != event.value) {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: 'La procedencia seleccionada no pertenece al médico.'
        }).then((result) => {
          if (result.isConfirmed) {
            this.filtro.IdEspecialidad = change;
          } else if (result.isDenied) {


          }
        })
      }


    }
  }

  MostrarMedico(MedicoId) {
    var dtoadmin = new FiltroPacienteClinica();
    dtoadmin.MedicoId = MedicoId;
    return this.medicoService.listarpaginado(dtoadmin).then((res) => {
      console.log("mostrar medico", res)
      if (res[0].MedicoId == 0) {
        this.filtro.CMP = res[0].MedicoId;
      } else {
        this.filtro.CMP = res[0].CMP;
      }
      if (!this.estaVacio(res[0].Busqueda)) {
        this.filtro.Busqueda = res[0].Busqueda;
      } else {
        this.filtro.Busqueda = res[0].Nombres;
      }
      this.filtro.MedicoId = res[0].MedicoId;

    });

  }


  MostrarAseguradora(IdAseguradora) {
    console.log("ID LLEGANDO ASEGURADORA", IdAseguradora);
    // var tempdto = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
    var filtro = new dtoPersona();
    filtro.IdAseguradora = IdAseguradora;
    // let IdAseguradora = { IdAseguradora: this.filtro.IdAseguradora }

    // console.log("data listado ID ASEGURADORA:", IdAseguradora);

    return this.aseguradoraService.listarpaginado(filtro).then((res) => {
      console.log("mostrar aseguradora", res)
      this.filtro.IdAseguradora = res[0].IdAseguradora;
      this.filtro.NombreEmpresa = res[0].NombreEmpresa;
      this.filtro.TipoOrdenAtencion = res[0].TipoAseguradora;

    });
  }

  MostrarEmpresa(idpersona, id) {
    this.bloquearPag = true;
    var dtopersona = new dtoPersona();
    dtopersona.Persona = idpersona;

    return this.personaService.listarXPersona(dtopersona).then((res) => {
      //persona
      if (id == 1) {
        if (this.estaVacio(res[0].NombreCompleto)) {
          this.filtro.NombreCompleto = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`

        } else {
          this.filtro.NombreCompleto = res[0].NombreCompleto;
        }
        console.log("Clinica MostrarPersona: ", res);
        this.listadoHistoriaClinica(res[0].Persona);
        this.filtro.Documento = res[0].Documento;
        console.log("Clinica listarConsentimientoXdocumento TipoOperacionID: ", this.filtro.TipoOperacionID);

        this.listarConsentimientoXdocumento(res[0].Documento);
        this.filtro.CorreoElectronico = res[0].CorreoElectronico;
        this.filtro.Sexo = res[0].Sexo;
        this.filtro.FechaNacimiento = new Date(res[0].FechaNacimiento);
        this.CalcularAnios();
        this.filtro.Persona = res[0].Persona;
        this.filtro.TipoDocumento = res[0].TipoDocumento;
        this.filtro.Nombres = res[0].Nombres;
        this.filtro.ApellidoPaterno = res[0].ApellidoPaterno;
        this.filtro.ApellidoMaterno = res[0].ApellidoMaterno;
        this.filtro.Telefono = res[0].Telefono;
        console.log("el Telefono es: ", this.filtro.Telefono);
        this.bscPersona = null
        this.bscPersona = res[0];
        this.filtro.Comentario = res[0].Comentario;
        this.EstadoPersona = res[0].Estado;
      }
      //empresa
      if (id == 2) {
        this.filtro2.DocumentoFiscal = res[0].Documento;
        this.filtro2.NombreCompleto = res[0].NombreCompleto;
        this.filtro2.Persona = res[0].Persona;
      }
      this.bloquearPag = false;


    });


  }

  guardarOAmedico(oamedico) {
    console.log("IDMEDICO CONSULTAR OA", oamedico);
    var dtoadmin = new FiltroPacienteClinica();
    dtoadmin.MedicoId = oamedico;
    this.bloquearPag = true;
    return this.medicoService.listarpaginado(dtoadmin).then((res) => {
      this.bloquearPag = false;
      console.log("oa medico", res);
      if (res != null) {
        if (res[0].MedicoId == 0) {
          this.filtro.CMP = res[0].MedicoId;
        } else {
          this.filtro.CMP = res[0].CMP;
        }
        if (!this.estaVacio(res[0].Busqueda)) {
          this.filtro.Busqueda = res[0].Busqueda;
        } else {
          this.filtro.Busqueda = res[0].Nombres;
        }
        this.filtro.MedicoId = res[0].MedicoId;
      }

    });

  }

  guardarOAaseguradora(oaaseguradora) {

    var dtoadmin = new FiltroPacienteClinica();
    dtoadmin.IdAseguradora = oaaseguradora;

    this.bloquearPag = true;
    return this.aseguradoraService.listarpaginado(dtoadmin).then((res) => {
      this.bloquearPag = false;
      console.log("oa aseguradora", res);
      if (res != null) {
        this.filtro.IdAseguradora = res[0].IdAseguradora;
        this.filtro.NombreEmpresa = res[0].NombreEmpresa;
        this.filtro.TipoOrdenAtencion = res[0].TipoAseguradora;
      }



    });

  }

  guardarOAempresa(oaempresa) {

    var dtoadmin = new FiltroPacienteClinica();
    dtoadmin.Persona = oaempresa;
    this.bloquearPag = true;
    console.log("oa guardarOAempresa", oaempresa);
    return this.personaService.listarXPersona(dtoadmin).then((res) => {
      this.bloquearPag = false;
      if (res != null) {
        this.filtro2.DocumentoFiscal = res[0].Documento;
        this.filtro2.NombreCompleto = res[0].NombreCompleto;
        this.filtro2.Persona = res[0].Persona;
      }
    });

  }

  guardarOAPersona(oaempresa) {
    var dtoadmin = new FiltroPacienteClinica();
    dtoadmin.Persona = oaempresa;
    this.bloquearPag = true;

    return this.personaService.listarXPersona(dtoadmin).then((res) => {
      this.bloquearPag = false;
      if (res != null) {
        console.log("oa guardarOAPersona", res[0]);
        this.filtro.Documento = res[0].Documento;
        if (this.estaVacio(res[0].NombreCompleto)) {
          this.filtro.NombreCompleto = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`
        } else {
          this.filtro.NombreCompleto = res[0].NombreCompleto;
        }
        this.filtro.TipoDocumento = res[0].TipoDocumento;
        this.filtro.ApellidoMaterno = res[0].ApellidoMaterno;
        this.filtro.ApellidoPaterno = res[0].ApellidoPaterno;
        this.filtro.Nombres = res[0].Nombres;
        this.filtro.Persona = res[0].Persona;
        this.filtro.Telefono = res[0].Telefono;
        this.filtro.Comentario = res[0].Comentario;
        this.filtro.DocumentoFiscal = res[0].DocumentoFiscal;
        this.EstadoPersona = res[0].Estado;
        this.bscPersona = null;
        this.bscPersona = res[0];

      }
    });
  }

  grillaCargarDatos(event: LazyLoadEvent) {
    var tempfiltro = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
    console.log("grillaCargarDatos JSON.parse", tempfiltro)

    this.xadmision.IdAdmision = tempfiltro.IdAdmision;

    let idAdmision = { IdAdmision: this.xadmision.IdAdmision }
    this.loading = true;
    return this.consultaAdmisionService.listarXadmision(idAdmision).then((res) => {
      this.loading = false;
      this.filtro.TipoAtencion = res.Admision.TipoAtencion;
      this.filtro.ObservacionAlta = res.Admision.ObservacionAlta;
      this.filtro.CoaSeguro = res.Admision.CoaSeguro;
      this.filtro.CorreoElectronico = res.Admision.CorreoElectronico;
      this.filtro.Telefono = res.Admision.Telefono;
      console.log("grillaCargarDatos", res)
      //this.disableBtnGuardar = false;
      if (res.Admision.IdEspecialidad != null) {
        this.filtro.IdEspecialidad = res.Admision.IdEspecialidad;
        // this.seleccionarItemMedicoTemp = tempfiltro.IdEspecialidad;
      } else {
        this.filtro.IdEspecialidad = 0;
        // this.seleccionarItemMedicoTemp = 0;
      }
      this.filtro.TipoAtencion = res.Admision.TipoAtencion;
      if (res.Admision.TipoAtencion == 2) {
        this.editarCampoNroCama = false;
      } else {
        this.editarCampoNroCama = true;
      }
      // this.bscPersona = res.Admision
      // console.log("valor pasando", this.bscPersona)
      this.contarExamenes = res.list_AdmisionServicio.length;
      var cantidadExamenes = 0;
      res.list_AdmisionServicio.forEach(element => {

        element.numeroXadmision = this.contado++;
        // var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
        // element.Valor = element.ValorEmpresa + ExamenConIgv;
        cantidadExamenes += element.Cantidad;
        element.ValorEmpresa = element.Valor * element.Cantidad;
        this.total += element.ValorEmpresa;
        this.lstListarXAdmision.push(element);
      });
      this.cantidad = cantidadExamenes;
      // this.cantidad = this.lstListarXAdmision.length;
      this.seleccionarItemPacienteTemp = this.filtro.TipoOperacionID;
      this.lastYearTotal = this.total;
    });

  }

  revertir() {
    // this.soap.createClient('./assets/calculator.wsdl')
    // .then(client => {
    //   console.log('Client', client);
    //   this.client = client;
    // })
    // .catch(err => console.log('Error', err));


    this.pacienteClinicaService.listarConsultaOa().then((res) => {
      console.log("response service::", res);
    });


  }

  eliminarprueba() {
    this.Auth = this.getUsuarioAuth();
    var prueba = this.Auth.data;
    console.log("datos del auth", prueba);
  }

  coreEliminar() {
    // filtro.accion="DELETE"
    // this.router.navigate(["precisa/admision/co_admisionclinica", this.ACCIONES.ELIMINAR, JSON.stringify(filtro)], { skipLocationChange: true });
  }

  comboCargarSedeEmpresa(IdEmpresa: number): Promise<number> {
    this.lstSedeEmpresa.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.consultaAdmisionService.listarAdmisionSede(IdEmpresa).then(resp => {
      resp.forEach(e => {
        this.lstSedeEmpresa.push({ label: e.SedDescripcion, value: e.IdSede });
        this.filtro.IdSedeEmpresa = e.IdSede;
      });
      return 1;
    });
  }

  comboCargarTipoOperacion(): Promise<number> {
    console.log("Clinica this.filtro", this.filtro);
    this.operacion.TipEstado = 1;
    this.operacion.TIPOADMISIONID = 1;
    this.operacion.Persona = this.filtro.comboCliente;
    this.operacion.IdSede = this.filtro.IdSede;
    this.lstTipoOperacion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.consultaAdmisionService.listarcombotipooperacion(this.operacion).then(resp => {
      resp.forEach(e => {
        this.lstTipoOperacion.push({ label: e.Descripcion, value: e.TipoOperacionID });
      });
      console.log("Clinica comboCargarTipoOperacion", this.lstTipoOperacion);
      if (this.lstTipoOperacion.length > 1) {
        this.filtro.TipoOperacionID = resp[0].TipoOperacionID;
        this.valorTipoPacienteId = resp[0].TipoOperacionID;
        this.IdConsentimiento = resp[0].FlaCon;
        this.seleccionarItemPacienteTemp = this.filtro.TipoOperacionID;
        sessionStorage.setItem('EntyOperacion', JSON.stringify(resp));
        this.listaPerfil();
      }
      return 1;
    });
  }

  comboCargarCliente(): Promise<number> {
    this.lstcliente = [];
    this.Auth = this.getUsuarioAuth();
    var client = this.Auth.data;
    this.cliente.UneuNegocioId = client[0].UneuNegocioId;
    this.cliente.TipEstado = 1;
    this.cliente.IdSede = client[0].IdSede;
    this.filtro.IdSede = this.cliente.IdSede;
    this.cliente.TIPOADMISIONID = 1;
    this.lstcliente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    var listaComboliente = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('comboCliente')));
    if (!this.esListaVacia(listaComboliente)) {
      listaComboliente.forEach(e => {
        this.lstcliente.push({ label: e.empresa, value: e.Persona });
        this.filtro.comboCliente = e.Persona;
        this.valorCliente = e.Persona;
      });
    } else {
      return this.consultaAdmisionService.listarcombocliente(this.cliente).then(resp => {
        resp.forEach(e => {
          this.lstcliente.push({ label: e.empresa, value: e.Persona });
          this.filtro.comboCliente = e.Persona;
          this.valorCliente = e.Persona;
        });
        sessionStorage.setItem('comboCliente', JSON.stringify(resp));
        console.log("Clinica lista cliente", JSON.stringify(resp));
        console.log("sessionStorage cliente", sessionStorage);
        return 1;
      });
    }
  }

  comboCargarServicios(): Promise<number> {
    this.Auth = this.getUsuarioAuth();
    var service = this.Auth.data;
    this.servicio.Estado = 1;
    this.lstServicio.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.examenService.serviciopaginado(this.servicio).then(resp => {
      resp.forEach(e => {
        this.lstServicio.push({ label: e.Nombre, value: e.ClasificadorMovimiento.trim() });
        // this.filtro.ClasificadorMovimiento = service[0].ClasificadorMovimiento
      });
      this.filtro.ClasificadorMovimiento = service[0].ClasificadorMovimiento;
      console.log("Clinica combo ClasificadorMovimiento", resp);
      console.log("combo ClasificadorMovimiento", service[0]);
      return 1;
    });

  }

  comboCargarTipoAtencion() {
    this.lstTipoAtencion = [];
    this.lstTipoAtencion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOATENCION").forEach(i => {
      this.lstTipoAtencion.push({ label: i.Nombre, value: i.IdCodigo })
    });
    this.filtro.TipoAtencion = this.getUsuarioAuth().data[0].TipoAtencion != null ? this.getUsuarioAuth().data[0].TipoAtencion : 1;
  }

  //Procedencia cambiar nombre
  comboCargarProcendia() {
    this.lstprocedencia = [];
    var lstComboprocedencia = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('access_Procendencia')));
    if (!this.esListaVacia(lstComboprocedencia)) {
      this.lstprocedencia.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      lstComboprocedencia.forEach(e => {
        this.lstprocedencia.push({ label: e.Nombre, value: e.IdEspecialidad });
      });
      console.log("Clinica combo CargarProcendia", this.lstprocedencia);
      this.filtro.IdEspecialidad = 0;
    }
  }

  llamarPersona() {
    let Documento = {
      Documento: this.filtro.Documento.trim(),
      tipopersona: "P",
      SoloBeneficiarios: "0",
      UneuNegocioId: "0"
    }
    return this.personaService.listaPersonaUsuario(Documento).then((res) => {
      this.bscPersona = res[0];
      this.filtro.Telefono = res[0].Telefono;
    });

  }

  esCodigoExamenValido(event) {
    if (this.filtro.ClasificadorMovimiento != "04") {
      let key;
      if (event.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
      } else {
        key = event.keyCode;
        key = String.fromCharCode(key);
      }
      const regex = /[0-9]|\./;
      if (!regex.test(key)) {
        event.returnValue = false;
        if (event.preventDefault) {
          event.preventDefault();
        }
      }
    }
  }


  validarTeclaEnterPaciente(evento) {
    if (evento.key == "Enter") {
      if (this.filtro.Documento == null) {
        this.toastMensaje('Ingrese un Nro. de documento', 'warning', 3000);
      }
      else if (this.filtro.Documento.trim().length <= 4) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
        this.filtro.Documento = null;
      } else {
        this.getPersonaServicio(this.filtro.Documento.trim(), 2);
      }
    }
  }


  OnBlurMethod() {
    var cantidadExamenes = 0
    var total = 0
    this.cantidad = 0

    this.lstListarXAdmision.forEach(e => {
      if (e.Cantidad <= 0 || this.esNumeroVacio(e.Cantidad)) {
        e.Cantidad = 1;
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: 'Cantidad ingresada no valida',
          confirmButtonColor: '#094d74',
          confirmButtonText: 'OK'
        })
      }
      cantidadExamenes += e.Cantidad;
      e.ValorEmpresa = e.Cantidad * e.Valor;
      total += e.ValorEmpresa;
    });
    this.cantidad = cantidadExamenes;
    this.lastYearTotal = total

  }

  esCantidad(event) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
    if (!regex.test(key)) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  }


  listarConsentimientoXdocumento(documento: string) {
    let Documento = {
      Documento: documento
    }
    this.bloquearPag = true;
    return this.personaService.listaConsentimiento(Documento).then((res) => {
      this.bloquearPag = false;
      console.log("Clinica listaConsentimiento Respuesta ", res);
      if (!this.estaVacio(res[0].msn)) {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          confirmButtonColor: '#094d74',
          text: res[0].msn,
        }).then((result) => {
          if (result.isConfirmed) {
            this.filtro.consentimiento = res[0].msn;
          } else {
            this.filtro.consentimiento = res[0].msn;
          }
        })
      }
    }).catch(error => error);
  }


  showSuccessMessage(message: string): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message
    });
  }

  showErrorMessage(message: string): Promise<any> {
    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  }


  getPersonaServicio(documento: any, validator: number) {
    console.log("mensaje documento", documento);
    let dto = {
      Documento: documento.trim(),
      tipopersona: "P",
      SoloBeneficiarios: "0",
      UneuNegocioId: "0"
    }
    return this.personaService.listaPersonaUsuario(dto).then((res) => {
      console.log("mensaje del res", res);
      console.log("dataaaa", res.length);
      this.bloquearPag = false;
      if (res.length > 0) {
        if (validator == 1) {
          this.bscPersona = null;
          this.bscPersona = res[0];
          this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONAEDITAR', ''), "EDITAR", 1, this.bscPersona);
        } else {

          if (this.estaVacio(res[0].NombreCompleto)) {
            console.log("Documento ==", res);
            this.filtro.NombreCompleto = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`

          } else {
            console.log("Documento !=", res);
            this.filtro.NombreCompleto = res[0].NombreCompleto;
          }
          this.disableBtnGuardar = true;
          this.listadoHistoriaClinica(res[0].Persona);
          this.filtro.Documento = res[0].Documento;

          console.log("Clinica listarConsentimientoXdocumento IdConsentimiento ", this.IdConsentimiento);
          if (this.IdConsentimiento == 1) {
            this.listarConsentimientoXdocumento(res[0].Documento);
          }
          this.filtro.CorreoElectronico = res[0].CorreoElectronico;
          this.filtro.Comentario = res[0].Comentario;
          this.filtro.Sexo = res[0].Sexo;
          this.filtro.FechaNacimiento = new Date(res[0].FechaNacimiento);
          this.CalcularAnios();
          this.filtro.Persona = res[0].Persona;
          this.filtro.TipoDocumento = res[0].TipoDocumento;
          this.filtro.Nombres = res[0].Nombres;
          this.filtro.ApellidoPaterno = res[0].ApellidoPaterno;
          this.filtro.ApellidoMaterno = res[0].ApellidoMaterno;
          this.filtro.Telefono = res[0].Telefono;

          //*SE AGREGA LA VALIDACION DE ESTADO PERSONA */
          this.EstadoPersona = res[0].Estado;

          this.bscPersona = null;
          this.bscPersona = res[0];
          if (this.filtro.ClasificadorMovimiento == "02") {
            this.editarCantidad = false;
          }
          console.log("llenar listaPersonaUsuario: ", this.filtro);

        }

        this.editarCampos = false;
        this.editarDetallePrueba = false;
        this.editarDetallePrueba_check = false;
        this.editarCampoOA = false;
        this.editarCampoSevicio = false;
        this.editarCamposAutomaticos = true;
        this.editarCampoNroCama = true;
        this.editarCampoDocumento = true;
        this.editarCampoMedico = false;
        this.editarCampoAseguradora = false;
        this.editarCampoEmpresa = false;
        this.disableBtnGuardar = true;

      } else {
        console.log("entroo nadaaa");
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
        this.filtro.Documento = null;
      }
    }).catch(error => error);

  }

  validarEnterMedico(evento) {
    var filtro = new FiltroPacienteClinica();
    if (evento.key == "Enter") {
      if (this.filtro.CMP == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      } else {
        if (this.filtro.CMP.trim() == "0") {
          filtro.MedicoId = 0;
        } else {
          filtro.MedicoId = -1;
          filtro.Estado = 1;
          filtro.CMP = this.filtro.CMP.trim();
        }
        this.bloquearPag = true;
        this.medicoService.listarpaginado(filtro).then((res) => {
          this.bloquearPag = false;
          if (res.length >= 1) {
            if (!this.estaVacio(res[0].Busqueda)) {
              this.filtro.Busqueda = res[0].Busqueda;
            } else {
              this.filtro.Busqueda = res[0].Nombres
            }
            this.filtro.MedicoId = res[0].MedicoId;
            this.editarCampoMedico = true;
          } else {
            this.filtro.CMP = null;
            this.filtro.Busqueda = null;
            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
          }
        });

      }
    }
  }

  servicioListarMedico(filtro: FiltroPacienteClinica) {
    this.medicoService.listarpaginado(filtro).then((res) => {

      if (res.length >= 1) {

        this.bloquearPag = true;
        console.log("enter medico", res);
        this.filtro.CMP = res[0].CMP;
        if (!this.estaVacio(res[0].Busqueda)) {
          this.filtro.Busqueda = res[0].Busqueda;
        } else {
          this.filtro.Busqueda = res[0].Nombres;
        }

        this.filtro.MedicoId = res[0].MedicoId;
        this.editarCampoMedico = true;

      } else {
        this.filtro.CMP = null;
        this.filtro.Busqueda = null;
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      }


    });
  }

  validarEnterAseguradora(evento) {
    var filtro = new FiltroPacienteClinica();

    if (evento.key == "Enter") {
      if (this.filtro.IdAseguradora == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      } else if (String(this.filtro.IdAseguradora).length <= 7) {
        this.bloquearPag = true;
        filtro.IdAseguradora = this.filtro.IdAseguradora;
        filtro.Estado = 1;
        this.aseguradoraService.listarpaginado(filtro).then((res) => {
          // this.filtro.NombreCompleto = `${res[0].ApellidoPaterno} ${res[0].ApellidoMaterno}, ${res[0].Nombres}`
          if (res.length == 1) {
            console.log("enter aseguradora", res)
            this.filtro.NombreEmpresa = res[0].NombreEmpresa;
            this.filtro.TipoOrdenAtencion = res[0].TipoAseguradora;
            this.editarCampoAseguradora = true;
            this.bloquearPag = false;
          } else {
            this.bloquearPag = false;
            this.filtro.IdAseguradora = null
            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
          }
        });
      } else {
        this.filtro.IdAseguradora = null
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
      }
    }
  }

  validarEnterEmpresa(evento) {
    var filtro = new FiltroPacienteClinica();
    if (evento.key == "Enter") {
      this.bloquearPag = true;
      if (this.filtro2.DocumentoFiscal == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
        this.bloquearPag = false;
      } else if (this.filtro2.DocumentoFiscal.trim().length == 11 || this.filtro2.DocumentoFiscal == "0") {
        let dto = {
          Documento: this.filtro2.DocumentoFiscal.trim(),
          tipopersona: "J",
          TipoDocumento: "R",
          Estado: "A"
        }
        this.personaService.listarpaginado(dto).then((res) => {
          console.log("enter empresa", res)
          if (res.length > 0) {
            this.filtro2.NombreCompleto = res[0].NombreCompleto;
            this.filtro2.Persona = res[0].Persona;
            this.editarCampoEmpresa = true;
            this.bloquearPag = false;
          } else {
            this.bloquearPag = false;
            this.filtro2.DocumentoFiscal = null;
            this.filtro2.NombreCompleto = null;
            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
          }
        });
      }
      else {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
        this.bloquearPag = false;
        this.filtro2.DocumentoFiscal = null;
        this.filtro2.NombreCompleto = null;

      }
    }
  }


  listPerfil: SelectItem[] = [];

  listaPerfil() {
    var filtro
    filtro = {
      UneuNegocioId: this.getUsuarioAuth().data[0].UneuNegocioId,
      MosEstado: 1,
      TipoOperacionID: this.filtro.TipoOperacionID
    }
    this.consultaAdmisionService.listarModeloServicio(filtro).then(resp => {
      this.listPerfil = resp;
      if (!this.esListaVacia(this.listPerfil)) {
        console.log("Clinica listaPerfil", resp[0].ModeloServicioId);
        this.modeloSevicioId = resp[0].ModeloServicioId;
      }
    });
  }

  async validarTeclaEnterExamen(evento) {
    if (evento.key == "Enter") {

      if (this.estaVacio(this.filtro.CodigoComponente)) {
        this.toastMensaje('Debe ingresar el codigo del Examen.', 'success', 2000);
        this.bloquearPag = false;
        this.filtro.CodigoComponente = null;
        return;
      }
      if (this.filtro.CodigoComponente.length < 6) {
        this.toastMensaje('Debe ingresar el codigo del Examen. Correcto', 'success', 2000);
        this.bloquearPag = false;
        this.filtro.CodigoComponente = null;
        return;
      }
      var validado = 0;
      // var total = 0;
      var cantidadExamenes = 0;
      this.contarExamenes = this.lstListarXAdmision.length;
      this.examen.Estado = 1;
      this.examen.TipoOperacionID = this.filtro.TipoOperacionID;
      this.examen.empresa = this.filtro.Persona;
      this.examen.ModeloServicioId = this.modeloSevicioId;
      this.examen.CodigoComponente = this.filtro.CodigoComponente.trim();
      this.examen.ClasificadorMovimiento = this.filtro.ClasificadorMovimiento;
      console.log("filtro validarTeclaEnterExamen", this.filtro)
      this.examenService.examenpaginado(this.examen).then(async (res) => {

        this.loading = true;
        if (res.length == 0 || res.length == null) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Examen no encontrado, revise bien los parametros', life: 3000 })
          this.filtro.CodigoComponente = null;
          return;
        }

        for (let examenParaAgregar of res) {
          if (!examenParaAgregar.hasOwnProperty("CodigoComponente")) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Examen no encontrado, revise bien los parametros', life: 3000 })
            this.loading = false;
            this.filtro.CodigoComponente = null;
            return;
          }
          if (examenParaAgregar.Sexo != "A") {
            if (examenParaAgregar.Sexo != this.filtro.Sexo) {
              Swal.fire({
                icon: 'warning',
                title: '¡Mensaje!',
                text: 'El Paciente es de sexo distinto al del examen'
              });
              //  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El Paciente es de sexo distinto al del examen', life: 3000 })
              this.loading = false;
            }
          }

          for (let examenEnDetalle of this.lstListarXAdmision) {
            if (examenParaAgregar.CodigoComponente == examenEnDetalle.CodigoComponente) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Existen Campos repetidos', life: 3000 })
              this.loading = false;
              this.filtro.CodigoComponente = null;
              return;
            }
          }
          this.lstListarXAdmision.push({ ...examenParaAgregar });
        }
        this.lstListarXAdmision = [...this.lstListarXAdmision];
        console.log("List validarTeclaEnterExamen", this.lstListarXAdmision)
        await this.calculoDePruebasIgv();
        this.loading = false;
        this.filtro.CodigoComponente = null;
        this.seleccionarItemPacienteTemp = this.filtro.TipoOperacionID;
        this.seleccionarItemServicioTemp = this.filtro.ClasificadorMovimiento;

      });

    }
  }

  mostrarMensajeInfo(mensaje: string): void {
    this.mostrarMensaje(mensaje, 'info');
  }

  mostrarMensaje(mensaje: string, tipo: string): void {
    this.messageService.clear();
    this.messageService.add({ severity: tipo, summary: 'Mensaje', detail: mensaje });
  }

}

