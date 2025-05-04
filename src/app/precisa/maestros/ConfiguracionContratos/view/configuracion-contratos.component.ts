import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService, SelectItem, MenuItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { AppSatate } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { ConfiguracionContratosMantenimientoComponent } from '../components/configuracion-contratos-mantenimiento.component';
import { filtroTipoOperacion } from '../model/Filtro.TipoOperacion';
import { tipoOperacion } from '../model/TipoOperacion';
import { TipoOperacionService } from '../services/TipoOperacion.services';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
import { TipoAdmisionService } from '../../TipoAdmision/services/TipoAdmision.services';
import { TipoPacienteService } from '../../TipoPaciente/services/TipoPaciente.Services';
import { ITipoOperacion } from '../model/ITipoOperacion';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { EmpresaBuscarComponent } from '../../../framework-comun/Empresa/view/empresa-buscar.component';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { convertDateStringsToDates } from '../../../framework/funciones/dateutils';
import { LoginService } from '../../../auth/service/login.service';

@Component({
  selector: 'ngx-configuracion-contratos',
  templateUrl: './configuracion-contratos.component.html',
  styleUrls: ['./configuracion-contratos.component.scss']
})
export class ConfiguracionContratosComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController{
  @ViewChild(ConfiguracionContratosMantenimientoComponent, { static: false }) configuracionContratosMantenimientoComponent: ConfiguracionContratosMantenimientoComponent;
  @ViewChild(EmpresaBuscarComponent, { static: false }) empresaBuscarComponent: EmpresaBuscarComponent;
  bloquearPag: boolean;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  editarCampos: boolean = false;
  editarCampoEmpresa: boolean = true;

  lstTipoAdmision: SelectItem[] = [];
  lstTipoPaciente: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  ltsExportar: MenuItem[];
  lstsedes: SelectItem[] = [];

  lstTipoOperacion: any[] = [];
  filtro: filtroTipoOperacion = new filtroTipoOperacion();
  Entydad: tipoOperacion = new tipoOperacion();

  constructor(
    private exportarService: ExportarService,
    private messageService: MessageService,
    private loginService: LoginService,
    private confirmationService: ConfirmationService,
    private TipoAdmisionService: TipoAdmisionService,
    private TipoPacienteService: TipoPacienteService,    
    private TipoOperacionService: TipoOperacionService, 
    private personaService: PersonaService,        
    private store: Store<AppSatate>) {
    super();
  }
  btnEliminar?: boolean;
  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }

coreMensaje(mensage: MensajeController): void {
    console.log("coreMensaje llegando:", mensage.componente);
    if (mensage.componente == "SELECEMPRESA") {
      this.filtro.empresa = mensage.resultado.NombreCompleto;
      this.filtro.RucEmpresa = mensage.resultado.Documento;
      this.filtro.Persona = mensage.resultado.Persona;
      this.editarCampoEmpresa = true;
      this.bloquearPag = false;
    }
  }

coreNuevo(): void {
    this.configuracionContratosMantenimientoComponent.iniciarComponente(new MensajeController(this, 'SELECTOR_NUEVO', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo, this.Entydad)
  }

coreVer(dto): void {
    console.log("llego coreVer  ", dto);
    this.configuracionContratosMantenimientoComponent.iniciarComponente(new MensajeController(this, 'SELECTOR_VER', ''), "VER", "CONTRATO", dto)
  }

coreEditar(dto): void {
    console.log("llego coreEditar  ", dto);
    this.configuracionContratosMantenimientoComponent.iniciarComponente(new MensajeController(this, 'SELECTOR_EDITAR', ''), "EDITAR", "CONTRATO", dto)
  }


async coreinactivar(dtoInactivar) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm",
      accept: async () => {
        /**AUDITORIA*/
        dtoInactivar.UltimoUsuario = this.getUsuarioAuth().data[0].Documento;
        dtoInactivar.UltimaFechaModif = new Date();
        dtoInactivar.IpModificacion = this.getIp();
        dtoInactivar.TipEstado = 2;
        console.log("llego coreinactivar  ", dtoInactivar);
        const respInactivar = await this.TipoOperacionService.MantenimientoTipoOperacion(ConstanteUI.SERVICIO_SOLICITUD_INACTIVAR, dtoInactivar, this.getUsuarioToken());
        if (respInactivar != null) {
          if (respInactivar.success) {
            this.messageShow('success', 'success', this.getMensajeInactivo());
            this.coreBuscar();
          } else {
            this.messageShow('warn', 'Advertencia', this.getMensajeErrorinactivar());
          }
        } else {
          this.messageShow('warn', 'Advertencia', this.getMensajeErrorinactivar());
        }
      },
    });
  }

