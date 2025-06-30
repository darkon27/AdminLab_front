import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { CambioComercialMantenimientoComponent } from '../components/cambio-comercial-mantenimiento.component';
import { CambioComercial } from '../model/CambioComercial';
import { CambioComercialService } from '../Service/cambioComercial.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ngx-cambio-comercial',
  templateUrl: './cambio-comercial.component.html',
  styleUrls: ['./cambio-comercial.component.scss']
})
export class CambioComercialComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(CambioComercialMantenimientoComponent, { static: false }) cambioComercialMantenimientoComponent: CambioComercialMantenimientoComponent;


  bloquearPag: boolean;
  btnEliminar?: boolean;
  btnNuevoAccion?: boolean;
  btnGuardar?: boolean;

  filtro: CambioComercial = new CambioComercial();
  lstInsumo: CambioComercial[] = [];

  lstEstado: SelectItem[] = [];

  constructor(
    private _MessageService: MessageService,
    private _ConfirmationService: ConfirmationService,
    private _CambioComercialService: CambioComercialService
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
    this._CambioComercialService.ListaBusqueda(this.filtro).then((res) => {
      var contado = 1;
      res?.forEach(element => {
        element.num = contado++;
      });
      this.lstInsumo = res?.length > 0 ? res : [];
      this.bloquearPag = false;
    });
  }


  coreNuevo(): void {
    this.cambioComercialMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_NUEVO + 'CAMBIO_COMERCIAL', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO, this.objetoTitulo.menuSeguridad.titulo, 0, {});
  }
  coreVer(row: any) {
    this.cambioComercialMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_VER + 'CAMBIO_COMERCIAL', ''), ConstanteUI.ACCION_SOLICITADA_VER, this.objetoTitulo.menuSeguridad.titulo, 0, row);
  }
  coreEditar(row: any) {
    this.cambioComercialMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_EDITAR + 'CAMBIO_COMERCIAL', ''), ConstanteUI.ACCION_SOLICITADA_EDITAR, this.objetoTitulo.menuSeguridad.titulo, 0, row)
  }
  coreMensaje(mensage: MensajeController): void {
    const dataDevuelta = mensage.resultado;

    switch (mensage.componente.toUpperCase()) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO + 'CAMBIO_COMERCIAL':
      case ConstanteUI.ACCION_SOLICITADA_EDITAR + 'CAMBIO_COMERCIAL':
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
        event.Estado = "I";
        event.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;
        this._CambioComercialService.mantenimiento(ConstanteUI.SERVICIO_SOLICITUD_INACTIVAR, event, this.getUsuarioToken()).then(
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
