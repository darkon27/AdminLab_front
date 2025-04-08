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
import { CorrelativoService } from '../service/correlativo.Services';

@Component({
  selector: 'ngx-correlativos',
  templateUrl: './correlativos.component.html',
  styleUrls: ['./correlativos.component.scss']
})

export class CorrelativosComponent extends ComponenteBasePrincipal implements OnInit,UIMantenimientoController {
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

  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  coreNuevo(): void {
    this.correlativosMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'NUEVO', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO, ConstanteUI.ACCION_SOLICITADA_NUEVO, 0, {});
  }

  coreEditar(dto){
    console.log("coreEditar :", dto);
      this.correlativosMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'EDITAR', ''), ConstanteUI.ACCION_SOLICITADA_EDITAR, ConstanteUI.ACCION_SOLICITADA_NUEVO, 0,dto);
  }

  coreVer(dto){
    console.log("coreVer :", dto);
    this.correlativosMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'VER', ''), ConstanteUI.ACCION_SOLICITADA_VER, ConstanteUI.ACCION_SOLICITADA_NUEVO, 0,dto);
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
    throw new Error('Method not implemented.');
  }

  coreExportar(): void {
    throw new Error('Method not implemented.');
  }

  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    const p4 = this.tituloListadoAsignar(1, this);
    Promise.all([p4]).then(
      f => {
        setTimeout(() => {
          this.iniciarComponent();
          this.cargarEstados();
          this.listaComboTipoComprobante();
          this.listaCombocompania();
          this.bloquearPag = false;
        }, 100);
      });
    this.bloquearPag = false;
  }


  private cargarEstados() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    const lstEstados: any[] = this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLETRAS")
    this.lstEstado = [...this.lstEstado, ...lstEstados.map((item) => { return { label: item.Nombre.toLocaleUpperCase(), value: item.Codigo } })]
  }


  defaultBuscar(event) {
    if (event.keyCode === 13) {
      this.coreBuscar();
    }
  }

  listaComboTipoComprobante() {
    this.lstTipoComprobante = [];
    this.lstTipoComprobante.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOCOMPROBANTE").forEach(i => {
      this.lstTipoComprobante.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    console.log("llego cargarComboTipoComprobante", this.lstTipoComprobante);
  }

  listaCombocompania(): Promise<number> {
    this.lstCompania = [];
    this.FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {
      console.log("listarCompaniaMast", res);
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim().toUpperCase(), value: ele.CompaniaCodigo.trim()+"00", title: ele.Persona });
      });
      return 1;
    });
  }

}
