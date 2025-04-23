import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { LazyLoadEvent, ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { ExamenAsignarHomologacionComponent } from '../../../framework-comun/Examen/components/examen-asignar-homologacion.component';
import { ExamenAsignarMuestraComponent } from '../../../framework-comun/Examen/components/examen-asignar-muestra.component';
import { ExamenPerfilComponent } from '../../../framework-comun/Examen/components/examen-perfil.component';
import { FiltroExamen, FiltroServicio } from '../../../framework-comun/Examen/dominio/filtro/FiltroExamen';
import { ExamenService } from '../../../framework-comun/Examen/servicio/Examen.service';
import { ExamenMantenimientoComponent } from '../../../framework-comun/Examen/vista/examen-mantenimiento.component';
import { Maestro } from '../../FormMaestro/model/maestro';
import { ExamenMantenimientoComponentVista } from '../components/examen-mantenimiento/examen-mantenimiento.component';

/**
 * autor: Geampier Smc
* Tipo: ciclo de vida
* Detalle: Asigne una forma de manejar mejor la información al llamado de cada componente.
 */

@Component({
  selector: 'ngx-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.scss']
})
export class ExamenComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(ExamenMantenimientoComponent, { static: false }) examenMantenimientoComponent: ExamenMantenimientoComponent;
  @ViewChild(ExamenAsignarMuestraComponent, { static: false }) examenAsignarMuestraComponent: ExamenAsignarMuestraComponent;
  @ViewChild(ExamenAsignarHomologacionComponent, { static: false }) examenAsignarHomologacionComponent: ExamenAsignarHomologacionComponent;
  @ViewChild(ExamenPerfilComponent, { static: false }) examenPerfilComponent: ExamenPerfilComponent;
  @ViewChild(ExamenMantenimientoComponentVista, { static: false }) examenMantenimientoComponentVista: ExamenMantenimientoComponentVista;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  dto: Maestro[] = [];
  bloquearPag: boolean;
  lstServicio: SelectItem[] = [];
  lstEstado: SelectItem[] = [];
  lstexamen: SelectItem[] = [];
  lstClasificacion: SelectItem[] = [];
  Auth: UsuarioAuth = new UsuarioAuth();
  servicio: FiltroServicio = new FiltroServicio();
  filtro: FiltroExamen = new FiltroExamen();
  registroSeleccionado: any;

  constructor(
    private examenService: ExamenService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private toastrService: NbToastrService) {
    super();
  }

  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  /**
   * Autor: Geampier Smc
   * Tipo: Maquetación
   * Detalle: lógica de abrir formularios
   */

  coreNuevo(): void {
    console.log(this.objetoTitulo.menuSeguridad.titulo);

    this.examenMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'NUEVOEXAMEN', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo, 1);
  }

  coreEditar() {
    if (this.registroSeleccionado == null) {
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: `Debe seleccionar un registro.`
      });
      return;
    }
    this.examenMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'EDITAREXAMEN', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, 2, this.registroSeleccionado);
  }

  coreVer() {
    if (this.registroSeleccionado == null) {
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: `Debe seleccionar un registro.`
      });
      return;
    }
    this.examenMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'VEREXAMEN', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, 3, this.registroSeleccionado);
  }

  coreAsignarMuestra(): void {
    if (this.registroSeleccionado == null) {
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: `Debe seleccionar un registro.`
      });
      return;
    }
    this.examenAsignarMuestraComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'VEREXAMEN', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo, 3, this.registroSeleccionado);

  }

  coreAsignarHomologacion(): void {
    if (this.registroSeleccionado == null) {
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: `Debe seleccionar un registro.`
      });
      return;
    }
    this.examenAsignarHomologacionComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'VEREXAMEN', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo, 3, this.registroSeleccionado);

  }

  corePerfil(): void {
    if (this.registroSeleccionado == null) {
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: `Debe seleccionar un registro.`
      });
      return;
    }
    this.examenPerfilComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'VEREXAMEN', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo, 3, this.registroSeleccionado);

  }
  async coreVerExamen() {
    if(this.registroSeleccionado == null||this.registroSeleccionado==undefined){
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: `Debe seleccionar un registro.`
      });
      return;
    }
    this.examenMantenimientoComponentVista.iniciarComponente('VER','EXAMENES',this.registroSeleccionado);
  }
  coreBuscar(): void {
    this.dataTableComponent.first = 0;
    this.grillaCargarDatos({ first: this.dataTableComponent.first });
  }

  // coreInactivar(row:any): void {
  //   Swal.fire({
  //     title: '¡Mensaje!',
  //     text: '¡Desea inactivar Codigo: ' + row.CodigoComponente + '?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#094d74',
  //     cancelButtonColor: '#ffc72f',
  //     cancelButtonText: '¡No, Cancelar!',
  //     confirmButtonText: '¡Si, Anular!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       row.Estado = 2;
  //       return this.examenService.mantenimientomaestro(3, row, this.getUsuarioToken()).then(
  //         res => {
  //           if (res.success) {
  //             this.toastMensaje(`El Registro Nro. ${row.CodigoComponente} fue inactivado`, 'success', 2000)
  //             this.dialog = false;
  //           } else {
  //             Swal.fire({
  //               icon: 'warning',
  //               title: 'Oops...',
  //               text: `${res.message}`
  //             })
  //           }
  //         }
  //       ).catch(error => error)
  //     }
  //   })
  // }

  coreInactivar(row: any): void {
    console.log("coreInactivar row", row);
    Swal.fire({
      title: '¡Mensaje!',
      text: `¡Desea inactivar Codigo: ${row.CodigoComponente} ?!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#094d74',
      cancelButtonColor: '#ffc72f',
      cancelButtonText: '¡No, Cancelar!',
      confirmButtonText: '¡Si, Anular!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.registroSeleccionado.Estado = 2;
        return this.examenService.mantenimientomaestro(3, this.registroSeleccionado, this.getUsuarioToken()).then(
          res => {
            if (res.success) {
              this.toastMensaje(`El Registro Nro. ${this.registroSeleccionado.CodigoComponente} fue inactivado`, 'success', 2000)
              this.dialog = false;
            } else {
              Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: `${res.message}`
              })
            }
          }
        ).catch(error => error)
      }
    })
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

  onRowSelect(event: any) {
    console.log("Lista Exa onRowSelect:", this.registroSeleccionado);
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    /*
    let dw = new Maestro();
        dw.Numero = 1
        dw.CodigoTabla = "01"
        dw.Descripcion = "PRUEBA DESCRI"
        dw.Nombre = "NOMBRE DETALLE"
        dw.Estado = 2
        this.dto.push(dw)
        */
    const p1 = this.comboCargarServicios();
    const p2 = this.comboCargarEstado();
    const p3 = this.comboCargarClasificacion();
    Promise.all([p1, p2, p3]).then(resp => {
      this.bloquearPag = false;
    });
  }

  comboCargarServicios(): Promise<number> {
    this.Auth = this.getUsuarioAuth();
    var service = this.Auth.data;
    this.servicio.Estado = 1;

    this.lstServicio.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.examenService.serviciopaginado(this.servicio).then(resp => {
      resp.forEach(e => {
        this.lstServicio.push({ label: e.Nombre.toUpperCase(), value: e.ClasificadorMovimiento });
        // this.filtro.ClasificadorMovimiento = service[0].ClasificadorMovimiento
      });
      this.filtro.ClasificadorMovimiento = service[0].ClasificadorMovimiento;
      console.log("Examen combo servicio resp", resp);
      console.log("Examen combo servicio", service[0]);
      return 1;
    });
  }

  comboCargarEstado() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstado.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo });
    });
    this.filtro.Estado = 1;
  }

  comboCargarClasificacion() {
    let clasificador = { Estado: 1 }
    this.lstClasificacion = [];
    this.lstClasificacion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.examenService.listarclasificadorcomponente(clasificador).then(resp => {
      resp.forEach(e => {
        this.lstClasificacion.push({ label: e.Nombre.toUpperCase(), value: e.IdClasificacion });
      });
    });
    console.log("Examen comboCargarClasificacion", this.lstClasificacion);
  }


  validarTeclaEnter(evento) {
    if (evento.key == "Enter") {
      this.coreBuscar();
    }
  }


  grillaCargarDatos(event: LazyLoadEvent) {
    this.bloquearPag = true;
    console.log("Lista Examen grillaCargarDatos", this.filtro);
    this.examenService.listarexamenmaestro(this.filtro).then((res) => {
      var contado = 1;
      res.forEach(element => {
        element.numeroExamen = contado++;
      });
      console.log("Lista Examen grillaCargarDatos", res);
      this.bloquearPag = false;
      this.lstexamen = res;
    });
  }


}
