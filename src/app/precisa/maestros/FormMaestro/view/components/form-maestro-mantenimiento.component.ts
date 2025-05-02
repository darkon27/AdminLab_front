import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { LazyLoadEvent, MessageService, SelectItem, TreeNode } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../../util/ComponenteBasePrincipa';
import { AppSatate } from '../../../app.reducer';
import * as actions from '../../store/actions';
import { forkJoin, Subscription } from 'rxjs';
import { NodeMaestro } from '../../model/node-maestro';
import { Maestro } from '../../model/maestro';
import { MaestroService } from '../../service/maestro.service';
import { User, UsuarioAuth } from '../../../../auth/model/usuario';
import { Console } from 'console';
import Swal from 'sweetalert2';
import { AuditoriaComponent } from '../../../../../@theme/components/auditoria/auditoria.component';
import { MensajeController } from '../../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../../util/UIMantenimientoController';
import { ConstanteUI } from '../../../../../../util/Constantes/Constantes';
import { ConstanteAngular } from '../../../../../@theme/ConstanteAngular';

@Component({
  selector: 'ngx-form-maestro-mantenimiento',
  templateUrl: './form-maestro-mantenimiento.component.html'
})

export class FormMaestroMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy, UIMantenimientoController {

  @ViewChild(AuditoriaComponent, { static: false }) auditoriaComponent: AuditoriaComponent;

  titulo: string = ''
  accionRealizar: string = ''
  position: string = 'top'
  bloquearPag: boolean;
  visible: boolean;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;

  validarAccion: string = ''
  form: any;
  @Output() obtenerSecuencia = new EventEmitter()
  lstEstados: SelectItem[] = []

  dto: Maestro = new Maestro();


  maestroDetalle: Subscription;
  // usuario: string;
  user: User = new User();

  constructor(
    private store: Store<AppSatate>,
    private toastrService: NbToastrService,
    private maestroService: MaestroService,
    private _MessageService: MessageService,
    private formBuilder: FormBuilder) {
    super();
  }

  ngOnDestroy(): void {
    this.maestroDetalle.unsubscribe()
  }


  ngOnInit(): void {
    this.cargarSelect();
    this.iniciarComponent();
  }

  /*    VALIDATORS    */
  buildForm() {
    this.form = this.formBuilder.group({
      tipousuario: ['', []],
      Perfil: ['', [Validators.required, Validators.maxLength(200)]],
      VaEstado: ['A', [Validators.required]],
      UltimoUsuario: [],
      estado: [],
    });

  }

  cargarSelect(): void {
    const optTodos = { label: ConstanteAngular.COMBOSELECCIONE, value: null };

    forkJoin({
      estados: this.obtenerDataMaestro('ESTGEN'),
    }
    ).subscribe(resp => {
      const dataEstados = resp.estados?.map((ele: any) => ({
        label: ele.label?.trim()?.toUpperCase() || "", value: Number.parseInt(ele.value)
      }));
      this.lstEstados = [...dataEstados];
    });
  }

  coreIniciarComponentemantenimiento(mensaje: MensajeController, accionform: string, titulo: string, page: number, data?: any): void {
    this.bloquearPag = true;
    this.mensajeController = mensaje;
    this.cargarAcciones(accionform, titulo, data)
    this.bloquearPag = false;
  }

  cargarAcciones(accion: string, titulo: string, rowdata?: any) {
    this.titulo = `${titulo}: ${accion}`;
    this.accionRealizar = accion;
    this.dialog = true;

    switch (accion) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.dto = new Maestro();
        this.dto.Estado = 1;
        this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.dto.FechaCreacion = new Date();
        this.puedeEditar = false;

        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.fechaCreacion = new Date();
        this.fechaModificacion = null;
        break;

      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        this.dto = rowdata;
        this.puedeEditar = false;
        this.fechaModificacion = new Date();
        this.fechaCreacion = new Date(rowdata.FechaCreacion);
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

        this.dto.UsuarioModificacion = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.dto.FechaModificacion = new Date();
        break;

      case ConstanteUI.ACCION_SOLICITADA_VER:
        this.dto = rowdata;
        this.puedeEditar = true;
        if (rowdata.FechaModificacion == null || rowdata.FechaModificacion == null) { this.fechaModificacion = null; }
        else { this.fechaModificacion = new Date(rowdata.FechaModificacion); }
        this.fechaCreacion = new Date(rowdata.FechaCreacion);
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        break;
    }

  }




  saveProduct(event: Event) {

    // event.preventDefault();
    // if (!this.puedeEditar) {
    //if (this.form.valid) {
    if (this.validarAccion == "EDITAR") {
      let fechaM = new Date();
      this.dto.FechaModificacion = fechaM;
      this.maestroService.mantenimientoMaestro(2, this.dto, this.getUsuarioToken()).then(
        res => {
          if (res.success) {
            this.dialog = false;
            this.makeToast(this.getMensajeActualizado(res.valor))
          } else {
            this.dialog = false;
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `${res.mensaje}`
            })
          }
        }
      ).catch(error => error)
    }
    else if (this.validarAccion == "NUEVO") {
      this.maestroService.mantenimientoMaestro(1, this.dto, this.getUsuarioToken()).then(
        res => {
          if (res.success) {
            this.makeToast(this.getMensajeGrabado(res.data.CodigoTabla))
            this.dialog = false;
          } else {
            this.dialog = false;
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `${res.mensaje}`
            })
          }
        })
    }
    //}
    // }
  }

  lineaGenerada: string
  generarSecuencia(): string {
    this.obtenerSecuencia.emit();
    return this.lineaGenerada
  }

  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }

  getUsuario(): User {
    let userStorage = JSON.parse(sessionStorage.getItem('access_user'))
    return this.user = userStorage.user[0];
  }

  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }
  coreBuscar(): void {

  }
  async coreGuardar() {
    try {
      let valorAccionServicio: number = this.accionRealizar == ConstanteUI.ACCION_SOLICITADA_NUEVO ? 1 : 2;
      this.bloquearPag = true;

      const consultaRepsonse = await this.maestroService.mantenimientoMaestro(valorAccionServicio, this.dto, this.getUsuarioToken());
     console.log(consultaRepsonse)
      if (consultaRepsonse.success == true) {
        this.MensajeToastComun('notification', 'success', 'Correcto', consultaRepsonse.mensaje);

        this.mensajeController.resultado = consultaRepsonse;
        this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
        this.dialog = false;

      } else {
        this.MensajeToastComun('notification', 'warn', 'Advertencia', consultaRepsonse.mensaje);
      }
    }
    catch (error) {
      console.error(error)
      this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
      this.bloquearPag = false;
    } finally {
      this.bloquearPag = false;
    }
  }
  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }
  coreExportar(): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }
  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }
  MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
    this._MessageService.clear();
    this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
  }

}
