import { Component, OnInit, ViewChild } from '@angular/core';
import { PendienteAprobacionDetalleComponent } from './components/pendiente-aprobacion-detalle.component';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { MensajeController } from '../../../../../util/MensajeController';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { filtroExpediente } from '../../../liquidacion/liquidacion_form/model/filtro.Expediente';
import { FiltroServicio } from '../../../framework-comun/Examen/dominio/filtro/FiltroExamen';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { LiquidacionService } from '../../../liquidacion/liquidacion_form/service/liquidacion.services';
import { ExamenService } from '../../../framework-comun/Examen/servicio/Examen.service';
import { PersonaBuscarComponent } from '../../../framework-comun/Persona/components/persona-buscar.component';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { ConsultaAdmisionService } from '../../../admision/consulta/servicio/consulta-admision.service';
import { TipoAdmisionService } from '../../../maestros/TipoAdmision/services/TipoAdmision.services';
import { dtoExpediente } from '../../../liquidacion/liquidacion_form/model/dtoExpediente';
import Swal from 'sweetalert2';
import { convertDateStringsToDates } from '../../../framework/funciones/dateutils';
import { LoginService } from '../../../auth/service/login.service';
import { FiltroTipoOperacion } from '../../../admision/consulta/dominio/filtro/FiltroConsultaAdmision';

