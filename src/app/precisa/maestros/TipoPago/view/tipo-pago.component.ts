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

@Component({
  selector: 'ngx-tipo-pago',
  templateUrl: './tipo-pago.component.html',
  styleUrls: ['./tipo-pago.component.scss']
})

export class TipoPagoComponent extends ComponenteBasePrincipal implements OnInit,UIMantenimientoController {
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private toastrService: NbToastrService,
    private TipoPagoService: TipoPagoService) {
    super();
  }
  btnEliminar?: boolean;
  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }

  coreMensaje(mensage: MensajeController): void {
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
    this.TipoPagoService.ListarTipoPago(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      this.lst = res;
      console.log("coreBuscar listado:", res);
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
    this.filtro.Estado=1;
  }

  defaultBuscar(event) {
    if (event.keyCode === 13) {
      this.coreBuscar();
    }
  }

/*   coreEditar(dto): void{
    this.tipoPagoMantenimientoComponent.iniciarComponente("EDITAR",this.objetoTitulo.menuSeguridad.titulo)
  }
 */
  coreNuevo(): void {
    this.tipoPagoMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MODELO', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo);
  }

  coreEditar(row) {
    this.tipoPagoMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MODELO', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, row);
  }

  coreVer(row) {
    this.tipoPagoMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MODELO', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, row);
  }


}