verSelectorEmpresa(): void {
    this.empresaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECEMPRESA', 'BUSCAR'), 'BUSCAR');
  }

 validarEnterEmpresa(evento) {   
    if (evento.key == "Enter") {
      this.bloquearPag = true;
      if (this.filtro.RucEmpresa == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
        this.bloquearPag = false;
      } else if (this.filtro.RucEmpresa.trim().length == 11 || this.filtro.RucEmpresa == "0") {
        let dto = {
          Documento: this.filtro.RucEmpresa.trim(),
          tipopersona: "J",
          TipoDocumento: "R",
          Estado: "A"
        }
        this.personaService.listarpaginado(dto).then((res) => {
          console.log("enter empresa", res)
          if (res.length > 0) {
            this.filtro.empresa = res[0].NombreCompleto;
            this.filtro.Persona = res[0].Persona;
            this.editarCampoEmpresa = true;
            this.bloquearPag = false;
          } else {
            this.bloquearPag = false;
            this.filtro.empresa = null;
            this.filtro.RucEmpresa = null;
            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
          }
        });
      }
      else {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
        this.bloquearPag = false;
        this.filtro.RucEmpresa = null;
        this.filtro.empresa = null;
      }
    }
  }

limpiarEmpresa() {
    this.filtro.RucEmpresa = null;
    this.filtro.empresa = null;
    this.filtro.Persona = null;
    this.editarCampoEmpresa = false;
  }


async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }


coreBuscar(): void {
    this.bloquearPag = true;
    this.TipoOperacionService.ListarTipoOperacion(this.filtro).then((res) => {
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      console.log("consulta coreBuscar:", res);
      this.lstTipoOperacion = res;
      setTimeout(() => {
        this.bloquearPag = false;
      }, 500);
    });
  }

coreGuardar(): void {
    throw new Error('Method not implemented.');
  }

coreExportar(): void {
    if (this.lstTipoOperacion == null || this.lstTipoOperacion == undefined || this.lstTipoOperacion.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    }

    let listaExportar: ITipoOperacion[] = [];
    let contador: number = 0;
    let fechaCreacion: string;
    let fechaExpiracion: string;
    this.lstTipoOperacion.forEach(function (e) {
      contador += 1;
      let fechacreada = new Date(e.FechaCreacion);
      let dd = ("0" + fechacreada.getDate()).slice(-2);
      let mm = ("0" + (fechacreada.getMonth() + 1)).slice(-2);
      let yyyy = fechacreada.getFullYear();
      fechaCreacion = dd + "/" + mm + "/" + yyyy;
      let fechaExpirar = new Date(e.FechaExpiracion);
      dd = ("0" + fechaExpirar.getDate()).slice(-2);
      mm = ("0" + (fechaExpirar.getMonth() + 1)).slice(-2);
      yyyy = fechaExpirar.getFullYear();
      fechaExpiracion = dd + "/" + mm + "/" + yyyy;

      let itemExportar: ITipoOperacion = {
        NRO: e.num,
        // FECHA_CREACION: fechaCreacion,
        DOCUMENTO_PERSONA: e.USUARIO,
        Persona: e.NOMBRECOMPLETO == '' || e.NOMBRECOMPLETO == null ? e.NOMBRECOMPLETO : e.NOMBRECOMPLETO.toUpperCase(),
        FECHA_EXPIRACION: fechaExpiracion,
        PERFIL: e.PERFIL == '' || e.PERFIL == null ? e.PERFIL : e.PERFIL.toUpperCase(),
        TIPO_USUARIO: e.DesTipoUsuario == '' || e.DesTipoUsuario == null ? e.DesTipoUsuario : e.DesTipoUsuario.toUpperCase(),
        CORREO: e.CorreoElectronico == '' || e.CorreoElectronico == null ? e.CorreoElectronico : e.CorreoElectronico.toUpperCase(),
        ESTADO: e.DesEstado == '' || e.DesEstado == null ? e.DesEstado : e.DesEstado.toUpperCase()
      };
      listaExportar.push(itemExportar);
    });
    this.exportarService.exportExcel(this.lstTipoOperacion, listaExportar, "Usuarios");
    this.messageService.add({
      key: "bc",
      severity: "success",
      summary: "Success",
      detail: "Archivo EXCEL Generado.",
    });
  }

coreSalir(): void {
    throw new Error('Method not implemented.');
  }


onRowSelect(event: any) {
    console.log("seleccion onRowSelect:", event);
  }


validarTeclaEnter(evento) {
    if (evento.key == "Enter") {
      this.coreBuscar();
    }
  }


