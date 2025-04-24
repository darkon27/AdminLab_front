import { Component, OnInit, ViewChild } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { ProduccionMantenimientoComponent } from '../components/produccion-mantenimiento.component';
import { dtoPeriodo } from '../model/dtoPeriodo';
import { filtroProduccion } from '../model/filtro.produccion';
import { ProduccionService } from '../service/produccion.services';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ngx-produccion',
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.scss']
})
export class ProduccionComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  @ViewChild(ProduccionMantenimientoComponent, { static: false }) produccionMantenimientoComponent: ProduccionMantenimientoComponent;
  filtro: filtroProduccion = new filtroProduccion();
  lstProduccion: any[] = [];
  lstPeriodo: SelectItem[] = [];
  dto: Maestro[] = []
  bloquearPag: boolean;
  seleccion: any;
  filtroPeriodo: dtoPeriodo = new dtoPeriodo();

  lstEstado: SelectItem[] = [];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private ProduccionService: ProduccionService,
    private toastrService: NbToastrService) {
    super();
  }
  ngOnInit(): void {
    try {
      this.bloquearPag = true;
      this.tituloListadoAsignar(1, this);
      this.iniciarComponent();
      this.cargarSelect();
    } catch (error) {
      console.error('Hubo un error al iniciar componente: ERROR::' + error);
    }
    finally {
      this.bloquearPag = false;
    }
  }

  cargarSelect(): void {
    const optTodos = { label: ConstanteAngular.COMBOTODOS, value: null };

    forkJoin({
      estados: this.obtenerDataMaestro('ESTLIQ'),
      periodos: this.ProduccionService.ListarPeriodoEmision({ UneuNegocioId: 1 })
    }
    ).subscribe(resp => {
      this.lstEstado = [optTodos, ...resp.estados];

      const dataPeriodos = resp.periodos.map((item: any) => ({
        label: item.Nombre, value: item.Codigo
      }));
      this.lstPeriodo = [optTodos, ...dataPeriodos];
    });
  }

  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  mensajeValidacion(icono: SweetAlertIcon, title: any, text: string, tipo: string): boolean {
    switch (tipo) {
      case "N_Rpta":
        Swal.fire({
          icon: icono,
          title: title,
          text: text
        })
        return false;
      case "S_Rpta":
        Swal.fire({
          title: title,
          text: text,
          icon: icono,
          showCancelButton: true,
          confirmButtonColor: '#094d74',
          cancelButtonColor: '#ffc72f',
          cancelButtonText: 'No, Cancelar!',
          confirmButtonText: 'Si, Guardar!'
        }).then((result) => { return result.isConfirmed });
        break;
    }
  }

  async coreBuscar() {
    this.bloquearPag = true;
    console.log("Lote coreBuscar:", this.filtro);


    if (this.estaVacio(this.filtro.Periodo)) {
      this.mensajeValidacion('warning',
        `¡Completar Campos Obligatorios!`,
        "Seleccione un periodo",
        "N_Rpta");
      this.bloquearPag = false;
      return;
    }
    this.ProduccionService.ListarProduccionGeneral(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = res.length;
      res.forEach((element) => {
        element.num = contado--;
      });
      this.lstProduccion = res;
      console.log("maestro CONTRATO listado:", res);
    });
  }

  coreVer(): void {
    throw new Error('Method not implemented.');
  }

  coreNuevo(): void {
    this.produccionMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'NUEVOPERIODO', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO, ConstanteUI.ACCION_SOLICITADA_NUEVO, 0, {});
  }
  coreEditar(): void {
    this.produccionMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'EDITARPERIODO', ''), ConstanteUI.ACCION_SOLICITADA_EDITAR, ConstanteUI.ACCION_SOLICITADA_EDITAR, 0, {});
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
    console.log("FILA SELECCIONADA:", event.data);
    this.seleccion = event.data
  }


}
