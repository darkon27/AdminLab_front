import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../FormMaestro/model/maestro';
import { InsumoMantenimientoComponent } from '../components/insumo-mantenimiento.component';
import { InsumoService } from '../services/insumo.service';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { forkJoin } from 'rxjs';
import { Insumo } from '../model/Insumo';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-insumo',
  templateUrl: './insumo.component.html',
  styleUrls: ['./insumo.component.scss']
})
export class InsumoComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {


  @ViewChild(InsumoMantenimientoComponent, { static: false }) insumoMantenimientoComponent: InsumoMantenimientoComponent;

  bloquearPag: boolean;
  btnEliminar?: boolean;
  btnNuevoAccion?: boolean;
  btnGuardar?: boolean;

  filtro: Insumo = new Insumo();
  lstInsumo: Insumo[] = [];

  lstEstado: SelectItem[] = [];

  constructor(
    private _MessageService: MessageService,
    private _ConfirmationService: ConfirmationService,
    private _InsumoService: InsumoService,
    private toastrService: NbToastrService) {
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
      estados: this.obtenerDataMaestro('ESTGEN'),
    }
    ).subscribe(resp => {
      const dataEstados = resp.estados?.map((ele: any) => ({
        label: ele.label?.trim()?.toUpperCase() || "", value: Number.parseInt(ele.value)
      }));
      this.lstEstado = [optTodos, ...dataEstados];
    });
  }
  coreBuscar(): void {
    this.bloquearPag = true;
    this._InsumoService.ListaInsumo(this.filtro).then((res) => {
      var contado = 1;
      res?.forEach(element => {
        element.num = contado++;
      });
      this.lstInsumo = res?.length > 0 ? res : [];
      this.bloquearPag = false;
    });
  }


  coreNuevo(): void {
    this.insumoMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_NUEVO + 'INSUMO', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO, this.objetoTitulo.menuSeguridad.titulo, 0, {});
  }
  coreVer(row: any) {
    this.insumoMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_VER + 'INSUMO', ''), ConstanteUI.ACCION_SOLICITADA_VER, this.objetoTitulo.menuSeguridad.titulo, 0, row);
  }
  coreEditar(row: any) {
    this.insumoMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_EDITAR + 'INSUMO', ''), ConstanteUI.ACCION_SOLICITADA_EDITAR, this.objetoTitulo.menuSeguridad.titulo, 0, row)
  }
  coreMensaje(mensage: MensajeController): void {
    const dataDevuelta = mensage.resultado;

    switch (mensage.componente.toUpperCase()) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO + 'INSUMO':
      case ConstanteUI.ACCION_SOLICITADA_EDITAR + 'INSUMO':
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
        this._InsumoService.mantenimientoInsumo(ConstanteUI.SERVICIO_SOLICITUD_INACTIVAR, event, this.getUsuarioToken()).then(
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