@Component({
  selector: 'ngx-pendiente-aprobacion',
  templateUrl: './pendiente-aprobacion.component.html',
  styleUrls: ['./pendiente-aprobacion.component.scss']
})
export class PendienteAprobacionComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
   @ViewChild(PendienteAprobacionDetalleComponent, { static: false }) PendienteAprobacionDetalleComponent: PendienteAprobacionDetalleComponent;
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;

  
  Auth: UsuarioAuth = new UsuarioAuth();
  disableBtnGuardar:  boolean;
  bloquearPag:  boolean;
  editarCampos: boolean;
  editarCampoEmpresa: boolean;
  seleccion:    any;
  filtro: filtroExpediente = new filtroExpediente();
  dte: dtoExpediente = new dtoExpediente();

  lstExpediente: any[] = [];
  lstEstado: SelectItem[] = [];
  lstTipoAdmision: SelectItem[] = [];
  lstClasificadorMovimiento: SelectItem[] = [];
  lstSede: SelectItem[] = [];
  lstTipoPaciente: SelectItem[] = [];
  servicio: FiltroServicio = new FiltroServicio();

  constructor(
    private personaService: PersonaService,
    private LiquidacionService: LiquidacionService,
    private examenService: ExamenService,
    private consultaAdmisionService: ConsultaAdmisionService,
    private loginService: LoginService, 
    private tipoAdmisionService: TipoAdmisionService,
    private toastrService: NbToastrService) {
    super();
  }

  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
    const p3 = this.listaComboClasificadorMovimiento();
    const p1 = this.ListarTipoAdmision();
    const p2 = this.comboCargarSedes();
    const p4 = this.comboCargarTipoPaciente();
    
    Promise.all([p1,p2,p3]).then(resp => {
      this.fechaActual();
      this.bloquearPag = false;
    });
  }

  coreDetalle(): void {
    console.log("::Click modal:::");
  }


  coreNuevo(): void {
     console.log("::Click modal:::");
   // this.PendienteAprobacionBuscarComponent.coreIniciarComponenteDetalle(new MensajeController(this, 'NUEVO', ''), 'NUEVO',);
  }


  coreEditar(){
    if (this.seleccion == null) {
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: `Debe seleccionar un registro.`
      });
      return;
    }

    if (this.seleccion != null) {
      this.PendienteAprobacionDetalleComponent.coreIniciarComponenteDetalle(new MensajeController(this, 'CONDETA', ''), 'DETALLE', this.seleccion);

    }

  }

  onRowSelect(event: any) {
    console.log("seleccion:", event);
    console.log("seleccion variable:", this.seleccion);

  }

  async coreBuscar() {
    this.bloquearPag = true;
    this.filtro.Estado=1;
    this.filtro.TipoExpediente=3;
    console.log("Expediente coreBuscar:", this.filtro);
    this.LiquidacionService.ListarExpedienteParticulares(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = res.length;
      res.forEach((element) => {
        element.num = contado--;
      });
      this.lstExpediente = res;
      console.log("Expediente coreBuscar listado:", res);
    });
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

  fechaActual() {
    var hoy = new Date();
    var dia = hoy.getDate();
    var mes = hoy.getMonth() + 1;
    var anio = hoy.getFullYear();
    this.filtro.FechaInicio =  new Date(`${anio},${mes},${dia}`);
    this.filtro.FechaFinal = new Date(hoy);
    console.log("fechaActual creacion", this.filtro.FechaInicio);
  }

  private ListarTipoAdmision() {
    this.lstTipoAdmision = [];
    const objtipoAdmision = { Estado: 1 };
    this.lstTipoAdmision.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.tipoAdmisionService.ListaTipoAdmision(objtipoAdmision).then((lista) => {
      this.lstTipoAdmision = [...this.lstTipoAdmision, ...lista.map((item) => { return { label: item.AdmDescripcion.toLocaleUpperCase(), value: item.TipoAdmisionId } })]
    });
  }

  listaComboClasificadorMovimiento(): Promise<number> {
    this.Auth = this.getUsuarioAuth();
    var service = this.Auth.data;
    this.servicio.Estado = 1;
    this.lstClasificadorMovimiento.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.examenService.serviciopaginado(this.servicio).then(resp => {
      sessionStorage.setItem('access_ClasificadorMovimiento', JSON.stringify(resp));
      resp.forEach(e => {
        this.lstClasificadorMovimiento.push({ label: e.Nombre, value: e.ClasificadorMovimiento });
      });
      this.filtro.ClasificadorMovimiento = service[0].ClasificadorMovimiento;
      console.log("Liq listaComboClasificadorMovimiento", resp);
      return 1;
    });
  }

  private comboCargarTipoPaciente() {
    this.lstTipoPaciente = [];
    const filtroData: FiltroTipoOperacion = { TipEstado: 1, TIPOADMISIONID: 3, };
    this.lstTipoPaciente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.consultaAdmisionService.listarcombotipooperacion(filtroData).then((lista) => {
    this.lstTipoPaciente = [...this.lstTipoPaciente, ...lista.map((item) => { return { label: item.Descripcion.toLocaleUpperCase(), value: item.TipoOperacionID } })]
    });
  }

  comboCargarSedes(): Promise<number> {
    this.Auth = this.getUsuarioAuth();
    var prueba = this.Auth.data;

    let Objsedes = { IdEmpresa: 75300, SedEstado: 1 }
    this.lstSede.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    var listaCombosedes = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('access_sedes')));
    if (this.lstSede != null) {
      listaCombosedes.forEach(e => {
        this.lstSede.push({ label: e.SedDescripcion, value: e.IdSede });
        this.filtro.IdSede = prueba[0].IdSede
      });
    }
    else {
      return this.loginService.listarSedes(Objsedes).then(
        sedes => {
          if (sedes.length > 0) {
            sedes.forEach(obj => this.lstSede.push({ label: obj.SedDescripcion, value: obj.IdSede }));
            this.filtro.IdSede = prueba[0].IdSede
            console.log("Consulta Admision comboCargarSedes", sedes)
          }
          return 1
        }
      )
    }
  }
 
 validarEnterPaciente(evento) { 
  if (evento.key == "Enter" || evento.key == "Tab") {
      this.bloquearPag = true;
      if (this.filtro.DocumentoFiscal == null) {
        this.toastMensaje('Ingrese un Nro. de documento', 'warning', 3000);
        this.bloquearPag = false;
        return
        }

      if (this.filtro.DocumentoFiscal.trim().length <= 4) {
          this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
          this.filtro.DocumentoFiscal = null;
          this.bloquearPag = false;
          return
        } 
  
      let dtoPersona = {
        Documento: this.filtro.DocumentoFiscal.trim(),
        tipopersona: "P",
        SoloBeneficiarios: "0",
        UneuNegocioId: "0"
      }

      this.personaService.listarpaginado(dtoPersona).then((res) => {
        console.log("enter Paciente", res)
        if (res.length > 0) 
        {
          this.filtro.NombreCompleto = res[0].NombreCompleto;
          this.filtro.IdClienteFacturacion = res[0].Persona;
          this.editarCampoEmpresa = true;
          this.bloquearPag = false;
        } else {        
            this.bloquearPag = false;
            this.filtro.DocumentoFiscal = null;          
          this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
        }
      });
    } 
}

limpiarPaciente() {
  this.filtro.IdClienteFacturacion = null;
  this.filtro.DocumentoFiscal = null;
  this.filtro.NombreCompleto = null;
  this.editarCampoEmpresa = false;
}

verSelectorPaciente(): void {
  this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECPACIENTE', 'BUSCAR'), 'BUSCAR','N');
}

}
