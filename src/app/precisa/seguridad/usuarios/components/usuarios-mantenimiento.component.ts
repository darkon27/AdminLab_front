import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
import { LoginService } from '../../../auth/service/login.service';
import Swal from 'sweetalert2';
import { Component, OnInit, ViewChild } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { MensajeController } from "../../../../../util/MensajeController";
import { PersonaService } from "../../../framework-comun/Persona/servicio/persona.service";
import { EmpleadoMastService } from "../../../maestros/Empleados/service/empleadomast.service";
import { filtroEmpleadoMast } from "../../../maestros/Empleados/model/filtro.empleadomast";
import { filtroUsuario } from './../model/filtro.usuario';
import { UsuarioService } from "../service/usuario.service";
import { PersonaBuscarComponent } from "../../../framework-comun/Persona/components/persona-buscar.component";
import { Usuario } from "../model/usuario";
import { PersonaMantenimientoComponent } from "../../../framework-comun/Persona/vista/persona-mantenimiento.component";

@Component({
  selector: 'ngx-usuarios-mantenimiento',
  templateUrl: './usuarios-mantenimiento.component.html'
})

export class UsuariosMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  @ViewChild(PersonaMantenimientoComponent, { static: false }) personaMantenimientoComponent: PersonaMantenimientoComponent;
  bloquearPag: boolean;
  acciones: string = '';
  position: string = 'top';
  validarform: string = null;
  checked: boolean = false;
  lstPerfil: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  lstTipoUsuario: SelectItem[] = [];
  lstSede: any[] = [];
  lstSedesAgregar: any[] = [];
  visible: boolean = false;
  lstSedecombo: SelectItem[] = [];


  DtoUsuario: Usuario = new Usuario();
  EsEmpleado: string = '';
  usuario: string;
  fechaCreacion: Date;
  resultado: Date;
  fechaModificacion: Date;
  editarrepresen: boolean = false;
  ActivarfechaExpiracion: boolean = true;
  filtroUsuario: filtroUsuario = new filtroUsuario();
  tieneFechaExpiracion: boolean = true;

  constructor(
    private personaService: PersonaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private UsuarioService: UsuarioService,
    private loginService: LoginService,
    private empleadoMastService: EmpleadoMastService,
  ) {
    super();
  }
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
  }
  ngOnInit(): void {
    //throw new Error("Method not implemented.");
  }

  async iniciarComponente(msj: MensajeController, accion: string, titulo, rowdata?: any,) {

    /**PARAMETROS */
    this.bloquearPag = true;
    // this.btnCerrar();
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.lstSede = [];

    /**OBJETOS */
    this.DtoUsuario = new Usuario();
    console.log("Usuario iniciarComponente rowdata:", rowdata);
    console.log("Usuario iniciarComponente this.getUsuarioAuth().data[0]:", this.getUsuarioAuth().data[0]);
    /**AUDITORIA */
    this.fechaModificacion = undefined;
    this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

    /**METODOS DE COMBOS  */
    const p1 = await this.listarComboEstados();
    const p2 = await this.cargarPerfiles();
    const p3 = await this.listarComboTipoUsuario();
    const p4 = await this.listarSedes();
    //await this.cargarSedesAgregar();
    //await this.listarSedes();
    Promise.all([p1, p2, p3, p4]).then(
      f => {
        setTimeout(() => {
          this.bloquearPag = false;
        }, 100);
      });
    /**ACCION DE FORMULARIO */
    switch (accion) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.puedeEditar = false;
        function sumarfecha(fecha, n = 1) {
          return new Date(fecha.setDate(fecha.getDate() + n));
        }
        this.DtoUsuario.FechaExpiracion = new Date();
        this.resultado = sumarfecha(this.DtoUsuario.FechaExpiracion, 45);

        //FECHAS
        this.fechaCreacion = new Date();
        this.fechaModificacion = undefined;
        break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        this.puedeEditar = false;
        console.log("ConstanteUI.ACCION_SOLICITADA_EDITAR", rowdata);
        /**BUSCAR OBJETO */
        /**
         * BUSCAR USUARIO POR EL OBJETO ROWDATA CON SU PROPIEDAD USUSARIO
         */
        this.filtroUsuario.Usuario = rowdata.Usuario;
        const respEditar: any[] = await this.UsuarioService.listarUsuarioMast(this.filtroUsuario);
        console.log("data", respEditar);
        this.DtoUsuario = await respEditar[0];
        // fin

        this.DtoUsuario.Perfil = rowdata.Perfil.trim();
        this.DtoUsuario.TipoUsuario = rowdata.TipoUsuario.toString();
        // VALIDAR FECHA DE CREACIÓN
        this.tieneFechaExpiracion = this.DtoUsuario.ExpirarPasswordFlag == "S" ? true : false;
        this.DtoUsuario.FechaExpiracion = this.tieneFechaExpiracion == true ? new Date(this.DtoUsuario.FechaExpiracion) : null
        this.ListaUsuarioSede(this.filtroUsuario.Usuario);
        this.fechaCreacion = new Date(rowdata.FechaCreacion);
        if (this.DtoUsuario.UltimaFechaModif != null) { this.fechaModificacion = new Date(rowdata.UltimaFechaModif); }
        if (this.DtoUsuario.FechaExpiracion != null) { this.DtoUsuario.FechaExpiracion = await new Date(rowdata.FechaExpiracion); }
        else { this.ActivarfechaExpiracion = false; }

        break;
      case ConstanteUI.ACCION_SOLICITADA_VER:
        this.puedeEditar = true;
        console.log("ConstanteUI.ACCION_SOLICITADA_EDITAR", rowdata);
        /**BUSCAR OBJETO */
        /**
         * BUSCAR USUARIO POR EL OBJETO ROWDATA CON SU PROPIEDAD USUSARIO
         */
        this.filtroUsuario.Usuario = rowdata.Usuario;
        const respVer: any[] = await this.UsuarioService.listarUsuarioMast(this.filtroUsuario);
        console.log("data", respVer);
        this.DtoUsuario = await respVer[0];
        // fin
        this.ListaUsuarioSede(this.filtroUsuario.Usuario);
        this.DtoUsuario.Perfil = rowdata.Perfil.trim();
        this.DtoUsuario.TipoUsuario = rowdata.TipoUsuario.toString();
        // VALIDAR FECHA DE CREACIÓN
        this.tieneFechaExpiracion = this.DtoUsuario.ExpirarPasswordFlag == "S" ? true : false;
        this.DtoUsuario.FechaExpiracion = this.tieneFechaExpiracion == true ? new Date(this.DtoUsuario.FechaExpiracion) : null

        this.fechaCreacion = new Date(rowdata.FechaCreacion);
        if (this.DtoUsuario.UltimaFechaModif != null) { this.fechaModificacion = new Date(rowdata.UltimaFechaModif); }
        if (this.DtoUsuario.FechaExpiracion != null) { this.DtoUsuario.FechaExpiracion = await new Date(rowdata.FechaExpiracion); }
        else { this.ActivarfechaExpiracion = false; }
        break;
    }
    this.bloquearPag = false;

    /**LIMPIA LA CLAVE POR SEGURIDAD */
    this.DtoUsuario.Clave = '';
  }

  generarpsd() {
    let result = '';
    const characters = '0123456789';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * 10));    //sorteo
    }
    return result;
  }

  async isFechaExpiracion() {
    this.DtoUsuario.FechaExpiracion = null;
    // this.ActivarfechaExpiracion = await this.ActivarfechaExpiracion == true ? false : true;
    // VALIDAR FECHA DE CREACIÓN
    if (!this.tieneFechaExpiracion) {

      this.DtoUsuario.FechaExpiracion = new Date();
      function sumarfecha(fecha, n = 1) {
        return new Date(fecha.setDate(fecha.getDate() + n));
      }
      this.DtoUsuario.FechaExpiracion = sumarfecha(this.DtoUsuario.FechaExpiracion, 45);

      this.DtoUsuario.ExpirarPasswordFlag = 'S';
      return;
    } else {

      this.DtoUsuario.FechaExpiracion = null;
      this.DtoUsuario.ExpirarPasswordFlag = 'N';
      return;
    }
  }


  coreGuardar() {

    console.log("coreGuardar", this.DtoUsuario);
    if (this.estaVacio(this.DtoUsuario.Usuario)) {
      this.messageShow('warn', 'Advertencia', 'Seleccione una persona válida');
      return;
    }
    if (this.estaVacio(this.DtoUsuario.Clave)) {
      this.messageShow('warn', 'Advertencia', 'Ingrese una clave válida');
      return;
    }
    if (this.DtoUsuario.Clave != this.DtoUsuario.ClaveNueva) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Las contraseñas no coinciden' });
      return;
    }
    if (this.estaVacio(this.DtoUsuario.correo_empresa)) {
      this.messageShow('warn', 'Advertencia', 'Ingrese un correo válido');
      return;
    }
    if (!this.estaVacio(this.DtoUsuario.correo_empresa)) {
      if (!this.validarCorreo(this.DtoUsuario.correo_empresa)) {
        this.messageShow('warn', 'Advertencia', 'Ingrese un correo valido.');
        return;
      }
    }
    if (this.estaVacio(this.DtoUsuario.Perfil)) {
      this.messageShow('warn', 'Advertencia', 'Seleccione un perfil válido');
      return;
    }
    if (this.estaVacio(this.DtoUsuario.TipoUsuario.toString())) {
      this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de usuario válido');
      return;
    }
    if (this.estaVacio(this.DtoUsuario.Estado)) {
      this.messageShow('warn', 'Advertencia', 'Seleccione un estado válido');
      return;
    }

    // Asegurar que las sedes seleccionadas se añadan al DTO
    this.DtoUsuario.SedesPerfil = this.lstSede;
    console.log("coreGuarda this.validarform", this.validarform);
    this.bloquearPag = true;
    switch (this.validarform) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.confirmationService.confirm({
          header: "Confirmación",
          icon: "fa fa-question-circle",
          message: "¿Desea Guardar el registro ? ",
          key: "UsuaDialog",
          accept: async () => {
            /**AUDITORIA */
            this.DtoUsuario.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
            this.DtoUsuario.UltimoUsuario = null;
            this.DtoUsuario.FechaCreacion = new Date();
            this.DtoUsuario.UltimaFechaModif = null;
            console.log("mantenimientoUsuarioMast NUEVO", this.DtoUsuario);
            console.log("Contenido de lstSede:", this.lstSede);
            const respNuevo = await this.UsuarioService.mantenimientoUsuarioMast(ConstanteUI.SERVICIO_SOLICITUD_NUEVO, this.DtoUsuario, this.getUsuarioToken());
            if (respNuevo != null) {
              if (respNuevo.success) {
                let dto = {
                  success: true,
                  valor: 1,
                  mensaje: "Se envia MantenimientoUsuarioSede",
                  data: [...this.lstSede]  // Clonamos la lista para evitar problemas
                };
                console.log("daMantenimientoUsuarioSedea", dto);
                const respNuevoSede = await this.UsuarioService.MantenimientoUsuarioSede(ConstanteUI.SERVICIO_SOLICITUD_NUEVO, dto, this.getUsuarioToken());

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

        console.log("mantenimientoUsuarioMast EDITAR", this.DtoUsuario);
        console.log("Contenido de lstSede:", this.lstSede);
        this.DtoUsuario.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;
        this.DtoUsuario.UltimaFechaModif = new Date();

        this.confirmationService.confirm({
          header: "Confirmación",
          icon: "fa fa-question-circle",
          message: "¿Desea Modificar el registro ? ",
          key: "UsuaDialog",
          accept: async () => {
            this.bloquearPag = true;

            this.DtoUsuario.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;
            const respEditar = await this.UsuarioService.mantenimientoUsuarioMast(ConstanteUI.SERVICIO_SOLICITUD_EDITAR, this.DtoUsuario, this.getUsuarioToken());
            40859200
            if (respEditar != null) {
              if (respEditar.success) {
                let dto = {
                  success: true,
                  valor: 1,
                  mensaje: "Se envia MantenimientoUsuarioSede",
                  data: [...this.lstSede]  // Clonamos la lista para evitar problemas
                };
                console.log("daMantenimientoUsuarioSedea", dto);
                const respNuevoSede = await this.UsuarioService.MantenimientoUsuarioSede(1, dto, this.getUsuarioToken());
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


  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }


  listarComboEstados() {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
      this.lstEstados.push({ label: i.Nombre, value: i.Codigo })
    });
  }

  listarComboTipoUsuario() {
    this.lstTipoUsuario = [];
    this.lstTipoUsuario.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOUSUARIO").forEach(i => {
      this.lstTipoUsuario.push({ label: i.Nombre, value: i.Codigo })
    });
  }

  cargarPerfiles() {
    let dto = {
      ESTADO: "A"
    }
    this.lstPerfil = [];
    this.lstPerfil.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.UsuarioService.listarComboPerfil(dto).then(res => {
      console.log("Mant Usuario cargarPerfiles::", res);
      res.forEach(ele => {
        this.lstPerfil.push({ label: ele.Descripcion.trim(), value: ele.Codigo.trim() });
      });
      return 1;
    });
  }


  ListaUsuarioSede(Usuario: string) {
    let dto = {
      Usuario: Usuario
    }
    this.lstSede = [];
    this.UsuarioService.ListaUsuarioSede(dto).then((res) => {
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      console.log("consulta ListaUsuarioSede:", res);
      this.lstSede = res;
      this.bloquearPag = false;

    });
  }

  trackById(index: number, item: any): number {
    return item.IdSede;
  }

  agregarSede(): void {
    // Verificar si se ha seleccionado una sede

    if (this.esNumeroVacio(this.DtoUsuario.IdSede)) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Debe Seleccionar una Sede.' });
      return;
    }

    // Buscar la sede seleccionada por su ID
    let sedeSeleccionada = this.lstSedecombo.find(sede => sede.value == this.DtoUsuario.IdSede);


    if (!sedeSeleccionada) {  // Verificar si la sede fue encontrada
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Sede no encontrada.' });
      return;
    }

    // Verificar si ya fue agregada
    if (this.lstSede.some(sede => sede.IdSede == sedeSeleccionada.value)) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'La sede ya está en la lista.' });
      return;
    }

    // Agregar la sede seleccionada a la lista
    this.lstSede.push({
      num: this.lstSede.length + 1,
      IdSede: sedeSeleccionada.value,
      SedDescripcion: sedeSeleccionada.label,
      Usuario: this.DtoUsuario.Usuario,
      UsuarioCreacion: this.getUsuarioAuth().data[0].Usuario,
      FechaCreacion: new Date()
    });

  }

  confirmBox() {
    Swal.fire({
      position: 'top-end',
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  }

  eliminarSede(sede: any): void {
    this.bloquearPag = true;
    this.messageShow('warn', 'Advertencia', this.getMensajeErrorEliminar());
    this.bloquearPag = false;


    Swal.fire({
      title: 'Importante',
      text: "¿Seguro que desea anular el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#094d74',
      cancelButtonColor: '#ffc72f',
      cancelButtonText: '¡No, Cancelar!',
      confirmButtonText: '¡Si, Anular!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.lstSede = this.lstSede.filter(s => s.num != sede.num);
        let num: number = 1;
        this.lstSede.forEach(s => {
          s.num = num++;
        });
        console.log("eliminarSede:", sede);
      }
    })
  }


  listarSedes(): Promise<number> {
    let OBJsedes = { IdEmpresa: 75300, SedEstado: 1 }
    this.lstSedecombo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.loginService.listarSedes(OBJsedes).then(
      sedes => {
        if (sedes.length > 0) {
          sedes.forEach(obj => this.lstSedecombo.push({ label: obj.SedDescripcion, value: obj.IdSede }));
          console.log(" combolistarSedesCargarSedes", this.lstSedecombo);
        }
        return 1
      }
    )
  }

  async coreMensaje(mensage: MensajeController) {
    console.log("data llegando mensage:", mensage);
    if (mensage.resultado.EsEmpleado != 'S') {
      this.messageService.add({
        key: 'bc',
        severity: 'warn',
        summary: 'Warning',
        detail: 'La persona no es un empleado.'
      });

      return;
    }

    let filtrarEmpleado: filtroEmpleadoMast = new filtroEmpleadoMast();
    filtrarEmpleado.Documento = mensage.resultado.Documento.trim();
    console.log("filtrarEmpleado", filtrarEmpleado);
    let empleado = await this.empleadoMastService.listarEmpleadoMast(filtrarEmpleado);
    console.log("empleado", empleado[0]);
    console.log("empleado.Estado", empleado[0].Estado.trim());

    if (empleado[0].Estado != "A") {
      this.messageService.add({
        key: 'bc',
        severity: 'warn',
        summary: 'Warning',
        detail: 'El empleado no esta activo.'
      });
      return;
    }

    if (mensage.componente == "SELECPACIENTE") {
      this.DtoUsuario.Usuario = mensage.resultado.Documento.trim();
      this.DtoUsuario.NombreCompleto = mensage.resultado.NombreCompleto.trim();
      this.DtoUsuario.Persona = mensage.resultado.Persona;
      this.DtoUsuario.correo_empresa = empleado[0]?.CorreoInterno?.trim();
      this.EsEmpleado = mensage.resultado.EsEmpleado.trim();

    }
  }


  verSelector(tipo: string): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECPACIENTE', 'BUSCAR'), 'BUSCAR ', "E");
  }

  crearPersona(tipo: string) {
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGPERSONA', ''), 'NUEVO ', 1);
  }

  limpiarDocumento() {
    this.DtoUsuario.Usuario = null;
    this.DtoUsuario.NombreCompleto = null;
    this.DtoUsuario.Persona = null;
  }

  validarTeclaEnter(evento) {
    if (evento.key == "Enter") {
      if (this.DtoUsuario.Usuario == null) {
        this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Ingrese un Nro. de documento.' });
        return;
      }
      else if (this.DtoUsuario.Usuario.trim().length >= 5) {
        let Documento = {
          Documento: this.DtoUsuario.Usuario.trim(),
          tipopersona: "P",
          SoloBeneficiarios: "0",
          UneuNegocioId: "0"
        }
        this.bloquearPag = true;
        return this.personaService.listaPersonaUsuario(Documento).then((res) => {
          this.bloquearPag = false;
          if (this.esListaVacia(res)) {
            this.DtoUsuario.Usuario = null;
            this.DtoUsuario.NombreCompleto = null;
            this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Documento no encontrado, revise bien los parametros.' });
            return;
          }
          else if (res[0].hasOwnProperty("Documento")) {
            if (this.estaVacio(res[0].NombreCompleto)) {
              this.DtoUsuario.NombreCompleto = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`;
              this.DtoUsuario.Persona = res[0].Persona;
              this.editarrepresen = true;
            } else {
              this.DtoUsuario.NombreCompleto = res[0].NombreCompleto;
              this.DtoUsuario.Persona = res[0].Persona;
              this.editarrepresen = true;
            }
          } else {
            this.DtoUsuario.Usuario = null;
            this.DtoUsuario.NombreCompleto = null;
            this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Documento no encontrado, revise bien los parametros.' });
            return;
          }
        }).catch(error => error);
      } else {
        this.DtoUsuario.Usuario = null;
        this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Documento no encontrado, revise bien los parametros.' });
        return;
      }
    }
  }

  btnCerrar() {
    this.lstEstados = [];
    this.lstPerfil = [];
    this.lstTipoUsuario = [];
    this.ActivarfechaExpiracion;
    this.fechaCreacion = undefined;
    this.fechaModificacion = undefined;
  }

  cargarSedesAgregar(): void {
    let dto = {
      Usuario: Usuario
    }
    this.UsuarioService.ListaUsuarioSede(dto).then((res) => {
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      console.log("consulta ListaUsuarioSede:", res);
      this.lstSedesAgregar = res;
      this.bloquearPag = false;

    });
  }
}
