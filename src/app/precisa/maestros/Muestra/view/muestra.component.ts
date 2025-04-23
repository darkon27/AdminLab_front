import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'jspdf-autotable';
import { MenuItem, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Muestra } from '../model/Muestra';
import { MuestraService } from '../service/MuestraServicio';
import { MuestrasMantenimientoComponent } from './components/muestra-mantenimiento.component';

@Component({
  selector: 'ngx-muestra',
  templateUrl: './muestra.component.html',
  styleUrls: ['./muestra.component.scss']
})
export class MuestraComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(MuestrasMantenimientoComponent, { static: false }) muestraMantenimientoComponent: MuestrasMantenimientoComponent;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  bloquearPag: boolean;
  filtro: Muestra = new Muestra();
  lsttipoAdmision: any[] = [];
  lstEstado: SelectItem[] = [];
  ltsExportar: MenuItem[];
  verMantPersona: boolean = false;
  validarAccion: string;
  acciones: string = ''
  position: string = 'top'
  titulo: string; 
  registroSeleccionado: any;
  loading: boolean;

  constructor(
    private messageService: MessageService,
    private exportarService: ExportarService,
    private MuestraService: MuestraService,
    private confirmationService: ConfirmationService) {
    super();
  }

  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
  }

  coreNuevo(): void {
    this.openNew();
  }
  coreBuscar(): void {
    if (!this.estaVacio(this.filtro.MosDescripcion)) {
      this.filtro.MosDescripcion = this.filtro.MosDescripcion.trim();
    }
    this.bloquearPag = true;
    this.ModeloServicioService.ListarModeloServicio(this.filtro).then((res) => {
        this.bloquearPag = false;
        var contado = 1;
        res.forEach(element => {
          element.num = contado++;
        });
        this.lstModeloServicio = res;
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


  openNew() {
    this.muestraMantenimientoComponent.iniciarComponente('NUEVO',this.objetoTitulo.menuSeguridad.titulo)
  }
}
