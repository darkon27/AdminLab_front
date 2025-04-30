import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { AppSatate } from '../../app.reducer';
import { UsuariosMantenimientoComponent } from '../components/usuarios-mantenimiento.component';
import { filtroUsuario } from '../model/filtro.usuario';
import { Usuario } from '../model/usuario';
import { UsuarioService } from '../service/usuario.service';
import 'jspdf-autotable';
import { IUsuario } from '../model/iusuario';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(UsuariosMantenimientoComponent, { static: false }) usuariosMantenimientoComponent: UsuariosMantenimientoComponent;

  bloquearPag: boolean;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  editarTipoDocumento: boolean = false;
  lstPerfil: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  ltsExportar: MenuItem[];
  lstUsuarios: any[] = [];
  filtro: filtroUsuario = new filtroUsuario();
  Entydad: Usuario = new Usuario();
  perfiles: SelectItem[] = [];

  constructor(
    private exportarService: ExportarService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private UsuarioService: UsuarioService,
    private store: Store<AppSatate>) {
    super();
  }
  btnEliminar?: boolean;
  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }

  coreMensaje(mensage: MensajeController): void {
    console.log("coreMensaje llegando:", mensage.componente);
    if (mensage.componente == "SELECTOR_USUARIO") {
      this.filtro = new filtroUsuario();
      this.coreBuscar();
    }
  }



  coreNuevo(): void {
    this.usuariosMantenimientoComponent.iniciarComponente(new MensajeController(this, 'SELECTOR_USUARIO', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo, this.Entydad)

  }

  coreVer(dto) {
    console.log("llego coreVer  ", dto);
    //this.Entydad = dto;
    this.usuariosMantenimientoComponent.iniciarComponente(new MensajeController(this, 'SELECTOR_USUARIO', ''), "VER", "USUARIOS", dto)
  }

  coreEditar(dto) {
    console.log("llego coreEditar  ", dto);
    // this.Entydad = dto;
    this.usuariosMantenimientoComponent.iniciarComponente(new MensajeController(this, 'SELECTOR_USUARIO', ''), "EDITAR", "USUARIOS", dto)
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
        dtoInactivar.estado = 'I';
        const respInactivar = await this.UsuarioService.mantenimientoUsuarioMast(ConstanteUI.SERVICIO_SOLICITUD_INACTIVAR, dtoInactivar, this.getUsuarioToken());
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


  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  coreBuscar(): void {
    if (this.filtro.Usuario == "") {
      this.filtro.Usuario = null;
    }
    if (this.filtro.NombreCompleto == "") {
      this.filtro.NombreCompleto = null;
    }
    if (this.filtro.Perfil == "") {
      this.filtro.Perfil = null;
    }
    if (this.filtro.Estado == "") {
      this.filtro.Estado = null;
    }
    console.log("llego filtro", this.filtro);
    this.bloquearPag = true;

    this.UsuarioService.listarUsuarioMast(this.filtro).then((res) => {
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      console.log("consulta coreBuscar:", res);
      this.lstUsuarios = res;
      setTimeout(() => {
        this.bloquearPag = false;
      }, 500);
    });

  }
  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  coreExportar(): void {
    this.exportExcel();
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
    this.lstEstados.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.lstPerfil.push({ label: ConstanteAngular.COMBOTODOS, value: null });
  }


  async cargarFuncionesIniciales() {
    await this.tituloListadoAsignar(1, this);
    await this.iniciarComponent();
    //await this.store.dispatch(actions.cargarLista());
    await this.cargarPerfiles();
    await this.listarComboEstados();
  }

  listarComboEstados() {
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
      this.lstEstados.push({ label: i.Nombre, value: i.Codigo })
    });
  }


  cargarPerfiles() {
    let dto = {
      ESTADO: "A"
    }
    return this.UsuarioService.listarComboPerfil(dto).then(res => {
      console.log("Mant Usuario cargarPerfiles::", res);
      res.forEach(ele => {
        this.lstPerfil.push({ label: ele.Descripcion.trim(), value: ele.Codigo.trim() });
      });
      return 1;
    });
  }

  exportPdf() {
    if (this.lstUsuarios == null || this.lstUsuarios == undefined || this.lstUsuarios.length == 0) {
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
    this.lstUsuarios.forEach(function (e) {
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

    this.exportarService.ExportPdf(this.lstUsuarios, col, rows, "Usuarios.pdf", "p");
    this.messageService.add({
      key: "bc",
      severity: "success",
      summary: "Success",
      detail: "Funcion en reparación.",
    });
  }

  exportExcel() {
    if (this.lstUsuarios == null || this.lstUsuarios == undefined || this.lstUsuarios.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    }

    let listaExportar: IUsuario[] = [];
    let contador: number = 0;
    let fechaCreacion: string;
    let fechaExpiracion: string;
    this.lstUsuarios.forEach(function (e) {
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


      //new Intl.NumberFormat().format(element.Diametro)
      let itemExportar: IUsuario = {
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
    this.exportarService.exportExcel(this.lstUsuarios, listaExportar, "Usuarios");
    this.messageService.add({
      key: "bc",
      severity: "success",
      summary: "Success",
      detail: "Archivo EXCEL Generado.",
    });
  }


}
