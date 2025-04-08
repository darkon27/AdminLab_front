import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { ComponenteBasePrincipal } from '../../../../../../util/ComponenteBasePrincipa';
import { ConstanteUI } from '../../../../../../util/Constantes/Constantes';
import { MensajeController } from '../../../../../../util/MensajeController';
import { AuditoriaComponent } from '../../../../../@theme/components/auditoria/auditoria.component';
import { FiltroConsultaAdmision } from '../../../../admision/consulta/dominio/filtro/FiltroConsultaAdmision';
import { ConsultaAdmisionService } from '../../../../admision/consulta/servicio/consulta-admision.service';
import { UsuarioAuth } from '../../../../auth/model/usuario';
import { PersonaBuscarComponent } from '../../../../framework-comun/Persona/components/persona-buscar.component';
import { dtoPersona } from '../../../../framework-comun/Persona/dominio/dto/dtoPersona';
import { PersonaService } from '../../../../framework-comun/Persona/servicio/persona.service';


@Component({
  selector: 'ngx-personamast-unificacion',
  templateUrl: './personamast-unificacion.component.html',
  styleUrls: ['./personamast-unificacion.component.scss']
})

export class PersonamastUnificacionComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy {
  @ViewChild(AuditoriaComponent, { static: false }) auditoriaComponent: AuditoriaComponent;
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;

  acciones: string = '';
  position: string = 'top';
  validarAccion: string = '';
  bscPersona: any[] = [];
  lstAdmision: any[] = [];
  lstUnificacion: any[] = [];
  editarCampoDocumento: boolean = false;
  editarUnifiDocumento: boolean = false;

  usuario: string = "";
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  filtro: FiltroConsultaAdmision = new FiltroConsultaAdmision();
  filtroUnificado: FiltroConsultaAdmision = new FiltroConsultaAdmision();
  dto: dtoPersona = new dtoPersona();

  checked: boolean = false
  loading: boolean = false;
  bloquearPag: boolean;
  puedeEditar: boolean = false;
  NoPuedeEditar: boolean = false;
  fechaCreacion: Date;
  fechaModificacion: Date;

  lstSeleccionadomultiple: any[] = [];
  lstSeleccionadoUnificacion: any[] = [];
  lstSeleccionadoEliminado: any[] = [];



  constructor(
    private messageService: MessageService,
    private consultaAdmisionService: ConsultaAdmisionService,
    private personaService: PersonaService) {
    super();
  }

  ngOnInit(): void {
    this.filtro = new FiltroConsultaAdmision();
    this.filtroUnificado = new FiltroConsultaAdmision();
    this.lstUnificacion = [];
    this.lstSeleccionadomultiple = [];
    this.lstAdmision = [];
  }

  ngOnDestroy(): void {
    this.filtro = new FiltroConsultaAdmision();
    this.lstUnificacion = [];
    this.lstSeleccionadomultiple = [];
    this.lstAdmision = [];
  }

  iniciarComponente(msj: MensajeController, accion: string, titulo: string) {
    this.mensajeController = msj;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.puedeEditar = false;
    this.validarAccion = accion;
    this.dto.UltimaFechaModif = null;
    this.dto.IngresoFechaRegistro = new Date();
    this.fechaCreacion = new Date();
    this.fechaModificacion = undefined;
    this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
  }

