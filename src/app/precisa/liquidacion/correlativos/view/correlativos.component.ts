import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { CorrelativosMantenimientoComponent } from '../components/correlativos-mantenimiento.component';
import { dtoCorrelativo } from '../model/dtoCorrelativo';
import { filtroCorrelativo } from '../model/filtro.Correlativo';
import { CorrelativoService } from '../service/correlativo.Service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ngx-correlativos',
  templateUrl: './correlativos.component.html',
  styleUrls: ['./correlativos.component.scss']
})

export class CorrelativosComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(CorrelativosMantenimientoComponent, { static: false }) correlativosMantenimientoComponent: CorrelativosMantenimientoComponent;
  bloquearPag: boolean;
  lstCompania: SelectItem[] = [];
  lstEstado: SelectItem[] = [];
  lstTipoComprobante: SelectItem[] = [];
  filtro: filtroCorrelativo = new filtroCorrelativo();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  lstGrilla: any[] = [];


  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private CorrelativoService: CorrelativoService,
    private toastrService: NbToastrService,
    private maestrocompaniaMastService: MaestrocompaniaMastService) {
    super();
  }
  btnEliminar?: boolean;
  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }

  coreMensaje(mensage: MensajeController): void {
    const dataDevuelta = mensage.resultado;

    switch (mensage.componente.toUpperCase()) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO + 'CORRELATIVO':
      case ConstanteUI.ACCION_SOLICITADA_EDITAR + 'CORRELATIVO':
        this.coreBuscar();
        break;
      default:
        break;
    }

  }

  coreNuevo(): void {
    this.correlativosMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_NUEVO + 'CORRELATIVO', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO, this.objetoTitulo.menuSeguridad.titulo, 0, {});
  }

  coreEditar(dto) {
    this.correlativosMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_EDITAR + 'CORRELATIVO', ''), ConstanteUI.ACCION_SOLICITADA_EDITAR, this.objetoTitulo.menuSeguridad.titulo, 0, dto);
  }

  coreVer(dto) {
    this.correlativosMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_VER + 'CORRELATIVO', ''), ConstanteUI.ACCION_SOLICITADA_VER, this.objetoTitulo.menuSeguridad.titulo, 0, dto);
  }

  coreBuscar(): void {
    this.bloquearPag = true;
    this.CorrelativoService.ListarCorrelativos(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      this.lstGrilla = res;
      console.log("coreBuscar listado:", res);
    });
  }

  coreInactivar(dto) {
    if (dto.Estado == 3) {
      this.toastMensaje(`El Registro Nro. ${dto.CodigoExpediente} No puede ser Anulado`, 'success', 2000);
      return;
    } else {

      Swal.fire({
        title: '¡Mensaje!',
        text: '¡Desea Anular el Serie: ' + dto.Serie + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#094d74',
        cancelButtonColor: '#ffc72f',
        cancelButtonText: '¡No, Cancelar!',
        confirmButtonText: '¡Si, Anular!'
      }).then((result) => {
        if (result.isConfirmed) {
          var hoy = new Date();
          let Entity: dtoCorrelativo = new dtoCorrelativo();
          Entity.CompaniaCodigo = dto.CompaniaCodigo;
          Entity.TipoComprobante = dto.TipoComprobante;
          Entity.Serie = dto.Serie;
          Entity.Estado = "I";
          Entity.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;
          Entity.UltimaFechaModif = new Date(hoy);
          console.log("coreInactivar  this.Entity ::", Entity);

          return this.CorrelativoService.MantenimientoCorrelativos(3, Entity, this.getUsuarioToken()).then(
            res => {
              if (res.success) {
                this.toastMensaje(`El Registro Nro. ${Entity.Serie} fue inactivado`, 'success', 2000);
                this.coreBuscar();
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
  }


  coreGuardar(): void {

  }

  coreExportar(): void {

  }

  coreSalir(): void {

  }

  ngOnInit(): void {
    this.bloquearPag = true;
    this.tituloListadoAsignar(1, this);
    this.cargarSelect();
    this.bloquearPag = false;

  }

  cargarSelect(): void {
    const optTodos = { label: ConstanteAngular.COMBOTODOS, value: null };
    this.FiltroCompan.estado = "A";

    forkJoin({
      estados: this.obtenerDataMaestro('ESTLETRAS'),
      tipoComprobantes: this.obtenerDataMaestro('TIPOCOMPROBANTE'),
      companias: this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan),
    }
    ).subscribe(resp => {
      this.lstEstado = [optTodos, ...resp.estados];
      this.lstTipoComprobante = [optTodos, ...resp.tipoComprobantes];

      const dataCompania = resp.companias.map((ele: any) => ({
        label: ele.DescripcionCorta?.trim()?.toUpperCase() || "", value: `${ele.CompaniaCodigo?.trim() || ""}00`, title: ele.Persona || ""
      }));
      this.lstCompania = [optTodos, ...dataCompania];
    });
  }
}