ngOnInit(): void {
    this.bloquearPag = true;
    const p4 = this.tituloListadoAsignar(1, this);
    this.ltsExportar =
      [
        { label: 'Formato PDF', icon: 'pi pi-file-pdf', command: () => { this.exportPdf() } },
        { label: 'Formato EXCEL', icon: 'pi pi-file-excel', command: () => { this.exportExcel() } }
      ];

    Promise.all([p4]).then(
      f => {
        setTimeout(() => {
          this.cargarFuncionesIniciales();
          this.bloquearPag = false;
        }, 100);
      });
    this.bloquearPag = false;
  }


async cargarFuncionesIniciales() {
    await this.tituloListadoAsignar(1, this);
    await this.iniciarComponent();
    await this.cargarTipoAdmision();
    await this.cargarComboEstados();
    await this.comboCargarSedes();
  }


  comboCargarSedes(): Promise<number> {
    let lstsedes = { IdEmpresa: 75300, SedEstado: 1 }
    this.lstsedes.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    var listaCombosedes = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('access_sedes')));
    if (lstsedes != null) {
      listaCombosedes.forEach(e => {
        this.lstsedes.push({ label: e.SedDescripcion, value: e.IdSede });
      });
    }
    else {
      return this.loginService.listarSedes(lstsedes).then(
        sedes => {
          if (sedes.length > 0) {
            sedes.forEach(obj => this.lstsedes.push({ label: obj.SedDescripcion, value: obj.IdSede }));
          }
          return 1
        }
      )
    }
  }


cargarComboEstados() {
      this.lstEstados = [];
      this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstados.push({ label: i.Nombre, value: i.Codigo })
    });
  }


cargarTipoAdmision() {
      let dto = {  TipEstado: 1  }
      this.lstTipoAdmision = [];
      this.lstTipoAdmision.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.TipoAdmisionService.ListaTipoAdmision(dto).then(res => {
      console.log("Consulta Tipo Operacion cargarTipoAdmision::", res);
      res.forEach(ele => {
          this.lstTipoAdmision.push({ label: ele.AdmDescripcion.trim(), value: ele.TipoAdmisionId });
      });
      this.filtro.TipoAdmisionId = 1;
      this.cargarTipoPaciente();
    });
  }

selectedTipoAdmision(event) {
    if (this.filtro.TipoAdmisionId != null) {   
      this.filtro.TipoAdmisionId  = event.value;
      this.cargarTipoPaciente();
      console.log("Consulta Tipo Operacion selectedTipoAdmision::", event.value);
    }
  }


cargarTipoPaciente() {
    let dto = {  Estado: 1, TipoAdmisionId:this.filtro.TipoAdmisionId  }
    this.lstTipoPaciente = [];
    this.lstTipoPaciente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.TipoPacienteService.ListaTipoPaciente(dto).then(res => {
      console.log("Consulta Tipo Operacion cargarTipoPaciente::", res);
      res.forEach(ele => {
        this.lstTipoPaciente.push({ label: ele.Descripcion.trim(), value: ele.TipoPacienteId });
      });
    });
  }


exportPdf() {
    if (this.lstTipoOperacion == null || this.lstTipoOperacion == undefined || this.lstTipoOperacion.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    }
    var col = [["Nro ", "Fecha ", "Usuario", "Empleado", "Tipo", "Perfil", "Estado"]];
    var rows = [];
    let contador: number = 0;
    let fechaCreacion: string;
    let fechaExpiracion: string;
    this.lstTipoOperacion.forEach(function (e) {
      contador += 1;
      let fechacreada = new Date(e.FechaCreacion);
      let dd = ("0" + fechacreada.getDate()).slice(-2);
      let mm = ("0" + (fechacreada.getMonth() + 1)).slice(-2);
      let yyyy = fechacreada.getFullYear();

      fechaCreacion = dd + "/" + mm + "/" + yyyy;

      let fechaExpirar = new Date(e.FechaExpiracion);
      dd = ("0" + fechaExpirar.getDate()).slice(-2);
      mm = ("0" + (fechaExpirar.getMonth() + 1)).slice(-2); yyyy = fechaExpirar.getFullYear();

      fechaExpiracion = dd + "/" + mm + "/" + yyyy;

      let itemExportar = [
        e.num,
        fechaCreacion,
        e.USUARIO,
        e.NOMBRECOMPLETO,
        e.DesTipoUsuario,
        e.PERFIL,
        e.DesTipoUsuario,
        e.CorreoElectronico,
        e.DesEstado
      ];
      rows.push(itemExportar);
    });

    this.exportarService.ExportPdf(this.lstTipoOperacion, col, rows, "Usuarios.pdf", "p");
    this.messageService.add({
      key: "bc",
      severity: "success",
      summary: "Success",
      detail: "Funcion en reparación.",
    });
  }

  exportExcel() {
   
  }


}