  async cargarAcciones(msj: MensajeController, accion: string, titulo: string, Entydad?: any) {
    console.log("cargarAcciones Ingreso", accion);
    this.limpiarBuscador();
    /**PARAMETROS */
    this.mensajeController = msj;
    this.validarAccion = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;

    /**AUDITORIA */
    this.fechaModificacion = undefined;
    this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

    /**ACCION DE FORMULARIO */
    this.bloquearPag = true;
    switch (accion) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.puedeEditar = false;
        this.NoPuedeEditar = false;
        this.dto.Estado = "A";
        this.fechaCreacion = new Date();
        break;
    }
    this.bloquearPag = false
  }

  limpiarBuscador() {
    console.log("limpiarBuscador");
    this.filtro = new FiltroConsultaAdmision();
    this.filtroUnificado = new FiltroConsultaAdmision();
    this.lstUnificacion = [];
    this.lstSeleccionadomultiple = [];
    this.lstAdmision = [];
    this.limpiarPersona();
    this.editarUnifiDocumento = false;
    this.bloquearPag = false;
  }


  coreBuscar(): void {
    this.bloquearPag = true;
    if (this.filtro == null || this.esNumeroVacio(this.filtro.Persona)) {
      this.filtro.Persona = null;
      this.mostrarMensaje('Debe seleccionar un registro', 'info');
      this.bloquearPag = false;
      return;
    }

    console.log("data filtro", this.filtro);
    this.bloquearPag = true;
    this.consultaAdmisionService.listarpaginado(this.filtro).then((res) => {
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      this.lstAdmision = res;
      console.log("consulta Admision grillaCargarDatos:", res);
      setTimeout(() => {
        this.bloquearPag = false;
      }, 100);
    });
  }

  onRowSelect(event: any) {
    console.log("onRowSelect:", event);
  }

  isRowSelectable(event: any) {
    console.log("isRowSelectable:", event);
  }

  ondobleRowDblclick(rowData: any) {
    this.mostrarMensaje('Debe seleccionar un registro', 'info');
    return;
  }

  mostrarMensaje(mensaje: string, tipo: string): void {
    this.messageService.clear();
    this.messageService.add({ severity: tipo, summary: 'Mensaje', detail: mensaje });
  }

  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECPACIENTE") {
      console.log("coreMensaje data SELECPACIENTE", mensage);
      this.filtro.Documento = mensage.resultado.Documento;
      this.filtro.NombreCompleto = mensage.resultado.NombreCompleto;
      this.filtro.Persona = mensage.resultado.Persona;
      this.editarCampoDocumento = true;
    }
    else if (mensage.componente == "SELECUNIFICACION") {
      console.log("coreMensaje data SELECUNIFICACION", mensage);
      this.filtroUnificado.Documento = mensage.resultado.Documento;
      this.filtroUnificado.NombreCompleto = mensage.resultado.NombreCompleto;
      this.filtroUnificado.Persona = mensage.resultado.Persona;
      this.editarUnifiDocumento = true;
    }
  }

  coreEnviarUnificacion() {
    this.bloquearPag = true;
    console.log("coreEnviarUnificacion stSelec", this.lstSeleccionadomultiple);
    if (this.esListaVacia(this.lstSeleccionadomultiple)) {
      this.mostrarMensaje('Debe haber registro en el listado', 'warn');
      this.bloquearPag = false;
      return;
    }

    if (this.estaVacio(this.filtroUnificado.NombreCompleto)) {
      this.mostrarMensaje('Debe haber un Paciente elegido', 'warn');
      this.bloquearPag = false;
      return;
    }

    this.lstUnificacion = [...new Set([...this.lstUnificacion, ...this.lstSeleccionadomultiple])];
    let lstAdmisionLimpio = this.lstAdmision.filter(item => {
      return !this.lstSeleccionadomultiple.some(item2 => item.NroPeticion === item2.NroPeticion);
    });
    this.lstAdmision = [...lstAdmisionLimpio];
    this.bloquearPag = false;
  }

  coreWQuitarUnificacion() {
    this.bloquearPag = true;
    console.log("coreWQuitarUnificacion", this.lstSeleccionadoUnificacion);
    if (this.esListaVacia(this.lstSeleccionadoUnificacion)) {
      this.mostrarMensaje('Debe haber registro en el listado', 'warn');
      this.bloquearPag = false;
      return;
    }

    console.log("llego 1");
    if (this.esListaVacia(this.lstUnificacion)) {
      this.mostrarMensaje('Debe haber registro en el listado', 'warn');
      this.bloquearPag = false;
      return;
    }
    this.lstAdmision = [...new Set([...this.lstAdmision, ...this.lstSeleccionadoUnificacion])];
    let lstAdmisionLimpio = this.lstUnificacion.filter(item => {
      return !this.lstSeleccionadoUnificacion.some(item2 => item.NroPeticion === item2.NroPeticion);
    });
    this.lstUnificacion = [...lstAdmisionLimpio];
    this.bloquearPag = false;
  }


  validarTeclaEnter(evento) {
    if (evento.key == "Enter") {
      if (this.filtro.Documento == null) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'warning',
          title: 'Documento no encontrado revise bien los parametros.'
        })
      } else {
        this.bloquearPag = true;
        let Documento = { Documento: this.filtro.Documento.trim() }
        this.personaService.listarpaginado(Documento).then((res) => {
          console.log("validarTeclaEnter ", res);
          this.bscPersona = res;
          this.filtro.NombreCompleto = res[0].NombreCompleto;
          this.filtro.Persona = res[0].Persona;
          this.editarCampoDocumento = true;
          setTimeout(() => {
            this.bloquearPag = false;
          }, 500);

        });
      }
    }
  }

  verSelectorPaciente(): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECPACIENTE', 'BUSCAR'), "BUSCAR", "N");
  }

  limpiarPersona() {
    this.filtro.Documento = null;
    this.filtro.NombreCompleto = null;
    this.filtro.Persona = null;
    this.editarCampoDocumento = false;
  }

  TeclaEnterUnificacion(evento) {
    if (evento.key == "Enter") {
      if (this.filtroUnificado.Documento == null) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'warning',
          title: 'Documento no encontrado revise bien los parametros.'
        })
      } else {
        this.bloquearPag = true;
        let Documento = { Documento: this.filtroUnificado.Documento.trim() }
        this.personaService.listarpaginado(Documento).then((res) => {
          this.bscPersona = res;
          this.filtroUnificado.NombreCompleto = res[0].NombreCompleto;
          this.filtroUnificado.Persona = res[0].Persona;
          this.editarUnifiDocumento = true;
          setTimeout(() => {
            this.bloquearPag = false;
          }, 500);

        });
      }
    }
  }


  coreBuscarUnificacion(): void {
    this.bloquearPag = true;
    console.log("coreWQuitarUnificacion", this.lstUnificacion);
    if (this.esListaVacia(this.lstUnificacion)) {
      this.mostrarMensaje('Debe haber registro en el listado de Unificación', 'info');
      this.bloquearPag = false;
      return;
    }

    console.log("data filtro", this.filtroUnificado);

    this.bloquearPag = true;
    this.consultaAdmisionService.listarpaginado(this.filtroUnificado).then((res) => {
      var contado = 1;
      res.forEach(element => {
        element.numeroAdmision = contado++;
      });
      this.lstUnificacion = res;
      console.log("consulta Admision grillaCargarDatos:", res);
      setTimeout(() => {
        this.bloquearPag = false;
      }, 100);
    });
  }

  verSelectorUnificacion(): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECUNIFICACION', 'BUSCAR'), "BUSCAR", "N");
  }

  limpiarUnificacion() {
    this.filtroUnificado.Documento = null;
    this.filtroUnificado.NombreCompleto = null;
    this.filtroUnificado.Persona = null;
    this.editarUnifiDocumento = false;
  }

  ValidateUnificar() {
    let valor = 0;
    let salida = "";
    this.lstSeleccionadoUnificacion.forEach(element => {
      valor++;
    });

    if (valor == 0) {
      console.log("ValidateUnificar ", valor);
      salida = "Debe seleccionar las peticion(es) para proceder con la unificación.";
    }

    return salida;
  }


  coreGuardarUnificacion() {

    var validar = this.ValidateUnificar();
    console.log("llegando ", validar);
    this.dialog = false;
    if (validar.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: `¡Mensaje!`,
        text: validar
      }).then((result) => {
        if (result.isConfirmed) {
          this.dialog = true;
        }
      })
    } else {
      Swal.fire({
        title: '¡Importante!',
        text: "¿Seguro que desea Unificar el registro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#094d74',
        cancelButtonColor: '#ffc72f',
        cancelButtonText: 'No, Cancelar!',
        confirmButtonText: 'Si, Unificar!'
      }).then((result) => {
        if (result.isConfirmed) {

          let lstUnificacion = [];

          this.lstSeleccionadoUnificacion.forEach(element => {
            element.ValorEmpresa = element.Valor * element.Cantidad;
            let unificacion = {
              IdAdmision: element.IdAdmision,
              IdPersona: this.filtro.Persona,
              Documento: this.filtroUnificado.Documento,
              IdUnificador: this.filtroUnificado.Persona,
              UsuarioCreacion: this.getUsuarioAuth().data[0].Usuario,
            }

            lstUnificacion.push(unificacion);
          });


          this.consultaAdmisionService.MantenimientoUnificarAtencionPaciente(1, lstUnificacion, this.getUsuarioToken()).then(
            res => {
              this.bloquearPag = true;
              console.log("MantenimientoUnificarAtencionPaciente ::", res);
              this.bloquearPag = false;
              if (res.success == true) {
                this.loading = true;
                this.toastMensaje('Se Unifico el registro con éxito.', 'success', 2000);
                this.loading = false;

                if (this.lstAdmision.length == 0) {
                  this.bloquearPag = true;
                  let product = new dtoPersona();
                  product.Persona = this.filtro.Persona
                  product.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario
                  product.UltimaFechaModif = new Date();
                  console.log(this.filtro);
                  return this.personaService.mantenimientoMaestro(3, product, this.getUsuarioToken()).then(
                    res => {
                      if (res.success) {
                        this.toastMensaje(`La persona ${this.filtro.NombreCompleto} ha sido inactivada`, 'success', 2000)
                        this.dialog = false;
                        this.bloquearPag = false;
                      } else {
                        Swal.fire({
                          icon: 'warning',
                          title: '¡Mensaje!',
                          text: `${res.message}`
                        })
                      }
                    }
                  ).catch(error => error)
                }


              } else {
                this.toastMensaje(`${res.Mensaje}`, 'warning', 2000);
              }
            }).catch(error => error)

        } else {
          this.dialog = true;
        }
      })
    }


  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

}
