import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { TipoPagoMantenimientoComponent } from '../components/tipo-pago-mantenimiento.component';
import { TipoPago } from '../model/TipoPago';
import { TipoPagoService } from '../service/TipoPagoService';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-tipo-pago',
  templateUrl: './tipo-pago.component.html',
  styleUrls: ['./tipo-pago.component.scss']
})

export class TipoPagoComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(TipoPagoMantenimientoComponent, { static: false }) tipoPagoMantenimientoComponent: TipoPagoMantenimientoComponent;
  bloquearPag: boolean;
  filtro: TipoPago = new TipoPago();
  lst: any[] = [];
  lstEstado: SelectItem[] = [];
  verMantPersona: boolean = false;
  validarAccion: string;
  acciones: string = ''
  position: string = 'top'
  titulo: string;
  registroSeleccionado: any;
  loading: boolean;

  constructor(
    private _TipoPagoService: TipoPagoService,
    private _ConfirmationService: ConfirmationService,
    private _MessageService: MessageService,
  ) {
    super();
  }
  btnEliminar?: boolean;
  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }




  coreBuscar(): void {
    if (!this.estaVacio(this.filtro.Codigo)) {
      this.filtro.Codigo = this.filtro.Codigo.trim();
    }
    if (!this.estaVacio(this.filtro.Nombre)) {
      this.filtro.Nombre = this.filtro.Nombre.trim();
    }

    this.bloquearPag = true;
    this._TipoPagoService.ListarTipoPago(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      this.lst = res;
      //console.log("coreBuscar listado:", res);
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

  coreInactivar(data: any) {
    //console.log("llego coreInvactivar", event);
    this._ConfirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm2",
      accept: () => {
        this.bloquearPag = true;
        data.Estado = "I";
        data.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;
        this._TipoPagoService.MantenimientoTipoPago(ConstanteUI.SERVICIO_SOLICITUD_INACTIVAR, data, this.getUsuarioToken()).then(
          res => {
            if (res.success == true) {
              this.MensajeToastComun('notification', 'success', 'Advertencia', res.mensaje);
              this.coreBuscar();
            } else {
              this.MensajeToastComun('notification', 'warn', 'Advertencia', res.mensaje);
            }

          }).catch(error =>
            console.error(error)
          )

        this.bloquearPag = false;
      }
    })
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    const p4 = this.tituloListadoAsignar(1, this);
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
    await this.iniciarComponent();
    await this.cargarEstados();
  }

  cargarEstados() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstado.push({ label: i.Nombre, value: i.IdCodigo });
    });
    this.filtro.Estado = 1;
  }

  defaultBuscar(event) {
    if (event.keyCode === 13) {
      this.coreBuscar();
    }
  }

  coreNuevo(): void {
    this.tipoPagoMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_NUEVO + 'TIPOPAGO', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO, this.objetoTitulo.menuSeguridad.titulo, 0, {});
  }
  coreVer(row: any) {
    this.tipoPagoMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_VER + 'TIPOPAGO', ''), ConstanteUI.ACCION_SOLICITADA_VER, this.objetoTitulo.menuSeguridad.titulo, 0, row);
  }
  coreEditar(row: any) {
    this.tipoPagoMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_EDITAR + 'TIPOPAGO', ''), ConstanteUI.ACCION_SOLICITADA_EDITAR, this.objetoTitulo.menuSeguridad.titulo, 0, row)
  }
  coreMensaje(mensage: MensajeController): void {
    const dataDevuelta = mensage.resultado;

    switch (mensage.componente.toUpperCase()) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO + 'TIPOPAGO':
      case ConstanteUI.ACCION_SOLICITADA_EDITAR + 'TIPOPAGO':
        this.coreBuscar();
        break;
      default:
        break;
    }
  }

  MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
    this._MessageService.clear();
    this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
  }

}
