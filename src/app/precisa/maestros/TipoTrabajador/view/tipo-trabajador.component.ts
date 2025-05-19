import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem, TreeDragDropService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { TipoTrabajadorMantenimientoComponent } from '../components/tipo-trabajador-mantenimiento.component';
import { TipoTrabajador } from '../model/TipoTrabajador';
import { TipoTrabajadorService } from '../Service/tipoTrabajador.service';
import { forkJoin } from 'rxjs';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';


@Component({
  selector: 'ngx-tipo-trabajador',
  templateUrl: './tipo-trabajador.component.html',
  providers: [TreeDragDropService, MessageService],
  styles: [`
      h4 {
          text-align: center;
          margin: 0 0 8px 0;
      }
  `]
})
export class TipoTrabajadorComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(TipoTrabajadorMantenimientoComponent, { static: false }) tipoTrabajadorMantenimientoComponent: TipoTrabajadorMantenimientoComponent;


  bloquearPag: boolean;
  btnEliminar?: boolean;
  btnNuevoAccion?: boolean;
  btnGuardar?: boolean;

  filtro: TipoTrabajador = new TipoTrabajador();
  lstInsumo: TipoTrabajador[] = [];

  lstEstado: SelectItem[] = [];

  constructor(
    private _MessageService: MessageService,
    private _ConfirmationService: ConfirmationService,
    private _TipoTrabajadorService: TipoTrabajadorService
  ) {
    super();
  }
  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    this.cargarSelect();

  }

  cargarSelect(): void {
    const optTodos = { label: ConstanteAngular.COMBOTODOS, value: null };
    forkJoin({
      estados: this.obtenerDataMaestro('ESTLETRAS'),
    }
    ).subscribe(resp => {
      this.lstEstado = [optTodos, ...resp.estados];
    });
  }

  coreBuscar(): void {
    this.bloquearPag = true;
    this._TipoTrabajadorService.ListaBusqueda(this.filtro).then((res) => {
      var contado = 1;
      res?.forEach(element => {
        element.num = contado++;
      });
      this.lstInsumo = res?.length > 0 ? res : [];
      this.bloquearPag = false;
    });
  }


  coreNuevo(): void {
    this.tipoTrabajadorMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_NUEVO + 'TIPO_TRABAJADOR', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO, this.objetoTitulo.menuSeguridad.titulo, 0, {});
  }
  coreVer(row: any) {
    this.tipoTrabajadorMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_VER + 'TIPO_TRABAJADOR', ''), ConstanteUI.ACCION_SOLICITADA_VER, this.objetoTitulo.menuSeguridad.titulo, 0, row);
  }
  coreEditar(row: any) {
    this.tipoTrabajadorMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_EDITAR + 'TIPO_TRABAJADOR', ''), ConstanteUI.ACCION_SOLICITADA_EDITAR, this.objetoTitulo.menuSeguridad.titulo, 0, row)
  }
  coreMensaje(mensage: MensajeController): void {
    const dataDevuelta = mensage.resultado;

    switch (mensage.componente.toUpperCase()) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO + 'TIPO_TRABAJADOR':
      case ConstanteUI.ACCION_SOLICITADA_EDITAR + 'TIPO_TRABAJADOR':
        this.coreBuscar();
        break;
      default:
        break;
    }
  }

  coreInactivar(event: any) {
    //console.log("llego coreInvactivar", event);
    this._ConfirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm2",
      accept: () => {
        this.bloquearPag = true;
        event.Estado = 2;
        event.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;
        this._TipoTrabajadorService.mantenimiento(ConstanteUI.SERVICIO_SOLICITUD_INACTIVAR, event, this.getUsuarioToken()).then(
          res => {
            if (res.success == true) {
              this.MensajeToastComun('notification', 'success', 'Advertencia', res.mensaje);
              this.coreBuscar();
            } else {
              this.MensajeToastComun('notification', 'warn', 'Advertencia', res.mensaje);
              event.Estado = 1;
            }

          }).catch(error =>
            console.error(error)
          )

        this.bloquearPag = false;
      }
    })
  }

  coreEliminar(): void {
    throw new Error('Method not implemented.');
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

  MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
    this._MessageService.clear();
    this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
  }
}
